import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Calendar from '..'
import { Button } from '@/components/button'
import { DateRange } from 'react-day-picker'
import { format as formatDateFns } from 'date-fns'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Form/Calendar',
  component: Calendar,
  tags: ['dev'],
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the calendar input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'range', 'multiple'],
      description: 'The selection mode of the calendar',
      table: {
        type: { summary: 'single | range | multiple' },
        defaultValue: { summary: 'single' },
      },
    },
    selected: {
      control: false,
      description: 'The selected date, date range, or array of dates.',
      table: {
        type: { summary: 'Date | Date[] | DateRange | undefined' },
      },
    },
    onSelect: {
      action: 'onSelect',
      description:
        'Callback fired when a date is selected. Returns Date objects.',
      table: {
        type: { summary: '(value: ... | undefined) => void' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Determines if the calendar input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Determines if the calendar input is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Determines if the calendar input is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasError: {
      control: 'boolean',
      description: 'Determines if the calendar input has an error',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the calendar input',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Determines if the input should take up the full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    formatDate: {
      control: 'text',
      description: 'The date-fns format string for the display value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'MM/dd/yyyy' },
      },
    },
    options: {
      control: 'object',
      description: 'Advanced options passed directly to react-day-picker',
      table: {
        type: { summary: 'Partial<DayPickerProps>' },
      },
    },
  },
  args: {
    label: 'Event Date',
    mode: 'single',
    selected: undefined,
    disabled: false,
    readOnly: false,
    required: false,
    hasError: false,
    fullWidth: false,
    inputSize: 'md',
    formatDate: 'MM/dd/yyyy',
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Playground: Story = {
  render: args => {
    const [selected, setSelected] = useState<
      Date | Date[] | DateRange | undefined
    >(args.selected as Date)

    return (
      <Calendar
        {...args}
        selected={selected}
        onSelect={val => {
          setSelected(val as Date | Date[] | DateRange | undefined)
          // Also call the storybook action
          args.onSelect?.(val)
        }}
      />
    )
  },
}

export const Single: Story = {
  args: { mode: 'single', label: 'Select a date' },
  render: args => {
    const [date, setDate] = useState<Date | undefined>()

    return (
      <div className="flex flex-col items-center gap-space-md">
        <Calendar
          {...args}
          selected={date}
          onSelect={val => setDate(val as Date)}
        />
        <p className="text-body-sm text-ds-subtle">
          Selected: {date ? formatDateFns(date, args.formatDate!) : 'None'}
        </p>
      </div>
    )
  },
}

export const Range: Story = {
  args: { mode: 'range', label: 'Select range', formatDate: 'd MMM yyy' },
  render: args => {
    const [range, setRange] = useState<DateRange | undefined>()
    const format = args.formatDate!

    return (
      <div className="flex flex-col items-center gap-space-md">
        <Calendar
          {...args}
          selected={range}
          onSelect={val => setRange(val as DateRange)}
        />
        <p className="text-body-sm text-ds-subtle">
          From: {range?.from ? formatDateFns(range.from, format) : '–'} | To:{' '}
          {range?.to ? formatDateFns(range.to, format) : '–'}
        </p>
      </div>
    )
  },
}

export const Multiple: Story = {
  args: { mode: 'multiple', label: 'Select multiple dates' },
  render: args => {
    const [dates, setDates] = useState<Date[]>([])
    const format = args.formatDate!

    return (
      <div className="w-full flex flex-col items-center gap-space-md">
        <Calendar
          {...args}
          className="self-start"
          selected={dates}
          onSelect={val => setDates(val as Date[])}
          options={{
            disabled: {
              before: new Date(),
            },
          }}
        />
        <p className="text-body-sm text-ds-subtle">
          Selected:{' '}
          {dates?.length
            ? dates.map(d => formatDateFns(d, format)).join(', ')
            : 'None'}
        </p>
      </div>
    )
  },
}

export const ControlledExample: Story = {
  args: { mode: 'single', label: 'Controlled date picker' },
  render: args => {
    const [date, setDate] = useState<Date | undefined>(
      new Date('2025-01-01T12:00:00')
    )
    const format = args.formatDate!

    return (
      <div className="flex flex-col items-center gap-space-md">
        <div className="flex gap-space-sm">
          <Button onClick={() => setDate(new Date('2025-10-19T12:00:00'))}>
            Set Date
          </Button>
          <Button variant="outlinePrimary" onClick={() => setDate(undefined)}>
            Clear
          </Button>
        </div>
        <Calendar
          {...args}
          selected={date}
          onSelect={val => setDate(val as Date | undefined)}
        />
        <p className="text-body-md text-ds-subtle">
          Current: {date ? formatDateFns(date, format) : 'None'}
        </p>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: { mode: 'single', disabled: true, label: 'Disabled calendar' },
  render: args => (
    <div className="flex flex-col items-center gap-space-md">
      <Calendar {...args} />
      <p className="text-body-sm text-ds-subtle">Calendar is disabled.</p>
    </div>
  ),
}

export const CustomFormat: Story = {
  args: {
    mode: 'single',
    formatDate: 'd, MMM yy',
    label: 'Custom format date',
  },
  render: args => {
    const [date, setDate] = useState<Date | undefined>()

    return (
      <div className="flex flex-col items-center gap-space-md">
        <Calendar
          {...args}
          selected={date}
          onSelect={val => setDate(val as Date | undefined)}
        />
        <p className="text-body-sm text-ds-subtle">
          Selected: {date ? formatDateFns(date, args.formatDate!) : 'None'}
        </p>
      </div>
    )
  },
}

export const MinToday: Story = {
  args: {
    mode: 'single',
    label: 'Select a date (today or later)',
    options: {
      navLayout: 'after',
      disabled: {
        before: new Date(),
      },
    },
  },
  render: args => {
    const [date, setDate] = useState<Date | undefined>()
    const format = args.formatDate!

    return (
      <div className="w-full flex flex-col items-center gap-space-md">
        <Calendar
          {...args}
          className="self-start"
          selected={date}
          onSelect={val => setDate(val as Date | undefined)}
        />
        <p className="text-body-sm text-ds-subtle">
          Selected: {date ? formatDateFns(date, format) : 'None'}
        </p>
      </div>
    )
  },
}
