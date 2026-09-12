import { prisma } from "@/lib/prisma";
import IssueCard from "@/components/IssueCard";
import KanbanBoard from "@/components/KanbanBoard";
import MetricsBar from "@/components/MetricsBar";
import CreateIssueModal from "@/components/CreateIssueModal";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import { Status } from "@prisma/client";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ status?: string; view?: string; q?: string }>;
};

const statusTabs: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
];

export default async function HomePage({ searchParams }: Props) {
  const resolved = await searchParams;
  const currentStatus = resolved.status as Status | undefined;
  const currentView = resolved.view === "board" ? "board" : "list";
  const searchQuery = resolved.q?.trim();

  // Search filter query across title and description
  const searchFilter = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" as const } },
          { description: { contains: searchQuery, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [allIssues, project, users] = await Promise.all([
    prisma.issue.findMany({
      where: searchFilter,
      include: { assignee: true, project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findFirst(),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ]);

  if (!project) return null;

  const filteredIssues = currentStatus
    ? allIssues.filter((i) => i.status === currentStatus)
    : allIssues;

  const counts = {
    total: allIssues.length,
    todo: allIssues.filter((i) => i.status === "TODO").length,
    inProgress: allIssues.filter((i) => i.status === "IN_PROGRESS").length,
    inReview: allIssues.filter((i) => i.status === "IN_REVIEW").length,
    done: allIssues.filter((i) => i.status === "DONE").length,
  };

  const getQueryString = (statusVal?: string) => {
    const params = new URLSearchParams();
    if (currentView === "board") params.set("view", "board");
    if (statusVal) params.set("status", statusVal);
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TaskPulse</h1>
            <p className="text-xs text-neutral-400">
              Sprint Workspace • Project <span className="font-mono text-neutral-200">{project.key}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-0.5 text-xs">
              <Link
                href={getQueryString(currentStatus).replace("view=board", "view=list")}
                className={`px-3 py-1 rounded-md transition ${
                  currentView === "list" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
                }`}
              >
                List
              </Link>
              <Link
                href={getQueryString(currentStatus).includes("?") ? `${getQueryString(currentStatus)}&view=board` : "/?view=board"}
                className={`px-3 py-1 rounded-md transition ${
                  currentView === "board" ? "bg-neutral-800 text-white font-medium" : "text-neutral-400 hover:text-white"
                }`}
              >
                Board
              </Link>
            </div>
            <CreateIssueModal projectId={project.id} users={users} />
          </div>
        </header>

        {/* Analytics Bar */}
        <MetricsBar counts={counts} />

        {/* Toolbar: Search + List Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <SearchInput />

          {currentView === "list" && (
            <div className="flex gap-1.5 text-xs overflow-x-auto">
              {statusTabs.map((tab) => {
                const active = (!tab.value && !currentStatus) || currentStatus === tab.value;
                return (
                  <Link
                    key={tab.label}
                    href={getQueryString(tab.value)}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                      active
                        ? "bg-neutral-800 text-white font-medium"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        {currentView === "board" ? (
          <KanbanBoard issues={allIssues} />
        ) : filteredIssues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 p-12 text-center text-neutral-500 text-sm">
            No matching issues found.
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}