import { Request, Response, NextFunction } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FileTypeResult } from "file-type";

import * as dotenv from 'dotenv';
dotenv.config()

const bucketName: string = process.env.AWS_BUCKET_NAME || "";
const bucketRegion: string = process.env.AWS_REGION || "";
const accessKey: string = process.env.AWS_ID || "";
const secretAccessKey: string = process.env.AWS_SECRET_ACCESS_KEY || "";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  }
  , region: bucketRegion
});


type image = Express.Multer.File & FileTypeResult;

export async function uploadProductImageToS3(images: image[]) {
  // console.log('images-->', images);
  const date = new Date().toJSON();
  const filename = date.replace(/-|[A-Z]|\:|\./g, "");
  // console.log('filename-->', filename);
  const params = images.map((image, index) => ({
    Bucket: bucketName,
    Key: `userImage/${filename}`,
    Body: image.buffer,
    ContentType: image.mimetype,
  }));

  const commands = params.map((ele) => new PutObjectCommand(ele));

  await Promise.all(commands.map((ele) => s3.send(ele)));

  const imageResults = images.map((ele, index) => ({
    ...ele,
    path: params[index].Key,
  }));

  const imageName = imageResults[0].path;
  const imagePath = process.env.CDN_URL + imageName;
  return imagePath;
};

