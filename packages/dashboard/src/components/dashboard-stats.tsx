"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { motion } from "framer-motion"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"

const defaultStats = [
  { title: "Total Revenue", value: "IDR 12.5M", change: "+12.5%", icon: <DollarSign className="h-4 w-4" /> },
  { title: "Active Users", value: "1,240", change: "+3.2%", icon: <Users className="h-4 w-4" /> },
  { title: "Transactions", value: "842", change: "+18%", icon: <TrendingUp className="h-4 w-4" /> },
  { title: "System Status", value: "Healthy", change: "100%", icon: <Activity className="h-4 w-4" /> },
]

export function DashboardStats({ stats = defaultStats }: { stats?: typeof defaultStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stat.value}</div>
              <p className="text-xs text-primary font-bold mt-1">
                {stat.change} <span className="text-muted-foreground font-normal">from last month</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
