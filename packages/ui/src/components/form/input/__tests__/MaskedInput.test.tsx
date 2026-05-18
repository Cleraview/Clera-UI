import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MaskedInput } from '../MaskedInput'

describe('components/form/MaskedInput', () => {
  it('renders with label and applies mask preset', () => {
    render(
      <MaskedInput label="Phone" maskPreset="phoneUS" placeholder="Phone" />
    )
    const input = screen.getByLabelText('Phone') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1234567890' } })
    expect(input.value).toBe('(123) 456-7890')
  })

  it('handles controlled component behavior with rawValue', () => {
    const onRawChange = jest.fn()
    render(
      <MaskedInput
        label="Phone"
        maskPreset="phoneUS"
        rawValue="9876543210"
        onRawChange={onRawChange}
      />
    )
    const input = screen.getByLabelText('Phone') as HTMLInputElement
    expect(input.value).toBe('(987) 654-3210')

    fireEvent.change(input, { target: { value: '111' } })
    expect(onRawChange).toHaveBeenCalledWith('111')
  })

  it('handles uncontrolled component behavior', () => {
    render(<MaskedInput label="CVC" maskPreset="cvc3" />)
    const input = screen.getByLabelText('CVC') as HTMLInputElement
    fireEvent.change(input, { target: { value: '123' } })
    expect(input.value).toBe('123')
  })

  it('handles custom mask', () => {
    render(<MaskedInput label="Custom" mask="AA-99" />)
    const input = screen.getByLabelText('Custom') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'xy78' } })
    expect(input.value).toBe('xy-78')
  })

  it('handles backspace correctly', async () => {
    const onRawChange = jest.fn()
    render(
      <MaskedInput
        label="Phone"
        maskPreset="phoneUS"
        rawValue="123456"
        onRawChange={onRawChange}
      />
    )
    const input = screen.getByLabelText('Phone') as HTMLInputElement
    expect(input.value).toBe('(123) 456-')

    await act(async () => {
      input.focus()
      input.setSelectionRange(10, 10)
      fireEvent.keyDown(input, { key: 'Backspace' })
    })

    expect(onRawChange).toHaveBeenCalledWith('12345')
  })

  it('handles delete key correctly', async () => {
    const onRawChange = jest.fn()
    render(
      <MaskedInput
        label="Phone"
        maskPreset="phoneUS"
        rawValue="1234567"
        onRawChange={onRawChange}
      />
    )
    const input = screen.getByLabelText('Phone') as HTMLInputElement
    expect(input.value).toBe('(123) 456-7')

    await act(async () => {
      input.focus()
      input.setSelectionRange(8, 8)
      fireEvent.keyDown(input, { key: 'Delete' })
    })

    expect(onRawChange).toHaveBeenCalledWith('123457')
  })

  it('respects maxRawLength', () => {
    render(<MaskedInput label="CVC" maskPreset="cvc3" maxRawLength={3} />)
    const input = screen.getByLabelText('CVC') as HTMLInputElement
    fireEvent.change(input, { target: { value: '1234' } })
    expect(input.value).toBe('123')
  })

  it('applies disabled state', () => {
    render(<MaskedInput label="Phone" maskPreset="phoneUS" disabled />)
    const input = screen.getByLabelText('Disabled') as HTMLInputElement
    expect(input).toBeDisabled()
  })

  it('applies readOnly state', () => {
    render(<MaskedInput label="Phone" maskPreset="phoneUS" readOnly />)
    const input = screen.getByLabelText('Read Only') as HTMLInputElement
    expect(input).toHaveAttribute('readOnly')
  })

  it('handles blur and focus', () => {
    const onBlur = jest.fn()
    const { container } = render(
      <MaskedInput label="Phone" maskPreset="phoneUS" onBlur={onBlur} />
    )
    const input = screen.getByLabelText('Phone')
    const fieldset = container.querySelector('fieldset')

    fireEvent.focus(input)
    expect(fieldset).toHaveClass('border-ds-focused')

    fireEvent.blur(input)
    expect(fieldset).not.toHaveClass('border-ds-focused')
    expect(onBlur).toHaveBeenCalled()
  })
})
