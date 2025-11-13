import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'glass-button-primary',
        glass: 'glass-button',
        outline: 'glass-button border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
        ghost: 'glass-button border-0 hover:bg-primary-50',
        destructive: 'glass-button bg-red-500 text-white border-0 hover:bg-red-600',
        secondary: 'glass-button border border-gray-200 text-gray-700 hover:bg-gray-100',
      },
      size: {
        sm: 'h-11 px-4 text-sm min-h-[44px]',
        default: 'h-12 px-6 text-base min-h-[48px]',
        lg: 'h-14 px-8 text-lg min-h-[56px]',
        icon: 'h-12 w-12 min-h-[48px] min-w-[48px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
