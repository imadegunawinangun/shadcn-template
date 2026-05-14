import { pgTable, text, timestamp, integer, pgEnum, primaryKey, jsonb } from "drizzle-orm/pg-core";

/**
 * Registry of available applications in the monorepo.
 * This serves as the single source of truth for App IDs.
 */
export const AVAILABLE_APPS = ["website", "pos", "accounting"] as const;
export type AppId = (typeof AVAILABLE_APPS)[number];

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
	
	// Modular Apps: Track which apps are enabled for this workspace (Type-safe)
	enabledApps: jsonb("enabledApps").$type<AppId[]>().default(["website"]),
	
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const membership = pgTable("membership", {
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	
	// Global Role (Workspace level)
	role: roleEnum("role").notNull().default("member"),
	
	// Granular App Roles (Type-safe): { "pos": "admin", "accounting": "viewer" }
	appRoles: jsonb("appRoles").$type<Partial<Record<AppId, string>>>().default({}),
	
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
	pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
}));


export const notification = pgTable("notification", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => user.id).notNull(),
	workspaceId: text("workspaceId").references(() => workspace.id),
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
	workspaceId: text("workspaceId").references(() => workspace.id),
	entityId: text("entityId").references(() => entity.id), // Sub-tenant (Toko A/B)
	amount: integer("amount").notNull(),
	currency: text("currency").notNull().default("IDR"),
	provider: paymentProviderEnum("provider").notNull(),
	providerPaymentId: text("providerPaymentId"),
	status: paymentStatusEnum("status").notNull().default("pending"),
	checkoutUrl: text("checkoutUrl"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const product = pgTable("product", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	entityId: text("entityId").references(() => entity.id), // Bisa null jika produk global, atau terisi jika stok per toko
	sku: text("sku"), // Kode barang manual (misal: BRG-001)
	name: text("name").notNull(),
	price: integer("price").notNull(),
	stock: integer("stock").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const apiKey = pgTable("apiKey", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	key: text("key").notNull().unique(),
	status: text("status").notNull().default("active"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	lastUsedAt: timestamp("lastUsedAt"),
});

export const webhook = pgTable("webhook", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name"),
	url: text("url").notNull(),
	type: text("type").notNull().default("outgoing"), // incoming, outgoing
	events: text("events").notNull(), 
	status: text("status").notNull().default("active"),
	secret: text("secret").notNull(),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const workflow = pgTable("workflow", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	triggerId: text("triggerId").notNull(),
	actions: jsonb("actions").notNull(), // Menyimpan array of actions [{id: 'send_email', label: '...'}, ...]
	flow: jsonb("flow"), // Menyimpan state visual editor (nodes, edges)
	status: text("status").notNull().default("active"),
	runs: integer("runs").notNull().default(0),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const workflowLog = pgTable("workflowLog", {
	id: text("id").primaryKey(),
	workflowId: text("workflowId").references(() => workflow.id).notNull(),
	status: text("status").notNull(), // success, failed
	triggerData: jsonb("triggerData"),
	stepLogs: jsonb("stepLogs"), // Array of { actionId: string, status: string, input: any, output: any, error?: string }
	error: text("error"),
	executedAt: timestamp("executedAt").notNull().defaultNow(),
});

export const webhookDelivery = pgTable("webhookDelivery", {
	id: text("id").primaryKey(),
	webhookId: text("webhookId").references(() => webhook.id).notNull(),
	status: integer("status").notNull(), // 200, 500, etc.
	payload: jsonb("payload"),
	error: text("error"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const auditLog = pgTable("auditLog", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	userId: text("userId").references(() => user.id).notNull(),
	action: text("action").notNull(), // e.g., "UPDATE_THEME", "INVITE_USER"
	entity: text("entity").notNull(), // e.g., "siteConfig", "membership"
	details: jsonb("details"), // payload sebelum/sesudah perubahan
	createdAt: timestamp("createdAt").notNull().defaultNow(),
});

/**
 * Shared Brand Configuration
 * Used by all apps to maintain brand consistency
 */
export const siteConfig = pgTable("siteConfig", {
	id: text("id").primaryKey(), 
	workspaceId: text("workspaceId").references(() => workspace.id).notNull().unique(),
	theme: jsonb("theme"), // Stores the theme configuration object
	name: text("name"),
	logo: text("logo"),
	imagekitPublicKey: text("imagekitPublicKey"),
	imagekitPrivateKey: text("imagekitPrivateKey"),
	imagekitUrlEndpoint: text("imagekitUrlEndpoint"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

/**
 * POS Specific Configuration
 */
export const posConfig = pgTable("posConfig", {
	workspaceId: text("workspaceId").references(() => workspace.id).primaryKey(),
	storeName: text("storeName"),
	currency: text("currency").default("IDR"),
	taxRate: integer("taxRate").default(11),
	receiptHeader: text("receiptHeader"),
	receiptFooter: text("receiptFooter"),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const entity = pgTable("entity", {
	id: text("id").primaryKey(),
	workspaceId: text("workspaceId").references(() => workspace.id).notNull(),
	name: text("name").notNull(),
	type: text("type").notNull().default("store"), // store, warehouse, farm, etc.
	location: text("location"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

/**
 * Accounting Specific Configuration
 */
export const accountingConfig = pgTable("accountingConfig", {
	workspaceId: text("workspaceId").references(() => workspace.id).primaryKey(),
	fiscalYearStart: text("fiscalYearStart").default("01-01"),
	baseCurrency: text("baseCurrency").default("IDR"),
	chartOfAccountsTemplate: text("chartOfAccountsTemplate"),
	autoJournaling: integer("autoJournaling").default(1),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
