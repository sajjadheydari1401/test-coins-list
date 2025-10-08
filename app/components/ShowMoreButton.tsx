export default function ShowMoreButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      Show More
    </button>
  );
}
