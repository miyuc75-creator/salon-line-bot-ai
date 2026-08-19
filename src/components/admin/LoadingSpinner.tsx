export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"
        role="status"
        aria-label="読み込み中"
      />
    </div>
  );
}
