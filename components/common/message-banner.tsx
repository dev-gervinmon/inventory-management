"use client";

import { Message } from "@/lib/hooks/useMessage";

interface MessageBannerProps {
  message: Message;
}

export default function MessageBanner({ message }: MessageBannerProps) {
  if (!message.text) return null;

  const isError = message.type === "error";
  const isSuccess = message.type === "success";

  return (
    <div
      className={`text-sm p-3 rounded-lg border transition-all duration-300 mt-3 ${
        isError
          ? "bg-red-50 text-red-700 border-red-200"
          : isSuccess
          ? "bg-green-50 text-green-700 border-green-200"
          : ""
      }`}
    >
      {message.text}
    </div>
  );
}
