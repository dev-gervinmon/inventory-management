"use client";

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export default function SuccessModal({
  isOpen,
  title = "Success!",
  subtitle,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not the modal
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="bg-glass rounded-2xl p-8 md:p-12 max-w-md w-full text-center border border-(--border-subtle) animate-in fade-in zoom-in duration-300">
        {/* Animated Checkmark */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-20 h-20">
            {/* Circle background */}
            <div className="absolute inset-0 bg-(--success)/10 rounded-full animate-pulse" />

            {/* Checkmark */}
            <svg
              className="w-20 h-20 text-(--success) relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
              }}
            >
              <path
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 28,
                  strokeDashoffset: 28,
                  animation: "dashIn 0.6s ease-out forwards 0.2s",
                }}
              />
            </svg>

            <style>{`
              @keyframes dashIn {
                to {
                  stroke-dashoffset: 0;
                }
              }
              
              @keyframes scaleUp {
                0% {
                  transform: scale(0.8);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.1);
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              .animate-in {
                animation: scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
              }
            `}</style>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && <p className="text-(--text-secondary)">{subtitle}</p>}
      </div>
    </div>
  );
}
