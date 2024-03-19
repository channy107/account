"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export const uploadImage = async (formData: FormData) => {
  const bannerName = formData.get("name");
  const files = formData.getAll("file") as unknown as File[];
  if (files.length === 0) return;

  try {
    const response = await Promise.all(
      files.map(async (file) => {
        const Body = (await file.arrayBuffer()) as Buffer;
        const Key = `${bannerName}/${file.name}`;
        s3Client.send(new PutObjectCommand({ Bucket, Key, Body }));
      })
    );
    return response;
  } catch (error) {
    throw new Error("이미지를 업로드하는 데 실패하였습니다.");
  }
};
