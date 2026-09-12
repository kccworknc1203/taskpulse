"use server";

import { prisma } from "@/lib/prisma";
import { Priority, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const IssueSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().trim().max(500).optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().optional(),
});

export async function createIssue(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || Priority.MEDIUM,
    projectId: formData.get("projectId"),
    assigneeId: formData.get("assigneeId") || undefined,
  };

  const parsed = IssueSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.issue.create({
    data: { ...parsed.data, status: Status.TODO },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateIssueStatus(id: string, status: Status) {
  await prisma.issue.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/");
}

export async function deleteIssue(id: string) {
  await prisma.issue.delete({ where: { id } });
  revalidatePath("/");
}