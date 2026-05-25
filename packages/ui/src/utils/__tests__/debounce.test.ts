import { debounce } from '../debounce'

jest.useFakeTimers()

describe('utils/debounce', () => {
  let func: jest.Mock
  let debouncedFunc: ReturnType<typeof debounce>

  beforeEach(() => {
    func = jest.fn()
    debouncedFunc = debounce(func, 100)
  })

  it('should only execute the function after the delay', () => {
    debouncedFunc()
    expect(func).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should only execute the function once for multiple rapid calls', () => {
    for (let i = 0; i < 10; i++) {
      debouncedFunc()
      jest.advanceTimersByTime(50)
    }

    expect(func).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should pass the latest arguments to the debounced function', () => {
    debouncedFunc('a', 1)
    debouncedFunc('b', 2)
    debouncedFunc('c', 3)
    expect(func).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func).toHaveBeenCalledWith('c', 3)
  })

  it('should not execute the function if cancel is called', () => {
    debouncedFunc()
    expect(func).not.toHaveBeenCalled()

    debouncedFunc.cancel()
    jest.advanceTimersByTime(100)

    expect(func).not.toHaveBeenCalled()
  })

  it('should allow subsequent calls after a cancel', () => {
    debouncedFunc('call 1')
    debouncedFunc.cancel()
    jest.advanceTimersByTime(100)
    expect(func).not.toHaveBeenCalled()

    debouncedFunc('call 2')
    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func).toHaveBeenCalledWith('call 2')
  })

  it('should create independent debounced functions', () => {
    const func2 = jest.fn()
    const debouncedFunc2 = debounce(func2, 200)

    debouncedFunc('func1')
    debouncedFunc2('func2')

    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func2).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(func).toHaveBeenCalledTimes(1)
    expect(func2).toHaveBeenCalledTimes(1)
    expect(func2).toHaveBeenCalledWith('func2')
  })
})
