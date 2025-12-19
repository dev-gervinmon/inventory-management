import { useState, useCallback } from "react";

export interface Message {
  type: "success" | "error" | "";
  text: string;
}

interface UseMessageOptions {
  autoClose?: boolean;
  timeout?: number;
}

export function useMessage(options: UseMessageOptions = {}) {
  const { autoClose = true, timeout = 3000 } = options;
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const showSuccess = useCallback(
    (text: string) => {
      setMessage({ type: "success", text });
      if (autoClose) {
        setTimeout(() => setMessage({ type: "", text: "" }), timeout);
      }
    },
    [autoClose, timeout]
  );

  const showError = useCallback((text: string) => {
    setMessage({ type: "error", text });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage({ type: "", text: "" });
  }, []);

  return {
    message,
    setMessage,
    showSuccess,
    showError,
    clearMessage,
  };
}
