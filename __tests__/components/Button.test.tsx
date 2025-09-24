import { render, screen, fireEvent } from '@testing-library/react'
import { AccessibleButton } from '@/components/ui/AccessibleButton'

describe('AccessibleButton', () => {
  it('renders correctly with default props', () => {
    render(<AccessibleButton>Click me</AccessibleButton>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary-600')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<AccessibleButton variant="secondary">Secondary</AccessibleButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-600')

    rerender(<AccessibleButton variant="outline">Outline</AccessibleButton>)
    expect(screen.getByRole('button')).toHaveClass('border-gray-300')

    rerender(<AccessibleButton variant="destructive">Destructive</AccessibleButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<AccessibleButton disabled>Disabled</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('shows loading state', () => {
    render(<AccessibleButton loading>Loading</AccessibleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('relative', 'overflow-hidden')
  })

  it('applies custom className', () => {
    render(<AccessibleButton className="custom-class">Custom</AccessibleButton>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('supports aria attributes', () => {
    render(
      <AccessibleButton 
        aria-label="Custom label"
        aria-describedby="description"
        aria-expanded={true}
      >
        Button
      </AccessibleButton>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('aria-describedby', 'description')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
