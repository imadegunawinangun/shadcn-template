import { pgTable, text, timestamp, integer, pgEnum, primaryKey, jsonb } from "drizzle-orm/pg-core";

/**
 * Registry of available applications in the nstok ecosystem.
 */
export const AVAILABLE_APPS = ["stoknstok", "feednstok", "posnstok", "vetnstok", "website"] as const;
export type AppId = (typeof AVAILABLE_APPS)[number];

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "expired"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["stripe", "midtrans", "xendit", "doku"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "trialing", "past_due", "canceled", "unpaid"]);
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
	
	// Modular Apps: Track which apps are enabled for this workspace
	enabledApps: jsonb("enabledApps").$type<AppId[]>().default(["stoknstok"]),
	
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

/**
 * Membership handles global workspace roles.
 * App-specific roles are handled in workspaceAppRole table.
 */
export const membership = pgTable("membership", {
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	
	// Global Role (Workspace level) - Owner has absolute access to everything
	role: roleEnum("role").notNull().default("member"),
	
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
	pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
}));

/**
 * Level 1 & 2 Access Control: Granular roles per application.
 * Defines what a user can do inside a specific app (e.g. POS Cashier, Feed Technician).
 */
export const workspaceAppRole = pgTable("workspaceAppRole", {
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	appId: text("appId").$type<AppId>().notNull(),
	
	// Level 1: App Role (e.g., 'cashier', 'analyst', 'manager')
	roleName: text("roleName").notNull(),
	
	// Level 2: Specific Permissions { "can_edit": true, "can_delete": false }
	permissions: jsonb("permissions").$type<Record<string, boolean>>().default({}),
	
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
	pk: primaryKey({ columns: [table.workspaceId, table.userId, table.appId] }),
}));

export const subscription = pgTable("subscription", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull().unique(),
	planId: text("planId").notNull(), // 'starter', 'grow', 'industrial'
	status: subscriptionStatusEnum("status").notNull().default("active"),
	
	// Limits management
	userLimit: integer("userLimit").notNull().default(5), // Default people included
	additionalUserCount: integer("additionalUserCount").notNull().default(0), // Extra seats purchased
	
	currentPeriodStart: timestamp("currentPeriodStart").notNull().defaultNow(),
	currentPeriodEnd: timestamp("currentPeriodEnd"),
	cancelAtPeriodEnd: integer("cancelAtPeriodEnd").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const transaction = pgTable("transaction", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => user.id).notNull(),
	workspaceId: text("workspaceId").references(() => workspace.id),
	amount: integer("amount").notNull(),
	currency: text("currency").notNull().default("IDR"),
	provider: paymentProviderEnum("provider").notNull(),
	providerPaymentId: text("providerPaymentId"),
	status: paymentStatusEnum("status").notNull().default("pending"),
	checkoutUrl: text("checkoutUrl"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Other tables remain for functional modules...
export const notification = pgTable("notification", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => user.id).notNull(),
	workspaceId: text("workspaceId").references(() => workspace.id),
	title: text("title").notNull(),
	message: text("message").notNull(),
	type: text("type").notNull(),
	link: text("link"),
	read: integer("read").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const product = pgTable("product", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	sku: text("sku"),
	name: text("name").notNull(),
	price: integer("price").notNull(),
	stock: integer("stock").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const siteConfig = pgTable("siteConfig", {
	id: text("id").primaryKey(), 
	workspaceId: text("workspaceId").references(() => workspace.id).notNull().unique(),
	theme: jsonb("theme"),
	name: text("name"),
	logo: text("logo"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
