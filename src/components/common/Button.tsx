import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "contained" | "outlinedWhite";
  fullWidth?: boolean;
}


export const Button = ({
  variant = "primary",
  fullWidth,
  className,
  ...props
}: ButtonProps) => {
  const base =
    "rounded-md font-semibold text-base px-8 py-3 transition duration-200 text-center";

  const styles = {
    primary: "bg-red-500 text-white hover:bg-red-600 border border-red-500",
    secondary:
      "bg-transparent text-white border border-white hover:bg-white/10 hover:border-white",
    outlined: "bg-transparent text-red-500 border border-red-500 hover:bg-red-50 hover:border-red-600",
    contained: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    outlinedWhite:
      "bg-transparent text-white border border-white hover:bg-white/10 hover:border-white",
  };

  return (
    <button
      className={cn(
        base,
        styles[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    />
  );
};
