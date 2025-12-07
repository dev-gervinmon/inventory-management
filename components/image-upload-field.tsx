"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/app/src/utils/uploadthing";

export default function ImageUploadField({ defaultUrl = "" }) {
  const [imageUrl, setImageUrl] = useState(defaultUrl);
  const [showUploader, setShowUploader] = useState(!defaultUrl);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Product Image
      </label>

      {showUploader && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-4">
          <UploadDropzone
            endpoint="productImage"
            onClientUploadComplete={async (res) => {
              if (res?.[0]) {
                const { url } = res[0];

                setImageUrl(url);
                setShowUploader(false);
              }
            }}
            onUploadError={(err) => alert(`Upload error: ${err.message}`)}
            appearance={{
              container:
                "border-none p-4 flex flex-col items-center justify-center rounded-xl",
              label: "text-gray-600 text-sm",
              button:
                "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow",
              allowedContent: "text-gray-500 text-xs",
            }}
          />
        </div>
      )}

      {/* === SHOW PREVIEW ONLY AFTER UPLOAD COMPLETES === */}
      {!showUploader && imageUrl && (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
          <Image src={imageUrl} alt="Preview" fill className="object-cover" />

          {/* Replace button */}
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border text-sm shadow hover:bg-white"
          >
            Replace
          </button>
        </div>
      )}

      {/* Hidden field for form submission */}
      <input type="hidden" name="image" value={imageUrl} />
    </div>
  );
}
