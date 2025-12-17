interface CloseButtonProps {
  onClick: () => void;
  variant?: "purple" | "blue" | "gray";
  size?: "sm" | "md";
  title?: string;
}

export default function CloseButton({
  onClick,
  variant = "gray",
  size = "md",
  title = "Close",
}: CloseButtonProps) {
  const variants = {
    purple:
      "text-purple-700 hover:bg-purple-200 hover:text-purple-900 p-1 rounded",
    blue: "text-blue-700 hover:bg-blue-200 hover:text-blue-900 p-1 rounded",
    gray: "text-gray-400 hover:bg-gray-200 hover:text-gray-700 p-2 rounded-md",
  };

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variants[variant]} transition-all duration-200 cursor-pointer`}
      title={title}
    >
      <svg
        className={sizes[size]}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
