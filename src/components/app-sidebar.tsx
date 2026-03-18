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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <BookMarked className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-white group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-base">EduManager CI</span>
            <span className="truncate text-xs text-slate-400">College & Lycee</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Tableau de bord" className="text-slate-300 hover:bg-slate-800 hover:text-white" isActive>
                <LayoutDashboard />
                <span>Tableau de bord</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Eleves" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <Users />
                <span>Eleves</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Classes" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <GraduationCap />
                <span>Classes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Enseignants" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <BookOpen />
                <span>Enseignants</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Notes & Bulletins" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <ClipboardList />
                <span>Notes & Bulletins</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Paiements" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <CreditCard />
                <span>Paiements</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Emplois du temps" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <Calendar />
                <span>Emplois du temps</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Absences & Discipline" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <UserX />
                <span>Absences & Discipline</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Messagerie" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <MessageSquare />
                <span>Messagerie</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configuration" className="text-slate-300 hover:bg-slate-800 hover:text-white">
                <Settings />
                <span>Configuration</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white font-semibold">
            AK
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-white group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">Amadou Kone</span>
            <span className="truncate text-xs text-slate-400">Directeur</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
