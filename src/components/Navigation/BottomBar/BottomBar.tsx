import { navLinks } from "@/components/Navigation/links";
import { cn } from "@/utils/cn";
import { NavLink } from "react-router-dom";

function BottomBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-primary/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-16px_40px_-16px_rgb(0_0_0/0.9)] backdrop-blur-xl sm:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              preventScrollReset={true}
              className={({ isActive }) =>
                cn(
                  "relative flex min-w-16 flex-col items-center gap-1 px-3 pt-3 pb-2.5 text-[11px] font-medium transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-accent"
                    />
                  )}
                  <Icon size={22} className={isActive ? "text-accent" : undefined} />
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

export default BottomBar;
