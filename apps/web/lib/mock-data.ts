import { Member } from "@workspace/users"
import { NotificationItem } from "@workspace/notifications"
import { PricingPlan, Invoice, PaymentMethod } from "@workspace/billing"
import { Asset } from "@workspace/assets"
import { AuditLog } from "@workspace/security"
import { ApiKey } from "@workspace/automation"
import { FeatureFlag } from "@workspace/admin"

export const mockMembers: Member[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Owner", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "Member", status: "Pending" },
]

export const mockNotifications: NotificationItem[] = [
  { id: "1", title: "New Member Joined", message: "Jane Smith has joined your workspace.", type: "info", time: "2 mins ago", read: false },
  { id: "2", title: "Payment Successful", message: "Your subscription has been renewed.", type: "success", time: "1 hour ago", read: true },
]

export const mockPlans: PricingPlan[] = [
  { 
    name: "Free", 
    price: "$0", 
    description: "Perfect for hobbyists and side projects.", 
    features: ["Up to 3 projects", "Basic analytics", "Community support", "1GB storage"], 
    buttonText: "Current Plan", 
    current: true 
  },
  { 
    name: "Pro", 
    price: "$19", 
    description: "For professionals and small teams.", 
    features: ["Unlimited projects", "Priority support", "Advanced analytics", "10GB storage", "Custom domains"], 
    buttonText: "Upgrade to Pro", 
    current: false, 
    popular: true 
  },
  { 
    name: "Enterprise", 
    price: "Custom", 
    description: "For large organizations.", 
    features: ["SLA guarantees", "Dedicated account manager", "Custom contracts", "Unlimited storage", "Single Sign-On (SSO)"], 
    buttonText: "Contact Sales", 
    current: false 
  },
]

export const mockInvoices: Invoice[] = [
  { id: "INV-001", date: "2024-05-01", amount: "$19.00", status: "Paid" },
  { id: "INV-002", date: "2024-04-01", amount: "$19.00", status: "Paid" },
  { id: "INV-003", date: "2024-03-01", amount: "$19.00", status: "Paid" },
]

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm_1", brand: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "pm_2", brand: "mastercard", last4: "8888", expiry: "08/25", isDefault: false },
]

export const mockAssets: Asset[] = [
  { 
    id: "1", 
    name: "hero-banner.jpg", 
    type: "image", 
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800", 
    size: "1.2 MB",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  { 
    id: "2", 
    name: "user-guide.pdf", 
    type: "document", 
    url: "#", 
    size: "3.5 MB",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  { 
    id: "3", 
    name: "product-demo.mp4", 
    type: "video", 
    url: "#", 
    size: "12.4 MB",
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  { 
    id: "4", 
    name: "logo-transparent.png", 
    type: "image", 
    url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800", 
    size: "450 KB",
    createdAt: new Date().toISOString()
  },
  { 
    id: "5", 
    name: "annual-report-2023.pdf", 
    type: "document", 
    url: "#", 
    size: "8.2 MB",
    createdAt: new Date(Date.now() - 604800000).toISOString()
  },
]

export const mockLogs: AuditLog[] = [
  { id: "1", event: "User Login", user: "john@example.com", ip: "192.168.1.1", date: "2024-05-12 10:30", status: "Success" },
]

export const mockApiKeys: ApiKey[] = [
  { id: "1", name: "Production Key", key: "pk_live_12345", created: "2024-01-10", status: "Active" },
]

export const mockFeatureFlags: FeatureFlag[] = [
  { id: "1", name: "AI Assistant", description: "Enable AI features.", enabled: true, beta: true },
]
