"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  Calendar,
  UserX,
  MessageSquare,
  Settings,
  BookMarked,
  ChevronRight
} from "lucide-react"

import { useAuthStore } from "@/store/authStore"
import { NAV_PERMISSIONS, UserRole } from "@/constants/permissions"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Eleves", url: "/eleves", icon: Users },
  { title: "Classes", url: "/classes", icon: GraduationCap },
  { title: "Enseignants", url: "/enseignants", icon: BookOpen },
  { title: "Notes & Bulletins", url: "/notes", icon: ClipboardList },
  { title: "Paiements", url: "/paiements", icon: CreditCard },
  { title: "Emplois du temps", url: "/emplois", icon: Calendar },
  { title: "Absences & Discipline", url: "/absences", icon: UserX },
  { title: "Messagerie", url: "/messagerie", icon: MessageSquare },
  { 
    title: "Configuration", 
    url: "/config", 
    icon: Settings,
    items: [
      { title: "Identité & Académique", url: "/config" },
      { title: "Pédagogie", url: "/config/pedagogie" },
      { title: "Frais Scolarité", url: "/config/frais" },
      { title: "Utilisateurs & Rôles", url: "/config/utilisateurs" },
      { title: "Sécurité", url: "/config/securite" },
    ]
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const userRole = (user?.role || "elv") as UserRole
  
  const [openMenus, setOpenMenus] = React.useState<string[]>(() => {
    // Auto-open menu if current path is a sub-item
    const activeParent = navItems.find(item => 
      item.items?.some(sub => pathname === sub.url || pathname.startsWith(sub.url + "/"))
    )
    return activeParent ? [activeParent.title] : []
  })

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const filteredNavItems = navItems.map(item => ({ ...item })).filter(item => {
    // Check parent permission
    const isParentAllowed = NAV_PERMISSIONS[item.url] 
      ? NAV_PERMISSIONS[item.url].includes(userRole) 
      : true

    // If item has children, filter them too
    if (item.items) {
      item.items = item.items.filter(sub => 
        NAV_PERMISSIONS[sub.url] ? NAV_PERMISSIONS[sub.url].includes(userRole) : true
      )
      // If parent is not allowed but has allowed children, we might still show parent header
      return item.items.length > 0 || isParentAllowed
    }

    return isParentAllowed
  })

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <BookMarked className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-base">EduManager CI</span>
            <span className="truncate text-xs opacity-70">College & Lycee</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {filteredNavItems.map((item) => {
              const hasSubItems = item.items && item.items.length > 0
              const isOpen = openMenus.includes(item.title)
              const isChildActive = hasSubItems && item.items?.some(sub => pathname === sub.url)
              const isActive = pathname === item.url || isChildActive

              return (
                <SidebarMenuItem key={item.title}>
                  {hasSubItems ? (
                    <>
                      <SidebarMenuButton 
                        onClick={() => toggleMenu(item.title)}
                        tooltip={item.title}
                        className={cn(
                          "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive && !isOpen && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className={cn("ml-auto transition-transform duration-200", isOpen && "rotate-90")} />
                      </SidebarMenuButton>
                      
                      {isOpen && (
                        <SidebarMenuSub>
                          {item.items?.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton 
                                isActive={pathname === sub.url}
                                render={<Link href={sub.url} />}
                              >
                                <span>{sub.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                      isActive={pathname === item.url}
                      render={<Link href={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
