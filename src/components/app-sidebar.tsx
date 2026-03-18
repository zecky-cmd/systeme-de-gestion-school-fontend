"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  BookMarked
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

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
  { title: "Configuration", url: "/config", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
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
          <SidebarMenu className="gap-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                  isActive={pathname === item.url}
                  render={<Link href={item.url} />}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white font-semibold">
              AK
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">Amadou Kone</span>
              <span className="truncate text-xs opacity-70">Directeur</span>
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
