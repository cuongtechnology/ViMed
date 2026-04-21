import { prisma } from "@clinic/database";

export async function getUserOrganizationId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  });

  return user?.organizationId;
}
