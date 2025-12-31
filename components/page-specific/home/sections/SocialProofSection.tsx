import { Badge } from "@/components/common/badge";
import { Card } from "@/components/common/card";
import Image from "next/image";

export function SocialProofSection() {
  return (
    <section className="relative py-32 border-t border-(--border-subtle) bg-linear-to-b from-(--surface-elevated) to-(--surface) overflow-x-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-(--brand)/10 blur-[180px] opacity-70" />
      </div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 animate-fade-in">
          <Badge className="mb-4">Trusted by teams worldwide</Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Social Proof & Metrics
          </h2>
          <p className="mt-6 text-lg text-(--text-secondary)">
            InventoryApp is powering businesses of all sizes, everywhere. Here’s
            a snapshot of our growing community and their success stories.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            { label: "Active Users", value: "12,500+" },
            { label: "Companies", value: "1,200+" },
            { label: "Countries", value: "38" },
            { label: "Avg. Uptime", value: "99.99%" },
          ].map((metric, i) => (
            <div
              key={metric.label}
              className="flex flex-col items-center animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl font-extrabold text-(--brand)">
                {metric.value}
              </span>
              <span className="mt-2 text-base text-(--text-secondary)">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* Customer Logos Row */}
        <div className="flex flex-wrap gap-8 justify-center items-center mb-20">
          {[
            "/logo1.svg",
            "/logo2.svg",
            "/logo3.svg",
            "/logo4.svg",
            "/logo5.svg",
          ].map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`Customer logo ${i + 1}`}
              className="h-10 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300 bg-white/60 rounded-lg shadow-sm p-2"
              width={120}
              height={40}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/120x40?text=Logo";
              }}
              unoptimized={src.startsWith("http")}
            />
          ))}
        </div>

        {/* Testimonial Card */}
        <div
          className="max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <Card className="p-8 flex flex-col items-center text-center bg-white/70 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl border border-(--border-subtle)">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/avatar-demo.jpg"
                alt="Customer"
                className="w-12 h-12 rounded-full border-2 border-(--brand) shadow"
                width={48}
                height={48}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/48x48?text=User";
                }}
              />
              <div className="text-left">
                <div className="font-semibold text-(--text-primary)">
                  Jane Doe
                </div>
                <div className="text-xs text-(--text-secondary)">
                  COO, ExampleCorp
                </div>
              </div>
            </div>
            <div className="text-lg italic text-(--text-secondary)">
              “InventoryApp transformed our operations. The real-time insights
              and seamless integrations are a game changer for our team!”
            </div>
          </Card>
        </div>
      </div>
      <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(32px); }
            to { opacity: 1; transform: none; }
          }
          .animate-fade-in {
            animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
          }
        `}</style>
    </section>
  );
}
