import { ReactNode } from "react";

interface BoxWrapperProps {
  id?: string;
  children: ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function BoxWrapper({
  id,
  children,
  className,
  style,
  title,
  onClick,
}: BoxWrapperProps) {
  return (
    <>
      {title && (
        <h2 className="text-xl text-primary-foreground font-bold">{title}</h2>
      )}
      <div
        id={id}
        className={`bg-primary rounded-2xl shadow-lg p-6 ${className || ""}`}
        onClick={onClick}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        style={{ ...style }}
      >
        {children}
      </div>
    </>
  );
}
