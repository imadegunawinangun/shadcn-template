import { pgTable, text, timestamp, integer, pgEnum, primaryKey, jsonb } from "drizzle-orm/pg-core";

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

