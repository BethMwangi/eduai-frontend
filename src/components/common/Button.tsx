import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
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
