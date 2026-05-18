import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState, ComponentProps } from 'react'
import { Pagination } from '../Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['dev'],
  argTypes: {
    currentPage: { control: 'number' },
    totalCount: { control: 'number' },
    pageSize: { control: 'number' },
    siblingCount: { control: 'number' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

const PaginationWithState = (args: ComponentProps<typeof Pagination>) => {
  const [page, setPage] = useState(1)
  return (
    <Pagination
      {...args}
      currentPage={page}
      onPageChange={newPage => setPage(newPage)}
    />
  )
}

export const Default: Story = {
  render: args => <PaginationWithState {...args} />,
  args: {
    totalCount: 100,
    pageSize: 10,
    siblingCount: 1,
  },
}

export const ManyPages: Story = {
  render: args => <PaginationWithState {...args} />,
  args: {
    totalCount: 500,
    pageSize: 10,
    siblingCount: 1,
  },
}

export const FewPages: Story = {
  render: args => <PaginationWithState {...args} />,
  args: {
    totalCount: 25,
    pageSize: 10,
  },
}

export const CustomSiblings: Story = {
  render: args => <PaginationWithState {...args} />,
  args: {
    totalCount: 100,
    pageSize: 10,
    siblingCount: 2,
  },
}

export const Disabled: Story = {
  render: args => <PaginationWithState {...args} />,
  args: {
    totalCount: 100,
    pageSize: 10,
    currentPage: 5,
    disabled: true,
  },
}
