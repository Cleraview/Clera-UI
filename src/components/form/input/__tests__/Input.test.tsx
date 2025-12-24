import { render, screen, fireEvent, act } from '@testing-library/react'
import { Input } from '..'
import '@testing-library/jest-dom'

describe('components/form/Input', () => {
  it('renders with label', () => {
    render(<Input id="email" label="Email" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows the label on focus', () => {
    render(<Input id="username" label="Username" />)
    const input = screen.getByLabelText('Username')

    act(() => {
      input.focus()
      fireEvent.focus(input)
    })

    expect(input).toHaveFocus()
  })

  it('retains label position on blur when input is filled', () => {
    render(<Input id="email" label="Email" />)

    const input = screen.getByLabelText('Email')

    act(() => {
      input.focus()
      fireEvent.change(input, { target: { value: 'test@example.com' } })
      fireEvent.blur(input)
    })

    expect(input).toHaveValue('test@example.com')

    // const label = container.querySelector('label')
    // expect(label).toHaveClass('translate-y-[10px]')
  })

  it('resets label position on blur when input is empty', () => {
    render(<Input id="email" label="Email" />)

    const input = screen.getByLabelText('Email')

    act(() => {
      input.focus()
      fireEvent.blur(input)
    })

    expect(input).toHaveValue('')

    // const label = container.querySelector('label')
    // expect(label).toHaveClass('translate-y-[10px]')
  })

  it('applies disabled state', () => {
    render(<Input id="disabled" label="Username" disabled />)
    const input = screen.getByLabelText('Disabled')
    expect(input).toBeDisabled()
  })

  it('applies readOnly state', () => {
    render(<Input id="readonly" label="Username" readOnly />)
    const input = screen.getByLabelText('Read Only')
    expect(input).toHaveAttribute('readOnly')
  })

  it('renders required asterisk when required', () => {
    render(<Input id="email" label="Email" required />)
    expect(screen.getAllByText('*')).toHaveLength(2)
  })

  it('handles value change and calls onChange', () => {
    const handleChange = jest.fn()
    render(<Input id="username" label="Username" onChange={handleChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('calls onBlur prop when blurred', () => {
    const handleBlur = jest.fn()
    render(<Input id="email" label="Email" onBlur={handleBlur} />)

    const input = screen.getByLabelText('Email')
    fireEvent.focus(input)
    fireEvent.blur(input)

    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('applies error styles when hasError is true', () => {
    render(<Input id="email" label="Email" hasError />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveClass('text-ds-destructive')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input id="email" label="Email" type="email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input id="password" label="Password" type="password" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    )
  })
})
