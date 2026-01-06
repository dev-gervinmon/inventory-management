"use client";

import { Message } from "@/lib/hooks/useMessage";

interface MessageBannerProps {
  message: Message;
}

export default function MessageBanner({ message }: MessageBannerProps) {
  if (!message.text) return null;

  const isError = message.type === "error";
  const isSuccess = message.type === "success";

  const variantClassName = isError
    ? "bg-(--danger)/10 text-(--danger) border-(--danger)/20"
    : isSuccess
    ? "bg-(--success)/10 text-(--success) border-(--success)/20"
    : "bg-(--surface-elevated)/10 text-(--text-secondary) border-(--border-subtle)";

  return (
    <div
      className={[
        "mt-3",
        "text-sm",
        "p-3",
        "rounded-xl",
        "border",
        "bg-glass",
        "backdrop-blur",
        "transition-all",
        "duration-300",
        variantClassName,
      ].join(" ")}
    >
      {message.text}
    </div>
  );
}
