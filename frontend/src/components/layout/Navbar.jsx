import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "./Logo";

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${isActive ? "text-ink" : "text-muted hover:text-ink"}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="glass sticky top-0 z-20 border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Logo to="/app" />
          <nav className="flex gap-5">
            <NavLink to="/app" end className={linkClass}>Projects</NavLink>
            <NavLink to="/app/profile" className={linkClass}>Profile</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/app/profile" aria-label="Your profile">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="size-8 rounded-full ring-2 ring-signal/30" referrerPolicy="no-referrer" />
            ) : (
              <span className="grid size-8 place-items-center rounded-full bg-signal text-sm font-bold text-white">{user?.name?.[0]}</span>
            )}
          </Link>
          <Button variant="ghost" onClick={logout}>Log out</Button>
        </div>
      </div>
    </header>
  );
}
