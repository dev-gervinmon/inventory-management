import { Badge } from "@/components/common/badge";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/common/card";
import {
  CheckCircle,
  Layers,
  AlertTriangle,
  LayoutDashboard,
  Zap,
  TrendingUp,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-32 border-t border-(--border-subtle) bg-linear-to-b from-(--surface) to-(--surface-elevated)"
    >
      {/* Background accent and pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-(--brand)/10 blur-[180px] opacity-80" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-(--brand)/5 blur-[120px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <Badge className="mb-4">Why InventoryApp</Badge>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Everything you need to
            <span className="block mt-2 text-(--brand)">stay in control</span>
          </h2>

          <p className="mt-6 text-lg text-(--text-secondary)">
            Designed for clarity, speed, and real-world inventory workflows —
            without overwhelming your team.
          </p>
        </div>

        {/* Feature cards with icons and animation */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Real-time Stock Tracking",
              description:
                "Instantly see what`s in stock, what`s low, and what needs attention — no refresh required.",
              icon: <CheckCircle className="w-8 h-8 text-(--brand)" />,
            },
            {
              title: "Smart Product Management",
              description:
                "Organize products with categories, pricing, and metadata that scales as your inventory grows.",
              icon: <Layers className="w-8 h-8 text-(--brand)" />,
            },
            {
              title: "Low-Stock Alerts",
              description:
                "Catch issues before they happen with clear visibility into critical inventory levels.",
              icon: <AlertTriangle className="w-8 h-8 text-(--brand)" />,
            },
            {
              title: "Clean Dashboard",
              description:
                "A focused, distraction-free interface that surfaces only what matters most.",
              icon: <LayoutDashboard className="w-8 h-8 text-(--brand)" />,
            },
            {
              title: "Fast & Lightweight",
              description:
                "Built for performance so your team never waits on the system.",
              icon: <Zap className="w-8 h-8 text-(--brand)" />,
            },
            {
              title: "Ready to Scale",
              description:
                "Whether you manage 50 products or 50,000, the structure stays the same.",
              icon: <TrendingUp className="w-8 h-8 text-(--brand)" />,
            },
          ].map((feature, i) => (
            <Card
              key={feature.title}
              className="p-7 flex flex-col items-center text-center bg-(--surface) shadow-lg border border-(--border-subtle) rounded-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl group animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 flex items-center justify-center rounded-full bg-(--brand)/10 w-14 h-14 group-hover:bg-(--brand)/20 transition">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-(--text-primary)">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-(--text-secondary)">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 flex justify-center">
          <Button size="lg" asChild href="/inventory">
            View Dashboard
          </Button>
        </div>
      </div>
      {/* Fade-in animation keyframes */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </section>
  );
}
