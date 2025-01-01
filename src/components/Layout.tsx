import { Outlet } from "react-router-dom";
import BottomBar from "./Navigation/BottomBar/BottomBar";
import Sidebar from "./Navigation/Sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="px-0 sm:px-3 py-5">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="">
        <main className="sm:ml-[110px] pb-28 sm:pb-6 px-3 sm:px-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomBar />
    </div>
  );
}
