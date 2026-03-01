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
      <p className="font-bold text-lg">Stats</p>
      <div>
        <Stat label="Money" icon={CurrencySignDollar}>
          <span className="text-green-400 font-medium">
            ${stats.money.toLocaleString()}
          </span>
        </Stat>
        <Stat label="Employees" icon={UserTwo}>
          <span>{stats.employees}</span>
        </Stat>
      </div>
      <div className="flex flex-col gap-2">
        <StatProgress
          label="Customer Satisfaction"
          icon={
            stats.customerSatisfaction < 2.5
              ? ThumbReactionDislike
              : ThumbReactionLike
          }
          value={stats.customerSatisfaction}
        />
        <StatProgress
          label="Employee Wellbeing"
          icon={stats.employeeWellbeing < 2.5 ? FaceSad : FaceSmile}
          value={stats.employeeWellbeing}
        />
        <StatProgress
          label="Security"
          icon={stats.security < 2.5 ? LockOpen : LockOpen}
          value={stats.security}
        />
        <StatProgress label="Safety" icon={Shield} value={stats.safety} />
        <StatProgress
          label="Cleanliness"
          icon={CleanBroom}
          value={stats.cleanliness}
        />
        <StatProgress
          label="Eco-Friendliness"
          icon={Leaf}
          value={stats.environment}
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
}: {
  icon: ComponentType<{ variant: "stroke"; className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Progress value={value * 20} min={0} max={100}>
      <div className="flex items-center gap-1">
        <Icon className="size-4" variant="stroke" />
        <span>{label}</span>
      </div>
    </Progress>
  );
}
