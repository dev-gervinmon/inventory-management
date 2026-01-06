"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/app/src/utils/uploadthing";

export default function ImageUploadField({ defaultUrl = "" }) {
  const [imageUrl, setImageUrl] = useState(defaultUrl);
  const [showUploader, setShowUploader] = useState(!defaultUrl);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-(--text-secondary)">
        Product Image
      </label>

      {showUploader && (
        <div className="rounded-2xl border border-dashed border-(--border-strong) bg-(--surface-elevated)/10 p-4">
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
                "border-none p-4 flex flex-col items-center justify-center rounded-xl bg-transparent",
              label: "text-(--text-muted) text-sm",
              button:
                "bg-(--brand) hover:bg-(--brand)/90 text-(--text-inverted) px-4 py-2 rounded-xl border border-(--border-subtle) shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40",
              allowedContent: "text-(--text-muted) text-xs",
            }}
          />
        </div>
      )}

      {/* === SHOW PREVIEW ONLY AFTER UPLOAD COMPLETES === */}
      {!showUploader && imageUrl && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-(--border-strong) bg-(--surface-elevated)/10">
          <Image src={imageUrl} alt="Preview" fill className="object-cover" />

          {/* Replace button */}
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="absolute bottom-3 right-3 bg-glass backdrop-blur px-4 py-2 rounded-xl border border-(--border-subtle) text-sm font-medium text-(--text-primary) shadow-sm hover:bg-(--surface-elevated)/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
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
