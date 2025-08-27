import { getCurrentUser } from "./getCurrentUser";

export async function requireRole(role: "USER" | "ADMIN" | "HOST") {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    throw new Error("Unauthorized: Insufficient Permissions");
  }

  return user;
}
