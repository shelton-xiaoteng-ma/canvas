import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <aside className="hidden h-full w-[300px] left-0 shrink-0 lg:flex fixed flex-col ">
      <Logo />
      <SidebarRoutes />
    </aside>
  );
};
