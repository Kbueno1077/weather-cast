import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface BoxWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  children: ReactNode;
  title?: string;
  onClick?: () => void;
}

export default function BoxWrapper({
  children,
  className,
  title,
  onClick,
  ...rest
}: BoxWrapperProps) {
  return (
    <>
      {title && (
        <h2 className="font-display text-lg font-semibold tracking-tight text-primary-foreground">
          {title}
        </h2>
      )}
      <div
        {...rest}
        className={cn(
          "bg-primary rounded-3xl p-6 border border-line",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_24px_48px_-28px_rgb(0_0_0/0.8)]",
          onClick &&
            "cursor-pointer transition-colors duration-200 hover:bg-[#263143] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className
        )}
        onClick={onClick}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
        role={onClick ? "button" : rest.role}
        tabIndex={onClick ? 0 : rest.tabIndex}
      >
        {children}
      </div>
    </>
  );
}
