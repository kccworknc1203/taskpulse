type Props = {
  counts: {
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
  };
};

export default function MetricsBar({ counts }: Props) {
  const metrics = [
    { label: "Total Issues", count: counts.total, color: "text-neutral-200" },
    { label: "To Do", count: counts.todo, color: "text-neutral-400" },
    { label: "In Progress", count: counts.inProgress, color: "text-blue-400" },
    { label: "In Review", count: counts.inReview, color: "text-purple-400" },
    { label: "Done", count: counts.done, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 flex flex-col justify-between"
        >
          <span className="text-xs font-medium text-neutral-400">{m.label}</span>
          <span className={`text-xl font-bold mt-1 ${m.color}`}>{m.count}</span>
        </div>
      ))}
    </div>
  );
}