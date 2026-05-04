import { BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Helper to delay response
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Mock Database in LocalStorage
const getDb = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(`mock_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const saveDb = (key: string, data: any) => {
  localStorage.setItem(`mock_${key}`, JSON.stringify(data));
};

let users = getDb("users", []);
let files = getDb("files", []);
let apiKeys = getDb("apikeys", []);

export const mockBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: any; params?: any },
  unknown,
  unknown
> = async ({ url, method = "GET", body, params }) => {
  await delay(500); // Simulate network delay

  console.log(`[MOCK API] ${method} ${url}`, { body, params });

  try {
    // ----------------------------------------
    // AUTHENTICATION
    // ----------------------------------------
    if (url === "/auth/register" && method === "POST") {
      const { name, email, password } = body;
      if (users.find((u: any) => u.email === email)) {
        return { error: { status: 400, data: { message: "User already exists" } } };
      }
      const newUser = { id: Date.now().toString(), name, email, password, profilePicture: "https://github.com/shadcn.png" };
      users.push(newUser);
      saveDb("users", users);
      return { data: { message: "Registered successfully" } };
    }

    if (url === "/auth/login" && method === "POST") {
      const { email, password } = body;
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      // Allow a default login if no users exist for easy testing
      if (!user && email === "test@example.com") {
        const defaultUser = { id: Date.now().toString(), name: "Test User", email, password, profilePicture: "https://github.com/shadcn.png" };
        users.push(defaultUser);
        saveDb("users", users);
        return {
          data: {
            accessToken: "mock_jwt_token_" + Date.now(),
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            user: { id: defaultUser.id, name: defaultUser.name, email: defaultUser.email, profilePicture: defaultUser.profilePicture },
            reportSetting: { id: "rep1", frequency: "weekly", isEnabled: true }
          },
        };
      }

      if (!user) {
        return { error: { status: 401, data: { message: "Invalid credentials" } } };
      }
      return {
        data: {
          accessToken: "mock_jwt_token_" + Date.now(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          user: { id: user.id, name: user.name, email: user.email, profilePicture: user.profilePicture },
          reportSetting: { id: "rep1", frequency: "weekly", isEnabled: true }
        },
      };
    }

    // ----------------------------------------
    // USER
    // ----------------------------------------
    if (url === "/user/update" && method === "PATCH") {
      const { name } = body;
      if (users.length > 0) {
        users[users.length - 1].name = name;
        saveDb("users", users);
        return { data: { message: "User updated successfully", user: users[users.length - 1] } };
      }
      return { error: { status: 401, data: { message: "Unauthorized" } } };
    }

    // ----------------------------------------
    // FILES
    // ----------------------------------------
    if (url === "/files/upload" && method === "POST") {
      // Mocking FormData upload is tricky, we'll just create a dummy file
      const newFile = {
        _id: Date.now().toString(),
        userId: users[0]?.id || "mock_user",
        originalName: "mock_uploaded_file.txt",
        size: 1024,
        formattedSize: "1 KB",
        ext: ".txt",
        mimeType: "text/plain",
        url: "https://via.placeholder.com/150",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedVia: "WEB"
      };
      files.push(newFile);
      saveDb("files", files);
      return {
        data: {
          message: "Files uploaded successfully",
          data: [
            {
              fileId: newFile._id,
              url: newFile.url,
              originalName: newFile.originalName,
              size: newFile.size,
              ext: newFile.ext,
              mimeType: newFile.mimeType
            }
          ],
          failedCount: 0
        }
      };
    }

    if (url === "/files/all" && method === "GET") {
      const pageNumber = params?.pageNumber || 1;
      const pageSize = params?.pageSize || 10;
      let filteredFiles = files;
      if (params?.keyword) {
        filteredFiles = files.filter((f: any) => f.originalName.includes(params.keyword));
      }
      
      const start = (pageNumber - 1) * pageSize;
      const paginatedFiles = filteredFiles.slice(start, start + pageSize);

      return {
        data: {
          message: "Files retrieved successfully",
          files: paginatedFiles,
          pagination: {
            pageSize,
            pageNumber,
            totalCount: filteredFiles.length,
            totalPages: Math.ceil(filteredFiles.length / pageSize),
            skip: start
          }
        },
      };
    }

    if (url === "/files/bulk-delete" && method === "DELETE") {
      const { fileIds } = body;
      const initialCount = files.length;
      files = files.filter((f: any) => !fileIds.includes(f._id));
      saveDb("files", files);
      return {
        data: {
          message: "Files deleted successfully",
          deletedCount: initialCount - files.length,
          failedCount: 0
        }
      };
    }

    if (url === "/files/download" && method === "POST") {
      return {
        data: {
          message: "Download link generated",
          downloadUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          isZip: body.fileIds?.length > 1
        }
      };
    }

    // ----------------------------------------
    // ANALYTICS
    // ----------------------------------------
    if (url === "/analytics/user" && method === "GET") {
      const totalStorageUsed = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
      return {
        data: {
          message: "Analytics retrieved successfully",
          storage: {
            totalStorageUsed,
            formattedTotalStorageUsed: "1 MB",
            totalFiles: files.length,
            storageLimit: 10737418240, // 10 GB
            formattedStorageLimit: "10 GB",
            storageUsedPercentage: 0.01,
            filesByType: []
          },
          chartData: [
            { date: "2024-01-01", count: 1, size: 1024 }
          ]
        }
      };
    }

    // ----------------------------------------
    // API KEYS
    // ----------------------------------------
    if (url === "/apikey/create" && method === "POST") {
      const newKey = {
        _id: Date.now().toString(),
        name: body.name,
        key: "sk_live_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
      };
      apiKeys.push(newKey);
      saveDb("apikeys", apiKeys);
      return {
        data: {
          message: "API Key created successfully",
          apiKey: newKey
        }
      };
    }

    if (url === "/apikey/all" && method === "GET") {
      return {
        data: {
          message: "API Keys retrieved",
          apiKeys,
          pagination: {
            pageSize: 10,
            pageNumber: 1,
            totalCount: apiKeys.length,
            totalPages: 1,
            skip: 0
          }
        },
      };
    }

    if (url.startsWith("/apikey/") && method === "DELETE") {
      const id = url.split("/").pop();
      apiKeys = apiKeys.filter((k: any) => k._id !== id);
      saveDb("apikeys", apiKeys);
      return { data: { message: "API Key deleted successfully" } };
    }

    console.warn(`[MOCK API] Unhandled request: ${method} ${url}`);
    return { error: { status: 404, data: { message: "Not found" } } };
  } catch (error: any) {
    console.error("[MOCK API Error]", error);
    return { error: { status: 500, data: { message: error.message } } };
  }
};
