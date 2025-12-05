"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/app/src/utils/uploadthing";

export default function ImageUploadField({ defaultUrl = "" }) {
  const [imageUrl, setImageUrl] = useState(defaultUrl);

  return (
    <div>
      <label
        htmlFor="image"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Image
      </label>

      <UploadButton
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            setImageUrl(res[0].url);
            alert("Upload completed");
          }
        }}
        onUploadError={(err) => alert(`Upload error: ${err.message}`)}
      />

      <input type="hidden" name="image" value={imageUrl} />
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Product preview"
          width={80}
          height={80}
          className="object-cover mt-2 rounded"
        />
      )}
    </div>
  );
}
