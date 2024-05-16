"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

function ImageUpload({
  disabled,
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (value: any) => {
    onChange(value.info.secure_url);
  };

  if (!isMounted) return null;
  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        {value?.map((url) => {
          return (
            <div
              key={url}
              className="relative w-[200px] aspect-square   rounded-md overflow-hidden"
            >
              <div className="absolute z-10 top-2 right-2">
                <Button
                  type="button"
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => {
                    onRemove(url);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="Image" src={url} />
            </div>
          );
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="xrdawlkp">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
