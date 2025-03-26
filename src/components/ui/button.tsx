import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    // Build the class string based on variant and size
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-600 bg-transparent hover:bg-gray-800",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      ghost: "bg-transparent hover:bg-gray-800",
      link: "text-blue-500 underline-offset-4 hover:underline bg-transparent"
    };
    
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 py-1 text-sm",
      lg: "h-11 px-6 py-3 text-lg",
      icon: "h-10 w-10 p-2"
    };
    
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;
    
    // If asChild is true, we would ideally use Slot from radix-ui, but since we're simplifying,
    // we'll just use a regular button
    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

// Define the same types for variant and size to ensure consistency
type ButtonVariant = NonNullable<ButtonProps['variant']>;
type ButtonSize = NonNullable<ButtonProps['size']>;

// This maintains the same exports so other components don't break
interface ButtonVariantsConfig {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const buttonVariants = (options?: ButtonVariantsConfig) => {
  const { 
    variant = "default", 
    size = "default", 
    className = "" 
  } = options || {};
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-600 bg-transparent hover:bg-gray-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-800",
    link: "text-blue-500 underline-offset-4 hover:underline bg-transparent"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 py-1 text-sm",
    lg: "h-11 px-6 py-3 text-lg",
    icon: "h-10 w-10 p-2"
  };
  
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export { Button, buttonVariants } 