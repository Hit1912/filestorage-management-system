import mongoose from 'mongoose';
import path from 'path';
import { PassThrough, Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import archiver from 'archiver';
import FileModel, { UploadSourceEnum } from '../models/file.model';
import UserModel from '../models/user.model';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/app-error';
import { sanitizeFilename } from '../utils/helper';
import { logger } from '../utils/logger';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Env } from '../config/env.config';
import { s3 } from '../config/aws-s3.config';
import { mockDb, saveMockDb } from '../config/mock-db';
import { formatBytes } from '../utils/format-byte';

export const uploadFilesService = async (
  userId: string,
  files: Express.Multer.File[],
  uploadedVia: keyof typeof UploadSourceEnum,
) => {
  if (Env.MOCK_MODE === 'true') {
    const user = mockDb.users.find((u: any) => u._id === userId);
    if (!user) throw new UnauthorizedException('Unauthorized access');
    if (!files?.length) throw new BadRequestException('No files provided');

    const successfulRes = files.map((file) => {
      const fileId = uuidv4();
      const ext = path.extname(file.originalname)?.slice(1)?.toLowerCase() || '';
      
      const mockFile = {
        _id: fileId,
        userId,
        storageKey: `mock/${userId}/${fileId}-${file.originalname}`,
        originalName: file.originalname,
        uploadVia: uploadedVia,
        size: file.size,
        ext,
        url: '',
        mimeType: file.mimetype,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockDb.files.push(mockFile);
      
      const userStorage = mockDb.storage.find((s: any) => s.userId === userId);
      if (userStorage) {
        userStorage.totalSize += file.size;
      }

      return {
        fileId,
        originalName: mockFile.originalName,
        size: mockFile.size,
        ext: mockFile.ext,
        mimeType: mockFile.mimeType,
      };
    });

    saveMockDb();

    return {
      message: `Uploaded successfully ${successfulRes.length} out of ${files.length} files`,
      data: successfulRes,
      failedCount: 0,
    };
  }

  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new UnauthorizedException('Unauthorized access');
  if (!files?.length) throw new BadRequestException('No files provided');

  const results = await Promise.allSettled(
    files.map(async (file) => {
      let _storageKey: string | null = null;
      try {
        const { storageKey } = await uploadToS3(file, userId);
        _storageKey = storageKey;
        const createdFile = await FileModel.create({
          userId,
          storageKey,
          originalName: file.originalname,
          uploadVia: uploadedVia,
          size: file.size,
          ext: path.extname(file.originalname)?.slice(1)?.toLowerCase(),
          url: '',
          mimeType: file.mimetype,
        });

        return {
          fileId: createdFile._id,
          originalName: createdFile.originalName,
          size: createdFile.size,
          ext: createdFile.ext,
          mimeType: createdFile.mimeType,
        };
      } catch (error) {
        logger.error('Error uploading file', error);
        if (_storageKey) {
          //delete from s3 bucket
        }
        throw error;
      }
    }),
  );

  const successfulRes = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  const failedRes = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason.message);

  if (failedRes.length > 0) {
    logger.warn('Failed to upload files', files);
    // throw new InternalServerException(
    //   ` Failed to upload ${failedRes.length} out of ${files.length} files`,
    // );
  }

  return {
    message: `Uploaded successfully ${successfulRes.length} out of ${files.length} files`,
    data: successfulRes,
    failedCount: failedRes.length,
  };
};

