'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'error' | 'success'
  'aria-describedby'?: string
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      error,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      className,
      id,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    
    const isPassword = props.type === 'password'
    const hasError = !!error
    const isSuccess = success && !hasError
    
    // Determinar variante baseada no estado
    const inputVariant = hasError ? 'error' : isSuccess ? 'success' : variant
    
    const baseClasses = [
      'block',
      'w-full',
      'px-3',
      'py-2',
      'border',
      'rounded-lg',
      'text-gray-900',
      'placeholder-gray-500',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:bg-gray-50',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed'
    ]

    const variantClasses = {
      default: [
        'border-gray-300',
        'bg-white',
        'hover:border-gray-400',
        'focus:border-primary-500',
        'focus:ring-primary-500'
      ],
      error: [
        'border-red-300',
        'bg-red-50',
        'hover:border-red-400',
        'focus:border-red-500',
        'focus:ring-red-500',
        'text-red-900',
        'placeholder-red-400'
      ],
      success: [
        'border-green-300',
        'bg-green-50',
        'hover:border-green-400',
        'focus:border-green-500',
        'focus:ring-green-500',
        'text-green-900',
        'placeholder-green-400'
      ]
    }

    const inputClasses = cn(
      baseClasses,
      variantClasses[inputVariant],
      leftIcon && 'pl-10',
      (rightIcon || isPassword) && 'pr-10',
      className
    )

    const labelClasses = cn(
      'block',
      'text-sm',
      'font-medium',
      'mb-2',
      hasError ? 'text-red-700' : isSuccess ? 'text-green-700' : 'text-gray-700'
    )

    const helperClasses = cn(
      'mt-1',
      'text-sm',
      hasError ? 'text-red-600' : isSuccess ? 'text-green-600' : 'text-gray-500'
    )

    const describedBy = [
      helperText && helperId,
      hasError && errorId,
      ariaDescribedby
    ].filter(Boolean).join(' ')

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400" aria-hidden="true">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : props.type}
            className={inputClasses}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError}
            aria-required={props.required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {rightIcon && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400" aria-hidden="true">
                {rightIcon}
              </div>
            </div>
          )}
          
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
          
          {/* Ícone de status */}
          {(hasError || isSuccess) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {hasError ? (
                <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
              )}
            </div>
          )}
        </div>
        
        {/* Texto de ajuda */}
        {helperText && (
          <p id={helperId} className={helperClasses}>
            {helperText}
          </p>
        )}
        
        {/* Mensagem de erro */}
        {hasError && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'
