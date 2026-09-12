import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.issue.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "alex.chen@taskpulse.dev",
      name: "Alex Chen",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Core Platform",
      key: "TP",
      description: "Main application dashboard and API services.",
    },
  });

  await prisma.issue.createMany({
    data: [
      {
        title: "Implement OAuth2 session handling with GitHub",
        description: "Add session callbacks and secure cookie validation via NextAuth.",
        status: Status.IN_PROGRESS,
        priority: Priority.HIGH,
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: "Optimize Prisma relational joins on dashboard queries",
        description: "Address N+1 query overhead by consolidating user avatar and issue lookups.",
        status: Status.TODO,
        priority: Priority.URGENT,
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: "Design responsive Tailwind layout skeleton",
        description: "Structure main shell, navigation sidebar, and status board columns.",
        status: Status.DONE,
        priority: Priority.MEDIUM,
        projectId: project.id,
        assigneeId: user.id,
      },
    ],
  });

  console.log("Database seeded successfully with initial project and issues.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });