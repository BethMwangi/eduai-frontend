// components/common/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "contained" | "outlinedWhite";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  variant = "primary",
  fullWidth,
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200 text-center";

  const sizes = {
    sm: "text-sm h-9 px-3 py-2",
    md: "text-base h-10 px-4 py-2.5",
    lg: "text-base h-12 px-6 py-3",
  };

  const styles = {
    primary: "bg-red-500 text-white hover:bg-red-600 border border-red-500",
    secondary:
      "bg-transparent text-white border border-white hover:bg-white/10 hover:border-white",
    outlined:
      "bg-transparent text-red-500 border border-red-500 hover:bg-red-50 hover:border-red-600",
    contained: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    outlinedWhite:
      "bg-transparent text-white border border-white hover:bg-white/10 hover:border-white",
  };

  return (
    <button
      className={cn(
        base,
        sizes[size],
        styles[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    />
  );
};
