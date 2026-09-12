import IssueCard from "./IssueCard";
import { Issue, Project, User, Status } from "@prisma/client";

type FullIssue = Issue & {
  project: Pick<Project, "key">;
  assignee: Pick<User, "name" | "email"> | null;
};

const columns: { status: Status; title: string; accent: string; dot: string }[] = [
  { status: "TODO", title: "To Do", accent: "border-t-neutral-500", dot: "bg-neutral-400" },
  { status: "IN_PROGRESS", title: "In Progress", accent: "border-t-blue-500", dot: "bg-blue-400" },
  { status: "IN_REVIEW", title: "In Review", accent: "border-t-purple-500", dot: "bg-purple-400" },
  { status: "DONE", title: "Done", accent: "border-t-emerald-500", dot: "bg-emerald-400" },
];

export default function KanbanBoard({ issues }: { issues: FullIssue[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-6">
      {columns.map((col) => {
        const laneIssues = issues.filter((i) => i.status === col.status);

        return (
          <div
            key={col.status}
            className={`rounded-xl border border-neutral-800 bg-neutral-900/40 p-3.5 border-t-2 ${col.accent} flex flex-col min-h-[450px] space-y-3`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-semibold text-neutral-200 tracking-wide uppercase">
                  {col.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700/60">
                {laneIssues.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {laneIssues.length === 0 ? (
                <div className="h-28 flex items-center justify-center text-xs text-neutral-600 border border-dashed border-neutral-800 rounded-lg">
                  No issues
                </div>
              ) : (
                laneIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} variant="board" />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}