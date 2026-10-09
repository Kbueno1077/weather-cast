import { cn } from "@/utils/cn";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        "bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
