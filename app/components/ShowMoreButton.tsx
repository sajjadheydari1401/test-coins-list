type Props = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function ShowMoreButton({ onClick, disabled, loading }: Props) {
  const isDisabled = Boolean(disabled) || Boolean(loading);

  return (
    <button
      className={`pl-5 pr-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md transition-all duration-200
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800 hover:scale-105"}
        ${!isDisabled ? "cursor-pointer" : ""}
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      `}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      <span className="flex items-center gap-2 font-semibold text-lg">
        <svg
          className={`w-4 h-4 ${loading ? "animate-spin" : "animate-bounce"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {loading ? "Loading..." : "Show More"}
      </span>
    </button>
  );
}
