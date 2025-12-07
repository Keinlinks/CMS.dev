import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { DynamicBreadcrumb } from "@/components/dashboard/dynamicBreadcrumb";
import { getUserOrganizations } from "@/lib/actions/sidebar";
import { getUserRoleInCurrentOrg } from "@/lib/actions/user-role";
import { UserRoleProvider } from "@/components/providers/user-role-provider";
import { getSession } from "@/lib/actions/session";
import { redirect } from "next/navigation";

export default async function LayoutPage({ children }: { children: React.ReactNode }) {
  // Validar sesión antes de renderizar el dashboard
  const session = await getSession()

  // Si no hay sesión válida, redirigir a login
  if (!session.isValid || !session.user) {
    redirect('/login')
  }

  // Fetch organizations for the sidebar
  const organizations = await getUserOrganizations()

  // Fetch user role in current organization
  const userRole = await getUserRoleInCurrentOrg()

  return (
    <UserRoleProvider role={userRole}>
      <SidebarProvider>
        <AppSidebar organizations={organizations} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 max-h-1/2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <DynamicBreadcrumb />


            </div>
            <div className="ml-auto flex items-center gap-2 px-5">
              <LanguageToggle />
              <ThemeToggle />
            </div>

          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div> */}
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-10" >
              {children}
            </div>

          </div>

        </SidebarInset>
      </SidebarProvider>
    </UserRoleProvider>
  )
}