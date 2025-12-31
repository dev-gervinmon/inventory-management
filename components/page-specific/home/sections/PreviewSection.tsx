import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import Image from "next/image";

export function PreviewSection() {
  return (
    <section
      id="preview"
      className="relative py-36 border-t border-(--border-subtle) bg-linear-to-b from-(--surface) to-(--surface-elevated) overflow-x-hidden"
    >
      {/* Parallax/floating background accent */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[900px] rounded-full bg-(--brand)/15 blur-[200px] animate-floatSlow opacity-80" />
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-(--brand)/10 blur-[160px] opacity-60 animate-floatSlow2" />
      </div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 animate-fade-in">
          <Badge className="mb-4">Preview</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            See InventoryApp in Action
          </h2>
          <p className="mt-6 text-lg text-(--text-secondary)">
            Here`s a sneak peek at the dashboard and features you`ll get —
            designed for clarity and speed.
          </p>
        </div>

        {/* Preview grid with glassmorphism and animated overlays */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              src: "/preview/dashboard-mock.png",
              alt: "Dashboard Preview",
              label: "Dashboard Overview",
              fallback:
                "https://placehold.co/600x375/EEE/AAA?text=Dashboard+Preview",
              live: true,
            },
            {
              src: "/preview/products-table-mock.png",
              alt: "Products Table Preview",
              label: "Products Table",
              fallback:
                "https://placehold.co/600x375/EEE/AAA?text=Products+Table+Preview",
              live: false,
            },
            {
              src: "/preview/analytics-mock.png",
              alt: "Analytics Preview",
              label: "Analytics & Trends",
              fallback:
                "https://placehold.co/600x375/EEE/AAA?text=Analytics+Preview",
              live: true,
            },
          ].map((item, i) => (
            <div
              key={item.alt}
              className="flex flex-col items-center animate-fade-in"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative w-full aspect-16/10 rounded-3xl overflow-hidden shadow-2xl border border-(--border-strong) bg-linear-to-br from-(--surface-elevated)/80 to-(--surface)/70 backdrop-blur-xl flex items-center justify-center group">
                {/* Animated overlay gradient */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 bg-linear-to-tr from-transparent via-(--brand)/10 to-(--brand)/20 opacity-80 group-hover:opacity-100 transition"
                  style={{ mixBlendMode: "lighten" }}
                />
                {/* Live indicator */}
                {item.live && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" />
                    <span className="text-xs font-semibold text-green-500 bg-white/70 px-2 py-0.5 rounded-full shadow">
                      Live
                    </span>
                  </div>
                )}
                {/* Image */}
                <Image
                  src={item.src}
                  alt={item.alt}
                  className="object-cover w-full h-full opacity-95 transition group-hover:scale-[1.03] group-hover:opacity-100 duration-300"
                  style={{ filter: "blur(0.5px)" }}
                  width={600}
                  height={375}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = item.fallback;
                  }}
                  loading="eager"
                  unoptimized={item.src.startsWith("http")}
                />
              </div>
              <span
                className="mt-4 text-base font-medium text-(--text-muted) animate-fade-in"
                style={{ animationDelay: `${i * 140 + 200}ms` }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg
                  className="w-7 h-7 text-(--brand)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4l3 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              label: "Real-time Sync",
              desc: "Instant updates across all devices.",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-(--brand)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                </svg>
              ),
              label: "Unlimited Products",
              desc: "No artificial limits or hidden fees.",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-(--brand)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              ),
              label: "Role-based Access",
              desc: "Granular permissions for your team.",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-(--brand)"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 3h-8" />
                </svg>
              ),
              label: "Mobile Friendly",
              desc: "Optimized for every device.",
            },
          ].map((feature) => (
            <Card
              key={feature.label}
              className="p-7 flex flex-col items-center text-center bg-(--surface) shadow-lg border border-(--border-subtle) rounded-2xl"
            >
              <div className="mb-3 flex items-center justify-center rounded-full bg-(--brand)/10 w-12 h-12">
                {feature.icon}
              </div>
              <div className="text-base font-semibold text-(--text-primary)">
                {feature.label}
              </div>
              <div className="mt-1 text-sm text-(--text-secondary)">
                {feature.desc}
              </div>
            </Card>
          ))}
        </div>

        {/* Integration & Trust Badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 items-center">
          {/* Example integration icons (replace with real logos as needed) */}
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            Google Sheets
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="4" />
            </svg>
            Excel
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="12,2 22,22 2,22" />
            </svg>
            Zapier
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 3h-8" />
            </svg>
            Shopify
          </span>
          {/* Trust badges */}
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M8 12l2 2 4-4"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            99.99% Uptime
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-black/30 rounded-xl border border-(--border-subtle) shadow text-sm font-medium">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="4" />
            </svg>
            GDPR Ready
          </span>
        </div>
      </div>
    </section>
  );
}
