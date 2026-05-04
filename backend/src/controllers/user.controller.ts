import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHander.middleware';
import { updateUserByIdService } from '../services/user.service';
import { HTTPSTATUS } from '../config/http.config';

export const updateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const body = req.body;

    const user = await updateUserByIdService(userId, body);

    res.status(HTTPSTATUS.OK).json({
      message: 'User updated successfully',
      user,
    });
  },
);
