import { Badge } from "@/components/common/badge";

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
            InventoryApp is powering businesses of all sizes, everywhere. Here`s
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
            <img
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
            />
          ))}
        </div>

        {/* Modern/Futuristic Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto mt-10">
          <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-(--brand)/30 via-(--surface-elevated)/60 to-(--brand)/30 blur-2xl rounded-3xl animate-gradient-x" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Jane Doe",
                title: "COO, ExampleCorp",
                avatar: "/avatar-demo.jpg",
                text: "InventoryApp transformed our operations. The real-time insights and seamless integrations are a game changer for our team!",
              },
              {
                name: "Carlos Rivera",
                title: "Inventory Lead, FreshMart",
                avatar: "/avatar-demo2.jpg",
                text: "We reduced stockouts by 40% in the first month. The dashboard is beautiful and the mobile experience is top-notch.",
              },
              {
                name: "Aisha Bello",
                title: "Founder, Bello Supplies",
                avatar: "/avatar-demo3.jpg",
                text: "Setup was instant, and the analytics help us make smarter decisions every day. Highly recommended!",
              },
              {
                name: "Liam Chen",
                title: "Ops Manager, Techify",
                avatar: "/avatar-demo4.jpg",
                text: "The automation features save us hours weekly. Support is responsive and genuinely helpful.",
              },
              {
                name: "Sofia Rossi",
                title: "Logistics, Rossi Retail",
                avatar: "/avatar-demo5.jpg",
                text: "Love the futuristic UI and how easy it is to onboard new staff. InventoryApp is a must-have!",
              },
              {
                name: "David Kim",
                title: "Warehouse Lead, KimCo",
                avatar: "/avatar-demo6.jpg",
                text: "We finally have a single source of truth for all our inventory. The metrics and alerts are spot on.",
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className="relative group bg-white/70 dark:bg-black/30 backdrop-blur-xl border border-(--border-subtle) rounded-2xl shadow-xl p-7 flex flex-col items-center text-center overflow-hidden hover:scale-[1.03] transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Animated glass highlight */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-gradient-to-r from-(--brand)/30 via-white/40 to-(--brand)/30 blur-2xl opacity-60 pointer-events-none" />
                {/* Animated border pulse */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-(--brand) transition-all duration-300 pointer-events-none" />
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full border-2 border-(--brand) shadow mb-3 object-cover"
                  width={56}
                  height={56}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/56x56?text=User";
                  }}
                />
                <div className="font-semibold text-(--text-primary)">
                  {t.name}
                </div>
                <div className="text-xs text-(--text-secondary) mb-2">
                  {t.title}
                </div>
                <div className="text-base italic text-(--text-secondary) relative z-10">
                  “{t.text}”
                </div>
                {/* Futuristic animated accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-(--brand) via-(--brand)/40 to-(--brand) opacity-60 animate-pulse" />
              </div>
            ))}
          </div>
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
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
