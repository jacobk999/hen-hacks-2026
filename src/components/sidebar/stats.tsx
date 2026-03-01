import { useGameStore } from "~/stores/game/index";
import { CurrencySignDollar } from "../icons/currency-sign-dollar";
import { UserTwo } from "../icons/user-two";
import type { ComponentType, ReactNode } from "react";
import { ThumbReactionDislike } from "../icons/thumb-reaction-dislike";
import { ThumbReactionLike } from "../icons/thumb-reaction-like";
import { Shield } from "../icons/shield";
import { CleanBroom } from "~/components/icons/clean-broom";
import { LockOpen } from "~/components/icons/lock-open";
import { Progress } from "~/components/ui/progress";
import { FaceSad } from "../icons/face-sad";
import { FaceSmile } from "../icons/face-smile";
import { Leaf } from "../icons/leaf";

export function SubwayStats() {
  const stats = useGameStore((s) => s.stats);

  return (
    <div className="w-full flex flex-col gap-1 p-2 bg-slate-200 rounded-lg">
      <p className="font-semibold text-lg">Stats</p>
      <div>
        <Stat label="Money" icon={CurrencySignDollar}>
          <span className="text-green-500 font-medium">${stats.money.toLocaleString()}</span>
        </Stat>
        <Stat label="Employees" icon={UserTwo}>
          <span>{stats.employees}</span>
        </Stat>
      </div>
      <div className="flex flex-col gap-2">
        <StatProgress
          label="Customer Satisfaction"
          icon={stats.customerSatisfaction < 2.5 ? ThumbReactionDislike : ThumbReactionLike}
          value={stats.customerSatisfaction}
          color="bg-amber-500"
        />
        <StatProgress
          label="Employee Wellbeing"
          icon={stats.employeeWellbeing < 2.5 ? FaceSad : FaceSmile}
          value={stats.employeeWellbeing}
          color="bg-purple-500"
        />
        <StatProgress
          label="Security"
          icon={stats.security < 2.5 ? LockOpen : LockOpen}
          value={stats.security}
          color="bg-blue-500"
        />
        <StatProgress label="Safety" icon={Shield} value={stats.safety} color="bg-orange-500" />
        <StatProgress
          label="Cleanliness"
          icon={CleanBroom}
          value={stats.cleanliness}
          color="bg-cyan-500"
        />
        <StatProgress
          label="Eco-Friendliness"
          icon={Leaf}
          value={stats.environment}
          color="bg-emerald-400"
        />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ variant: "stroke"; className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="size-4" variant="stroke" />
      <span>{label}:</span>
      {children}
    </div>
  );
}

function StatProgress({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: ComponentType<{ variant: "stroke"; className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Progress value={value * 20} min={0} max={100} color={color}>
      <div className="flex items-center gap-1">
        <Icon className="size-4 shrink-0" variant="stroke" />
        <span>{label}</span>
      </div>
    </Progress>
  );
}
