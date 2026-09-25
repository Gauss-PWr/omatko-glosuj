import { role } from "$lib/domain/user";
import { authService } from "$lib/server";

export type StatsAccess =
  | { authorized: true }
  | { authorized: false; status: 401 | 403 };

export async function authorizeStats(token?: string): Promise<StatsAccess> {
  if (!token) return { authorized: false, status: 401 };

  const result = await authService.auth(token);
  if (!result.ok) return { authorized: false, status: 401 };
  if (result.value.role === role.ATTENDEE)
    return { authorized: false, status: 403 };

  return { authorized: true };
}
