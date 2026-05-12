import { pgTable, text, timestamp, integer, pgEnum, primaryKey } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "expired"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["stripe", "midtrans", "xendit", "doku"]);
export const roleEnum = pgEnum("role", ["owner", "admin", "member", "viewer"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(), // Clerk ID or UUID
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const workspace = pgTable("workspace", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const membership = pgTable("membership", {
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	role: roleEnum("role").notNull().default("member"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
	pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
}));

export const invitation = pgTable("invitation", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	email: text("email").notNull(),
	role: roleEnum("role").notNull().default("member"),
	invitedBy: text("invitedBy").references(() => user.id).notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const notification = pgTable("notification", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => user.id).notNull(),
	title: text("title").notNull(),
	message: text("message").notNull(),
	type: text("type").notNull(), // info, success, warning, error
	link: text("link"),
	read: integer("read").notNull().default(0), // 0: unread, 1: read
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const transaction = pgTable("transaction", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => user.id).notNull(),
	amount: integer("amount").notNull(),
	currency: text("currency").notNull().default("IDR"),
	provider: paymentProviderEnum("provider").notNull(),
	providerPaymentId: text("providerPaymentId"),
	status: paymentStatusEnum("status").notNull().default("pending"),
	checkoutUrl: text("checkoutUrl"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

