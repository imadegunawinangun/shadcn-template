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

export const siteConfig = pgTable("site_config", {
	id: text("id").primaryKey(), 
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	appId: text("app_id"), // Level 3: App-specific theme (optional)
	theme: jsonb("theme"),
	name: text("name"),
	logo: text("logo"),
	imagekitPublicKey: text("imagekitPublicKey"),
	imagekitPrivateKey: text("imagekitPrivateKey"),
	imagekitUrlEndpoint: text("imagekitUrlEndpoint"),
	aiProvider: text("aiProvider"),
	aiApiKey: text("aiApiKey"),
	aiBaseUrl: text("aiBaseUrl"),
	aiModelId: text("aiModelId"),
	landingPage: jsonb("landing_page"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// --- Functional Modules & Settings ---

export const entity = pgTable("entity", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	type: text("type").notNull(), // 'location', 'farm', 'warehouse'
	location: text("location"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const workflow = pgTable("workflow", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	description: text("description"),
	trigger: jsonb("trigger").notNull(),
	actions: jsonb("actions").notNull(),
	active: integer("active").notNull().default(1),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const workflowLog = pgTable("workflowLog", {
	id: text("id").primaryKey(),
	workflowId: text("workflowId").references(() => workflow.id).notNull(),
	status: text("status").notNull(), // 'success', 'failed'
	message: text("message"),
	data: jsonb("data"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const webhook = pgTable("webhook", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	url: text("url").notNull(),
	events: jsonb("events").notNull(), // ['order.created', 'stock.low']
	secret: text("secret").notNull(),
	active: integer("active").notNull().default(1),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const webhookDelivery = pgTable("webhookDelivery", {
	id: text("id").primaryKey(),
	webhookId: text("webhookId").references(() => webhook.id).notNull(),
	event: text("event").notNull(),
	payload: jsonb("payload").notNull(),
	responseStatus: integer("responseStatus"),
	responseBody: text("responseBody"),
	duration: integer("duration"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const posConfig = pgTable("posConfig", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull().unique(),
	currency: text("currency").default("IDR"),
	receiptFooter: text("receiptFooter"),
	taxRate: integer("taxRate").default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const accountingConfig = pgTable("accountingConfig", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull().unique(),
	fiscalYearStart: text("fiscalYearStart").default("01-01"),
	baseCurrency: text("baseCurrency").default("IDR"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const apiKey = pgTable("apiKey", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	key: text("key").notNull().unique(),
	scopes: jsonb("scopes").notNull(), // ['read', 'write']
	lastUsedAt: timestamp("lastUsedAt"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	expiresAt: timestamp("expiresAt"),
});

export const auditLog = pgTable("auditLog", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	action: text("action").notNull(),
	entityType: text("entityType").notNull(),
	entityId: text("entityId").notNull(),
	metadata: jsonb("metadata"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const landingPage = pgTable("landing_page", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull(),
	content: jsonb("content").notNull().default([]),
	theme: jsonb("theme"),
	status: text("status").notNull().default("draft"), // 'published', 'draft'
	views: integer("views").notNull().default(0),
	isHome: integer("isHome").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const post = pgTable("post", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull(),
	content: text("content"), // Rich text HTML content
	excerpt: text("excerpt"),
	featuredImage: text("featuredImage"),
	categories: jsonb("categories").$type<string[]>(),
	tags: jsonb("tags").$type<string[]>(),
	status: text("status").notNull().default("draft"), // 'published', 'draft'
	metaTitle: text("metaTitle"),
	metaDescription: text("metaDescription"),
	views: integer("views").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
