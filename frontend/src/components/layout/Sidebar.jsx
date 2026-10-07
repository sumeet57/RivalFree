import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "./Logo";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-paper text-ink" : "text-muted hover:text-ink"
  }`;

// Left sidebar on desktop, top bar on mobile.
export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-3 md:h-screen md:flex-col md:flex-nowrap md:items-stretch md:justify-start md:gap-8 md:border-b-0 md:border-r md:px-4 md:py-6">
      <Logo to="/app" />

      <nav className="order-last flex w-full gap-1 md:order-none md:flex-col">
        <NavLink to="/app" end className={linkClass}>Projects</NavLink>
        <NavLink to="/app/profile" className={linkClass}>Profile</NavLink>
      </nav>

      <div className="flex items-center gap-3 md:mt-auto md:border-t md:border-line md:pt-4">
        {user?.avatar && <img src={user.avatar} alt="" className="size-8 rounded-full" referrerPolicy="no-referrer" />}
        <div className="hidden min-w-0 flex-1 md:block">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
        <Button variant="ghost" onClick={logout} className="px-2">Log out</Button>
      </div>
    </aside>
  );
}
