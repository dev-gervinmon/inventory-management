export default function Loading() {
  return (
    <div className="w-full animate-[fadeIn_180ms_ease-out]">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-40 bg-skeleton rounded mb-2" aria-hidden="true" />
        <div
          className="h-4 w-72 max-w-[80%] bg-skeleton rounded"
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-glass rounded-lg border border-(--border-subtle) p-4 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div
                  className="h-4 w-24 bg-skeleton rounded mb-3"
                  aria-hidden="true"
                />
                <div
                  className="h-8 w-16 bg-skeleton rounded"
                  aria-hidden="true"
                />
                <div
                  className="h-3 w-40 bg-skeleton rounded mt-4"
                  aria-hidden="true"
                />
              </div>
              <div
                className="h-12 w-12 bg-skeleton rounded-lg"
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-glass rounded-lg border border-(--border-subtle) p-4"
          >
            <div
              className="h-5 w-44 bg-skeleton rounded mb-4"
              aria-hidden="true"
            />
            <div
              className="h-56 w-full bg-skeleton rounded"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
