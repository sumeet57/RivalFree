import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <Sidebar />
      <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 sm:px-6 md:px-10 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}