export const getAllFilesService = async (
  userId: string,
  filter: {
    keyword?: string;
  },
  pagination: { pageSize: number; pageNumber: number },
) => {
  const { keyword } = filter;
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  if (Env.MOCK_MODE === 'true') {
    let mockFiles = mockDb.files.filter((f: any) => f.userId === userId);
    if (keyword) {
      mockFiles = mockFiles.filter((f: any) => 
        f.originalName.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    const totalCount = mockFiles.length;
    mockFiles.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const paginatedFiles = mockFiles.slice(skip, skip + pageSize);
    const filesWithUrls = paginatedFiles.map((file: any) => ({
      ...file,
      url: `https://placehold.co/600x400?text=${encodeURIComponent(file.originalName)}`,
      formattedSize: formatBytes(file.size),
    }));

    return {
      files: filesWithUrls,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        skip,
      },
    };
  }

  const filterConditons: Record<string, any> = {
    userId,
  };

  if (keyword) {
    filterConditons.$or = [
      {
        originalName: {
          $regex: keyword,
          $options: 'i',
        },
      },
    ];
  }

  const [files, totalCount] = await Promise.all([
    FileModel.find(filterConditons)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    FileModel.countDocuments(filterConditons),
  ]);

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const url = await getFileFromS3({
        storageKey: file.storageKey,
        mimeType: file.mimeType,
        expiresIn: 3600,
      });

      return {
        ...file.toObject(),
        url,
        storageKey: undefined,
      };
    }),
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    files: filesWithUrls,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getFileUrlService = async (fileId: string) => {
  if (Env.MOCK_MODE === 'true') {
    const file = mockDb.files.find((f: any) => f._id === fileId);
    if (!file) throw new NotFoundException('File not found');
    
    const stream = new Readable();
    stream.push('Mock file content');
    stream.push(null);

    return {
      url: '',
      stream,
      contentType: file.mimeType,
      fileSize: file.size || Buffer.byteLength('Mock file content'),
    };
  }

  const file = await FileModel.findOne({ _id: fileId });
  if (!file) throw new NotFoundException('File not found');
  //stream
  const stream = await getS3ReadStream(file.storageKey);

  // const url = await getFileFromS3({
  //   storageKey: file.storageKey,
  //   mimeType: file.mimeType,
  //   expiresIn: 3600,
  // });

  return {
    url: '',
    stream,
    contentType: file.mimeType,
    fileSize: file.size,
  };
};

export const deleteFilesService = async (
  userId: string,
  fileIds: string[],
): Promise<{ deletedCount: number; failedCount: number }> => {
  if (Env.MOCK_MODE === 'true') {
    const initialLen = mockDb.files.length;
    let deletedSize = 0;
    
    mockDb.files = mockDb.files.filter((f: any) => {
      if (f.userId === userId && fileIds.includes(f._id)) {
        deletedSize += f.size;
        return false;
      }
      return true;
    });
    
    const userStorage = mockDb.storage.find((s: any) => s.userId === userId);
    if (userStorage) {
      userStorage.totalSize = Math.max(0, userStorage.totalSize - deletedSize);
    }
    
    saveMockDb();
    
    const deletedCount = initialLen - mockDb.files.length;
    return { deletedCount, failedCount: 0 };
  }

  const session = await mongoose.startSession();
  try {
    let result = { deletedCount: 0, failedCount: 0 };

    //  withTransaction handles the transaction, rollback
    await session.withTransaction(async () => {
      const files = await FileModel.find({ _id: { $in: fileIds }, userId }).session(
        session,
      );
      if (!files.length) throw new NotFoundException('No files found');

      const s3Errors: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          try {
            await deleteFromS3(file.storageKey);
          } catch (error) {
            logger.error(`Failed to delete ${file.storageKey} from s3`, error);
            s3Errors.push(file.storageKey);
          }
        }),
      );
      const successfulFileIds = files
        .filter((file) => !s3Errors.includes(file.storageKey))
        .map((file) => file._id);

      const { deletedCount } = await FileModel.deleteMany({
        _id: { $in: successfulFileIds },
        userId,
      }).session(session);

      if (s3Errors.length > 0) {
        logger.warn(`Failed to delete ${s3Errors.length} files form S3`);
      }

      result = {
        deletedCount,
        failedCount: s3Errors.length,
      };
    });
    return result;
  } catch(error){
    throw error
  } finally{
    await session.endSession()
  }
};

