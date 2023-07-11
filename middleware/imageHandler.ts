import { Request, Response, NextFunction } from "express";
import { fileTypeFromBuffer } from "file-type";
import * as s3Model from "../models/s3.js";
import multer from "multer";
import path from "path";

function generateImages(files: {
  [fieldname: string]: Express.Multer.File[];
}) {
  const images = Object.values(files).reduce(
    (acc: Express.Multer.File[], value) => {
      if (Array.isArray(value)) {
        acc.push(...value);
      }
      return acc;
    },
    []
  );
  return images;
};
const isFilesObject = (
  object: any
): object is {
  [fieldname: string]: Express.Multer.File[];
} => {
  return (
    typeof object === "object" && Object.values(object).every(Array.isArray)
  );
};

function isFileObject(
  object: any
): object is {
  [fieldname: string]: Express.Multer.File;
} {
  return typeof object === "object";
};

// 檢查上傳的檔案是否正確
export async function checkFileType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log('req.file-->',req.file);
  // console.log('req.files-->',req.files);

  if (isFilesObject(req.files)) {
    const images = await Promise.all(
      generateImages(req.files).map(async (file) => {
        const fileType = await fileTypeFromBuffer(file.buffer);
        return { ...file, ...fileType };
      })
    );
    images.forEach((image) => {
      if (image.mime !== image.mimetype) {
        throw new Error("fake type");
      }
    });
    res.locals.images = images;
    // console.log('res.locals.images',res.locals.images);
  }

  if (isFileObject(req.file)) {
    const fileType = await fileTypeFromBuffer(req.file.buffer);
    const image = { ...req.file, ...fileType };
    if (image.mime !== image.mimetype) {
      throw new Error("fake type");
    }
    res.locals.image = image;    
    // console.log('res.locals.image',res.locals.image);
  }
  next();
};

// 使用multer處理圖片上傳，包含：儲存位置、改副檔名、限制圖片大小
export const uploadToBuffer = multer({ storage: multer.memoryStorage(),limits: { fileSize: 5 * 1024 * 1024 } });

// export const upload = multer({
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   // storage: memoryStorage
// });

// export const multerUpload = upload.fields([{ name: 'main-photo', maxCount: 1 }, { name: 'extra-photo', maxCount: 8 }]);

export async function saveUserPhotoToS3(req: Request, res: Response, next: NextFunction) {
  try {
    const uploadImage = res.locals.image;
    if (uploadImage) {
      const imagePath = await s3Model.uploadProductImageToS3([uploadImage]);
      res.locals.imagePath = imagePath;
    }
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ errors: err.message });
      return;
    }
    return res.status(500).json({ errors: "save images failed" });
  }
}