import prisma from './prisma';

export async function login(credentials: any) {
  const user = await prisma.user.findFirst({ where: { email: credentials.email } });
  if (!user || user.password !== credentials.password) return null;
  return user;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}

export async function increaseTokenVersion(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      tokenVersion: { increment: 1 },
    },
  });
}
