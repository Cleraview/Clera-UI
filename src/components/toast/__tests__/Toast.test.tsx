import { fireEvent, render, screen } from '@testing-library/react'
import { FaInfoCircle } from 'react-icons/fa'
import { Toast, type ToastProps } from '..'

describe('components/Toast', () => {
  it('renders title and description correctly', () => {
    const element = render(
      <Toast title="Heads up" description="Something happened." />
    )

    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Something happened.')).toBeInTheDocument()
    expect(element).toMatchSnapshot()
  })

  it('renders with default props', () => {
    render(<Toast title="Notification" />)
    const toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveTextContent('Notification')
  })

  it.each([
    ['primary'],
    ['secondary'],
    ['destructive'],
    ['success'],
    ['info'],
    ['warning'],
    ['light'],
    ['outlinePrimary'],
    ['outlineSecondary'],
    ['outlineDestructive'],
    ['ghost'],
  ])('renders with variant %s', variant => {
    render(<Toast title="Variant" variant={variant as ToastProps['variant']} />)
    const toast = screen.getByRole('status')
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveTextContent('Variant')
  })

  it.each([['none'], ['sm'], ['md'], ['full']])(
    'applies rounded %s',
    rounded => {
      render(
        <Toast title="Rounded" rounded={rounded as ToastProps['rounded']} />
      )
      const toast = screen.getByRole('status')
      expect(toast).toBeInTheDocument()
    }
  )

  it('renders with icon', () => {
    render(<Toast title="Heads up" icon={<FaInfoCircle />} />)
    const toast = screen.getByRole('status')
    expect(toast.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with action', () => {
    render(
      <Toast
        title="Update available"
        action={<button type="button">Restart</button>}
      />
    )
    expect(screen.getByText('Restart')).toBeInTheDocument()
  })

  it('does not render close button by default', () => {
    render(<Toast title="Not closable" />)
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  it('renders close button when closable is true', () => {
    render(<Toast title="Closable" closable />)
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  it('hides close button when closable is false', () => {
    render(<Toast title="Not closable" closable={false} />)
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<Toast title="Closable" closable onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Close').closest('button')!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('unmounts toast content after close is clicked', () => {
    render(<Toast title="Goodbye" closable />)
    fireEvent.click(screen.getByLabelText('Close').closest('button')!)
    expect(screen.queryByText('Goodbye')).not.toBeInTheDocument()
  })

  it('calls afterClose after the close transition', () => {
    jest.useFakeTimers()
    const afterClose = jest.fn()
    render(<Toast title="Bye" closable afterClose={afterClose} />)
    fireEvent.click(screen.getByLabelText('Close').closest('button')!)
    expect(afterClose).not.toHaveBeenCalled()
    jest.advanceTimersByTime(150)
    expect(afterClose).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('applies custom className to root', () => {
    render(<Toast title="Styled" className="custom-class" />)
    expect(screen.getByRole('status').className).toMatch(/custom-class/)
  })

  it('does not render title section when title is not provided', () => {
    render(<Toast description="Only description" />)
    expect(screen.getByText('Only description')).toBeInTheDocument()
  })
})
