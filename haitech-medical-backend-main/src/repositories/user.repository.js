import { and, eq } from 'drizzle-orm';
import { db } from '../config/index.js';
import { authProviders, roleCodes } from '../constants/index.js';
import { roles, userDetails, userRoles, users } from '../schema/index.js';

const mapUserAggregate = (rows) => {
	if (!rows.length) {
		return null;
	}

	const baseUser = rows[0].user;
	const details = rows[0].details;
	const userRoleCodes = [...new Set(rows.map((row) => row.roleCode).filter(Boolean))];

	return {
		...baseUser,
		emailVerified: details?.emailVerified ?? false,
		phoneVerified: details?.phoneVerified ?? false,
		blacklisted: details?.blacklisted ?? false,
		passwordHash: details?.passwordHash ?? null,
		oldPasswordHash: details?.oldPasswordHash ?? null,
		googleSub: details?.googleSub ?? null,
		authProvider: details?.authProvider ?? authProviders.LOCAL,
		userDetailsActive: details?.active ?? true,
		userDetailsModifiedAt: details?.modifiedAt ?? null,
		userDetailsModifiedBy: details?.modifiedBy ?? null,
		roles: userRoleCodes,
		role: userRoleCodes[0] ?? null,
	};
};

const baseUserAggregateQuery = (executor = db) =>
	executor
		.select({
			user: users,
			details: userDetails,
			roleCode: roles.code,
		})
		.from(users)
		.leftJoin(userDetails, eq(userDetails.userId, users.id))
		.leftJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.active, true)))
		.leftJoin(roles, and(eq(roles.id, userRoles.roleId), eq(roles.active, true)));

const findUserByCondition = async (condition) => {
	const rows = await baseUserAggregateQuery().where(condition);
	return mapUserAggregate(rows);
};

const ensureRole = async (executor, roleCode) => {
	const [existingRole] = await executor.select({ id: roles.id, code: roles.code }).from(roles).where(eq(roles.code, roleCode)).limit(1);

	if (existingRole) {
		return existingRole;
	}

	const [createdRole] = await executor
		.insert(roles)
		.values({
			code: roleCode,
			name: roleCode.toUpperCase(),
			description: `${roleCode} role`,
			active: true,
		})
		.returning({ id: roles.id, code: roles.code });

	return createdRole;
};

export const findByEmail = async (email) => {
	return findUserByCondition(eq(users.email, email));
};

export const findById = async (id) => {
	return findUserByCondition(eq(users.id, id));
};

export const findByUsername = async (username) => {
	return findUserByCondition(eq(users.username, username));
};

export const findByGoogleSub = async (googleSub) => {
	if (!googleSub) {
		return null;
	}

	return findUserByCondition(eq(userDetails.googleSub, googleSub));
};

export const create = async ({
	email,
	username,
	firstName,
	lastName,
	phone = null,
	passwordHash = null,
	googleSub = null,
	authProvider = authProviders.LOCAL,
	defaultRoleCode = roleCodes.USER,
	emailVerified = false,
	phoneVerified = false,
	createdBy = null,
}) => {
	return db.transaction(async (tx) => {
		const [createdUser] = await tx
			.insert(users)
			.values({
				email,
				username,
				firstName,
				lastName,
				phone,
				createdBy,
				modifiedBy: createdBy,
				active: true,
			})
			.returning();

		const [createdDetails] = await tx
			.insert(userDetails)
			.values({
				userId: createdUser.id,
				emailVerified,
				phoneVerified,
				blacklisted: false,
				passwordHash,
				oldPasswordHash: null,
				googleSub,
				authProvider,
				modifiedBy: createdBy ?? createdUser.id,
				active: true,
			})
			.returning();

		const role = await ensureRole(tx, defaultRoleCode);

		await tx.insert(userRoles).values({
			userId: createdUser.id,
			roleId: role.id,
			assignedBy: createdBy ?? createdUser.id,
			active: true,
		});

		return {
			...createdUser,
			emailVerified: createdDetails.emailVerified,
			phoneVerified: createdDetails.phoneVerified,
			blacklisted: createdDetails.blacklisted,
			passwordHash: createdDetails.passwordHash,
			oldPasswordHash: createdDetails.oldPasswordHash,
			googleSub: createdDetails.googleSub,
			authProvider: createdDetails.authProvider,
			userDetailsActive: createdDetails.active,
			userDetailsModifiedAt: createdDetails.modifiedAt,
			userDetailsModifiedBy: createdDetails.modifiedBy,
			roles: [role.code],
			role: role.code,
		};
	});
};

export const updateDetailsByUserId = async (userId, data) => {
	const [details] = await db
		.update(userDetails)
		.set({ ...data, modifiedAt: new Date() })
		.where(eq(userDetails.userId, userId))
		.returning();

	return details || null;
};

export const updateById = async (id, data) => {
	const [user] = await db
		.update(users)
		.set({ ...data, modifiedAt: new Date() })
		.where(eq(users.id, id))
		.returning();

	return user || null;
};

export const deleteById = async (id) => {
	const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
	return !!deleted;
};
