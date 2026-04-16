import { DashboardLayout } from "@workspace/dashboard"
import { 
  LayoutDashboardIcon, 
  Settings2Icon, 
  SearchIcon, 
  CircleHelpIcon, 
  CommandIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon
} from "lucide-react"

const config = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  brand: {
    name: "Acme Dashboard",
    logo: <CommandIcon className="size-5" />,
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
  navSecondary: [
    {
      title: "Quick Search",
      url: "#",
      icon: <SearchIcon />,
    },
    {
      title: "Help Center",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
  documents: [
    {
      name: "Annual Report",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Database Schema",
      url: "#",
      icon: <DatabaseIcon />,
    },
  ]
}

export default function DashboardPage() {
  return (
    <DashboardLayout config={config} title="Project Overview">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </DashboardLayout>
  )
}
