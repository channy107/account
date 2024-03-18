"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface Props {
  previewUrls: string[];
  onDrop: (files: File[]) => void;
}

const ImageUpload = ({ previewUrls, onDrop }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    multiple: true,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-blue-50 cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        <p className="mt-1 text-sm text-blue-600">
          "이미지를 드래그 하거나 클릭해주세요."
        </p>
      </div>
      <div className="mt-4 flex space-x-2 overflow-x-auto">
        {previewUrls.map((url, index) => (
          <Image
            width={70}
            height={70}
            key={index}
            src={url}
            alt={`Preview ${index}`}
            className="w-24 h-24 object-cover"
          />
        ))}
      </div>
    </>
  );
};

export default ImageUpload;
