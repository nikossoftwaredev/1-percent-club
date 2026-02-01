import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Activity } from "lucide-react";
import { BasePageProps } from "@/types/page-props";

const STAT_CARDS = [
  {
    label: "Total Users",
    value: "0",
    sub: "Registered users",
    icon: Users,
    gradient: "from-yellow-400/15 to-orange-500/15",
    borderColor: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  {
    label: "Countries",
    value: "0",
    sub: "Available countries",
    icon: Globe,
    gradient: "from-emerald-400/15 to-teal-500/15",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    label: "Active Sessions",
    value: "0",
    sub: "Current game sessions",
    icon: Activity,
    gradient: "from-blue-400/15 to-indigo-500/15",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
];

const AdminDashboard = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of the 1% Club platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <Card
            key={card.label}
            className="overflow-hidden border-white/6 card-glow"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-linear-to-br ${card.gradient} border ${card.borderColor}`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
