import { navLinks } from "@/components/Navigation/links";
import { cn } from "@/utils/cn";
import { FaUmbrellaBeach } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav
      aria-label="Main"
      className="fixed top-5 bottom-5 left-3 z-40 hidden w-[85px] flex-col items-center rounded-3xl border border-line bg-primary py-6 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_24px_48px_-28px_rgb(0_0_0/0.8)] sm:flex"
    >
      <Link
        to="/"
        aria-label="WeatherCast home"
        className="mb-10 grid size-12 place-items-center rounded-2xl bg-accent text-white shadow-[0_10px_28px_-10px_rgb(59_130_246/0.9)] transition-transform duration-200 hover:-rotate-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <FaUmbrellaBeach size={22} />
      </Link>

      <ul className="flex flex-col gap-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex w-16 flex-col items-center gap-1.5 rounded-2xl py-3 text-[11px] font-medium tracking-wide transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isActive
                    ? "bg-white/[0.06] text-primary-foreground"
                    : "text-foreground hover:bg-white/[0.03] hover:text-primary-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 -left-2.5 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent"
                    />
                  )}
                  <Icon size={20} className={isActive ? "text-accent" : undefined} />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
