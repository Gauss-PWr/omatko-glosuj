import type { Role } from '$lib/domain/user';
import { role } from '$lib/domain/user';
import type { RequestEvent } from '@sveltejs/kit';
import * as ApiError from '$lib/api/errors';
import { error } from '@sveltejs/kit';

export function handleAdminRoutes(userRole: Role, event: RequestEvent): void {
	const isAdmin = role.ADMIN === userRole;
	const adminPaths = event.route.id?.match(/\/votes\/disable|enable/);
	if (adminPaths && !isAdmin) handleApiError('');
}

export function handleStaffRoutes(userRole: Role, event: RequestEvent): void {
	const isStaff = [role.ADMIN, role.STAFF].includes(userRole);
	const staffPaths = event.route.id?.match(/\/stats/);
	if (staffPaths && !isStaff) handleApiError();
}

export function handleApiError({code:}: Error): never {
	error(404, { code, message: 'Error occured' });
}
