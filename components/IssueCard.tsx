"use client";

import { useTransition } from "react";
import { updateIssueStatus, deleteIssue } from "@/app/actions/issues";
import { Priority, Status } from "@prisma/client";

type IssueProps = {
  issue: {
    id: string;
    title: string;
    description: string | null;
    status: Status;
    priority: Priority;
    project: { key: string };
    assignee: { name: string; email: string } | null;
  };
  variant?: "list" | "board";
};

const priorityStyles: Record<Priority, string> = {
  LOW: "bg-neutral-800 text-neutral-300 border-neutral-700",
  MEDIUM: "bg-blue-950 text-blue-300 border-blue-800",
  HIGH: "bg-amber-950 text-amber-300 border-amber-800",
  URGENT: "bg-red-950 text-red-300 border-red-800",
};

export default function IssueCard({ issue, variant = "list" }: IssueProps) {
  const [isPending, startTransition] = useTransition();
  const isBoard = variant === "board";

  return (
    <div
      className={`rounded-lg border border-neutral-800 bg-neutral-900/80 p-3.5 transition hover:border-neutral-700 ${
        isBoard
          ? "flex flex-col gap-3 w-full"
          : "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Card Header & Content */}
      <div className="space-y-2 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
              {issue.project.key}
            </span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityStyles[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>

          {isBoard && (
            <button
              onClick={() => startTransition(() => deleteIssue(issue.id))}
              className="text-xs text-neutral-500 hover:text-red-400 transition p-1"
              title="Delete Issue"
            >
              ✕
            </button>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-100 leading-snug break-words">
            {issue.title}
          </h2>
          {issue.description && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed break-words">
              {issue.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div
        className={`flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/80 ${
          isBoard ? "w-full mt-auto" : "sm:border-t-0 sm:pt-0 sm:shrink-0"
        }`}
      >
        <div className="text-xs text-neutral-400 truncate">
          {issue.assignee ? (
            <span className="inline-flex items-center gap-1.5 truncate">
              <span className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-semibold text-neutral-300 shrink-0">
                {issue.assignee.name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate max-w-[90px] text-neutral-300 font-medium">
                {issue.assignee.name}
              </span>
            </span>
          ) : (
            <span className="text-neutral-500 text-[11px]">Unassigned</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={issue.status}
            onChange={(e) =>
              startTransition(() => updateIssueStatus(issue.id, e.target.value as Status))
            }
            className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-[11px] text-neutral-200 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>

          {!isBoard && (
            <button
              onClick={() => startTransition(() => deleteIssue(issue.id))}
              className="text-xs text-neutral-500 hover:text-red-400 transition ml-1"
              title="Delete Issue"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}