"use client"

import { useState, useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { TypographyH3, TypographyP } from "@workspace/ui/components/typography"
import { Input } from "@workspace/ui/components/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@workspace/ui/components/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { MoreHorizontal, UserPlus, Shield, UserX, Pencil, Search, Mail, User, Building2, LayoutGrid } from "lucide-react"

export interface Member {
  id: string
  name: string
  email: string
  role: string
  appRoles?: Record<string, string>
  status: "Active" | "Pending" | "Inactive"
  image?: string
}

interface MemberListProps {
  members: Member[]
  isAdmin?: boolean
  availableApps?: string[]
  onInvite?: (email: string) => void
  onAction?: (member: Member, action: string) => void
}

export function MemberList({ members, isAdmin, availableApps, onInvite, onAction }: MemberListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [roleMember, setRoleMember] = useState<Member | null>(null)
  const [appRoleMember, setAppRoleMember] = useState<Member | null>(null)

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [members, searchQuery])

  const handleRemove = (member: Member) => {
    onAction?.(member, "remove")
  }

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMember) {
      onAction?.(editingMember, "update")
      setEditingMember(null)
      toast.success("Member updated")
    }
  }

  const handleUpdateRole = (role: string) => {
    if (roleMember) {
      onAction?.({ ...roleMember, role }, "update")
      setRoleMember(null)
      toast.success(`Role changed to ${role}`)
    }
  }

  const handleUpdateAppRole = (appId: string, role: string) => {
    if (appRoleMember) {
      const newAppRoles = { ...appRoleMember.appRoles, [appId]: role }
      onAction?.({ ...appRoleMember, appRoles: newAppRoles }, "updateAppRoles")
      setAppRoleMember(prev => prev ? { ...prev, appRoles: newAppRoles } : null)
      toast.success(`${appId} role updated to ${role}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <TypographyH3 className="text-2xl font-bold tracking-tight">Team Members</TypographyH3>
          <TypographyP className="text-muted-foreground text-sm">
            Manage your team members and their access levels.
          </TypographyP>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={(e) => {
              e.preventDefault();
              const newMember: Member = {
                id: Math.random().toString(36).substr(2, 9),
                name: inviteName,
                email: inviteEmail,
                role: "member",
                status: "Pending"
              };
              onAction?.(newMember, "add");
              setIsInviteOpen(false);
              setInviteName("");
              setInviteEmail("");
              toast.success("Invitation sent");
              onInvite?.(inviteEmail);
            }}>
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                    leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <form onSubmit={handleUpdateMember}>
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
              <DialogDescription>Update member details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={editingMember?.name || ""} 
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={editingMember?.email || ""} 
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roleMember} onOpenChange={(open) => !open && setRoleMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Org Role</DialogTitle>
            <DialogDescription>Select a new organisation-level role for {roleMember?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {["admin", "member", "viewer"].map((role) => (
              <Button 
                key={role} 
                variant={roleMember?.role === role ? "secondary" : "outline"}
                className="justify-start gap-2"
                onClick={() => handleUpdateRole(role)}
              >
                <Building2 className={cn("h-4 w-4", roleMember?.role === role ? "text-primary" : "text-muted-foreground")} />
                {role}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!appRoleMember} onOpenChange={(open) => !open && setAppRoleMember(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change App Role</DialogTitle>
            <DialogDescription>Configure specific application access for {appRoleMember?.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {(availableApps || ["stoknstok", "feednstok", "posnstok", "vetnstok"]).map((appId) => (
              <div key={appId} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{appId}</h4>
                  <Badge variant="outline" className="text-[10px]">
                    {appRoleMember?.appRoles?.[appId] || "No Access"}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["admin", "member", "viewer"].map((role) => (
                    <Button
                      key={role}
                      variant={appRoleMember?.appRoles?.[appId] === role ? "secondary" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleUpdateAppRole(appId, role)}
                    >
                      {role}
                    </Button>
                  ))}
                  <Button
                    variant={!appRoleMember?.appRoles?.[appId] ? "secondary" : "outline"}
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => handleUpdateAppRole(appId, "")}
                  >
                    None
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setAppRoleMember(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-xl border border-border/50 shadow-sm">
        <Input 
          leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          placeholder="Search by name or email..." 
          className="bg-background border-none shadow-none focus-visible:ring-0 h-9" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                <TableHead className="px-6 h-12">Member</TableHead>
                <TableHead className="px-6 h-12">Role</TableHead>
                <TableHead className="px-6 h-12">App Roles</TableHead>
                <TableHead className="px-6 h-12">Status</TableHead>
                <TableHead className="px-6 h-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No members found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="group transition-colors hover:bg-muted/20 border-border/50">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={member.image} />
                          <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                            {member.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-sm leading-none group-hover:text-primary transition-colors">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="secondary" className="font-medium bg-muted/50 text-muted-foreground border-none capitalize">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {member.appRoles && Object.entries(member.appRoles).filter(([_, role]) => role).length > 0 ? (
                          Object.entries(member.appRoles)
                            .filter(([_, role]) => role)
                            .map(([appId, role]) => (
                              <Badge key={appId} variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary/20 text-primary bg-primary/5">
                                {appId}: {role}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">No app roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-wider px-2 py-0",
                          member.status === "Active" ? "text-green-600 border-green-200 bg-green-50" : 
                          member.status === "Pending" ? "text-amber-600 border-amber-200 bg-amber-50" : 
                          "text-muted-foreground border-muted-foreground/20"
                        )}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <MemberActions 
                        member={member} 
                        isAdmin={isAdmin}
                        onEdit={() => setEditingMember(member)} 
                        onRole={() => setRoleMember(member)} 
                        onAppRoles={() => setAppRoleMember(member)}
                        onRemove={() => handleRemove(member)} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile List View (Media Style) */}
        <div className="md:hidden divide-y divide-border/50">
          {filteredMembers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No members found matching your search.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between gap-4 bg-card hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm shrink-0">
                    <AvatarImage src={member.image} />
                    <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm leading-none truncate">{member.name}</span>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-[9px] uppercase tracking-tighter px-1 py-0 h-4",
                          member.status === "Active" ? "text-green-600 border-green-200 bg-green-50" : 
                          member.status === "Pending" ? "text-amber-600 border-amber-200 bg-amber-50" : 
                          "text-muted-foreground border-muted-foreground/20"
                        )}
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[10px] font-medium bg-muted/50 text-muted-foreground border-none h-5 px-2 capitalize shrink-0">
                        {member.role}
                      </Badge>
                      {member.appRoles && Object.entries(member.appRoles)
                        .filter(([_, role]) => role)
                        .map(([appId, role]) => (
                          <Badge key={appId} variant="outline" className="text-[9px] px-1 py-0 h-4 border-primary/20 text-primary bg-primary/5 shrink-0">
                            {appId[0].toUpperCase()}: {role}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
                <MemberActions 
                  member={member} 
                  isAdmin={isAdmin}
                  onEdit={() => setEditingMember(member)} 
                  onRole={() => setRoleMember(member)} 
                  onAppRoles={() => setAppRoleMember(member)}
                  onRemove={() => handleRemove(member)} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function MemberActions({ 
  member, 
  isAdmin,
  onEdit, 
  onRole, 
  onAppRoles,
  onRemove 
}: { 
  member: Member, 
  isAdmin?: boolean,
  onEdit: () => void, 
  onRole: () => void, 
  onAppRoles: () => void,
  onRemove: () => void 
}) {
  if (!isAdmin) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted transition-colors">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Member
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onRole}>
          <Building2 className="mr-2 h-4 w-4" />
          Change Org Role
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onAppRoles}>
          <LayoutGrid className="mr-2 h-4 w-4" />
          Change App Role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive cursor-pointer focus:text-destructive" 
          onClick={onRemove}
        >
          <UserX className="mr-2 h-4 w-4" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