export const downloadFilesService = async (
  userId: string,
  fileIds: string[],
) => {
  if (Env.MOCK_MODE === 'true') {
    const files = mockDb.files.filter((f: any) => fileIds.includes(f._id) && f.userId === userId);
    if (!files.length) throw new NotFoundException('No files found');
    
    if (files.length === 1) {
      return {
        url: `https://placehold.co/600x400?text=${encodeURIComponent(files[0].originalName)}`,
        isZip: false,
      };
    }
    return {
      url: 'https://placehold.co/600x400?text=Mock+Archive.zip',
      isZip: true,
    };
  }

  const files = await FileModel.find({
    _id: { $in: fileIds, },
     userId,
  });
  if (!files.length) throw new NotFoundException('No files found');

  if (files.length === 1) {
    const signedUrl = await getFileFromS3({
      storageKey: files[0].storageKey,
      filename: files[0].originalName,
    });

    return {
      url: signedUrl,
      isZip: false,
    };
  }

  const url = await handleMultipleFilesDownload(files, userId);

  return {
    url,
    isZip: true,
  };
};

async function handleMultipleFilesDownload(
  files: Array<{ storageKey: string; originalName: string }>,
  userId: string,
) {
  const timestamp = Date.now();

  const zipKey = `temp-zips/${userId}/${timestamp}.zip`;

  const zipFilename = `dhrnest-${timestamp}.zip`;

  const zip = archiver('zip', { zlib: { level: 6 } });

  const passThrough = new PassThrough();

  zip.on('error', (err) => {
    passThrough.destroy(err);
  });

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: Env.AWS_S3_BUCKET!,
      Key: zipKey,
      Body: passThrough,
      ContentType: 'application/zip',
    },
  });

  zip.pipe(passThrough);

  for (const file of files) {
    try {
      const stream = await getS3ReadStream(file.storageKey);
      zip.append(stream, { name: sanitizeFilename(file.originalName) });
    } catch (error: any) {
      zip.destroy(error);
      throw error;
    }
  }

  await zip.finalize();

  await upload.done();

  const url = await getFileFromS3({
    storageKey: zipKey,
    filename: zipFilename,
    expiresIn: 3600,
  });

  return url;
}

async function uploadToS3(
  file: Express.Multer.File,
  userId: string,
  meta?: Record<string, string>,
) {
  try {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    const cleanName = sanitizeFilename(basename).substring(0, 64);

    logger.info(sanitizeFilename(basename), cleanName);

    const storageKey = `users/${userId}/${uuidv4()}-${cleanName}${ext}`;

    const command = new PutObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
      Body: file.buffer,
      ...(meta && { Metadata: meta }),
    });

    await s3.send(command);

    // const url = `https://${Env.AWS_S3_BUCKET}.s3.${Env.AWS_REGION}.amazonaws.com/${storageKey}`;

    return {
      storageKey,
    };
  } catch (error) {
    logger.error('AWS Error Failed upload', error);
    throw error;
  }
}

async function getFileFromS3({
  storageKey,
  filename,
  mimeType,
  expiresIn = 60,
}: {
  storageKey: string;
  expiresIn?: number;
  filename?: string;
  mimeType?: string;
}) {
  try {
    const command = new GetObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
      ...(!filename && {
        ResponseContentType: mimeType,
        ResponseContentDisposition: `inline`,
      }),

      ...(filename && {
        ResponseContentDisposition: `attachment;filename="${filename}"`,
      }),
    });

    return await getSignedUrl(s3, command, { expiresIn });
  } catch (error) {
    logger.error(`Failed to get file from S3: ${storageKey}`);
    throw error;
  }
}

async function getS3ReadStream(storageKey: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
    });
    const response = await s3.send(command);

    if (!response.Body) {
      logger.error(`No body returned for key: ${storageKey}`);
      throw new InternalServerException(`No body returned for key`);
    }
    return response.Body as Readable;
  } catch (error) {
    logger.error(`Error getting s3 stream for key: ${storageKey}`);
    throw new InternalServerException(`Failed to retrieve file`);
  }
}

async function deleteFromS3(storageKey: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: Env.AWS_S3_BUCKET!,
      Key: storageKey,
    });
    await s3.send(command);
  } catch (error) {
    logger.error(`Failed to delete file from S3`, storageKey);
    throw error;
  }
}
