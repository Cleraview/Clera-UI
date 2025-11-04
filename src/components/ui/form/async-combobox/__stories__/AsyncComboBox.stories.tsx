import Image from 'next/image'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { AsyncComboBox, AsyncComboBoxOption } from '..'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FiMapPin,
  FiTrendingUp,
  FiShoppingBag,
  FiChevronsLeft,
  FiChevronsRight,
  FiDatabase,
} from 'react-icons/fi'
import { ReactNode } from 'react'

const allProducts = [
  // Electronics
  {
    value: 'prod-01',
    label: 'Laptop Pro 16"',
    type: 'product',
    category: 'Electronics',
    price: '2399.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Laptop',
  },
  {
    value: 'prod-02',
    label: 'Smartphone X',
    type: 'product',
    category: 'Electronics',
    price: '999.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Phone',
  },
  {
    value: 'prod-03',
    label: 'Wireless Earbuds',
    type: 'product',
    category: 'Electronics',
    price: '199.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Buds',
  },
  {
    value: 'prod-04',
    label: '4K Monitor 27"',
    type: 'product',
    category: 'Electronics',
    price: '450.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Monitor',
  },
  {
    value: 'prod-05',
    label: 'Smart Watch Series 8',
    type: 'product',
    category: 'Electronics',
    price: '399.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Watch',
  },
  // Apparel
  {
    value: 'prod-06',
    label: 'Classic T-Shirt',
    type: 'product',
    category: 'Apparel',
    price: '25.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=T-Shirt',
  },
  {
    value: 'prod-07',
    label: 'Running Shoes',
    type: 'product',
    category: 'Apparel',
    price: '120.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Shoes',
  },
  {
    value: 'prod-08',
    label: 'Denim Jeans',
    type: 'product',
    category: 'Apparel',
    price: '60.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Jeans',
  },
  {
    value: 'prod-09',
    label: 'Winter Jacket',
    type: 'product',
    category: 'Apparel',
    price: '150.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Jacket',
  },
  {
    value: 'prod-10',
    label: 'Leather Wallet',
    type: 'product',
    category: 'Apparel',
    price: '45.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Wallet',
  },
  // Home & Kitchen
  {
    value: 'prod-11',
    label: 'Coffee Maker',
    type: 'product',
    category: 'Home',
    price: '89.00',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Coffee',
  },
  {
    value: 'prod-12',
    label: 'Robot Vacuum',
    type: 'product',
    category: 'Home',
    price: '299.00',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Vacuum',
  },
  {
    value: 'prod-13',
    label: 'Bookshelf',
    type: 'product',
    category: 'Home',
    price: '75.00',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Shelf',
  },
  {
    value: 'prod-14',
    label: 'Desk Chair',
    type: 'product',
    category: 'Home',
    price: '180.00',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Chair',
  },
  {
    value: 'prod-15',
    label: 'Air Fryer',
    type: 'product',
    category: 'Home',
    price: '99.00',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Fryer',
  },
  // Groceries
  {
    value: 'prod-16',
    label: 'Organic Avocados',
    type: 'product',
    category: 'Groceries',
    price: '4.99',
    img: 'https://placehold.co/80x80/e76f51/ffffff?text=Avocado',
  },
  {
    value: 'prod-17',
    label: 'Almond Milk',
    type: 'product',
    category: 'Groceries',
    price: '3.50',
    img: 'https://placehold.co/80x80/e76f51/ffffff?text=Milk',
  },
  {
    value: 'prod-18',
    label: 'Whole Wheat Bread',
    type: 'product',
    category: 'Groceries',
    price: '2.99',
    img: 'https://placehold.co/80x80/e76f51/ffffff?text=Bread',
  },
  {
    value: 'prod-19',
    label: 'Free-Range Eggs',
    type: 'product',
    category: 'Groceries',
    price: '5.99',
    img: 'https://placehold.co/80x80/e76f51/ffffff?text=Eggs',
  },
  {
    value: 'prod-20',
    label: 'Quinoa',
    type: 'product',
    category: 'Groceries',
    price: '7.99',
    img: 'https://placehold.co/80x80/e76f51/ffffff?text=Quinoa',
  },
  // More Electronics
  {
    value: 'prod-21',
    label: 'Sony WH-1000XM5',
    type: 'product',
    category: 'Electronics',
    price: '398.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Sony',
  },
  {
    value: 'prod-22',
    label: 'Apple iPad Air',
    type: 'product',
    category: 'Electronics',
    price: '599.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=iPad',
  },
  {
    value: 'prod-23',
    label: 'Dell XPS 15',
    type: 'product',
    category: 'Electronics',
    price: '1899.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=XPS',
  },
  {
    value: 'prod-24',
    label: 'GoPro HERO11',
    type: 'product',
    category: 'Electronics',
    price: '349.00',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=GoPro',
  },
  {
    value: 'prod-25',
    label: 'Kindle Paperwhite',
    type: 'product',
    category: 'Electronics',
    price: '139.00',
    img: 'https_//placehold.co/80x80/2a9d8f/ffffff?text=Kindle',
  },
  // More Apparel
  {
    value: 'prod-26',
    label: 'Leather Belt',
    type: 'product',
    category: 'Apparel',
    price: '35.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Belt',
  },
  {
    value: 'prod-27',
    label: 'Silk Scarf',
    type: 'product',
    category: 'Apparel',
    price: '42.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Scarf',
  },
  {
    value: 'prod-28',
    label: 'Wool Socks',
    type: 'product',
    category: 'Apparel',
    price: '15.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Socks',
  },
  {
    value: 'prod-29',
    label: 'Beanie Hat',
    type: 'product',
    category: 'Apparel',
    price: '20.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Hat',
  },
  {
    value: 'prod-30',
    label: 'Sunglasses',
    type: 'product',
    category: 'Apparel',
    price: '80.00',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Glasses',
  },
]

const popularText = [
  { value: 'pop-txt-01', label: 'iPhone 15 Pro', type: 'text' },
  { value: 'pop-txt-02', label: 'Gift Cards', type: 'text' },
  { value: 'pop-txt-03', label: 'Prime Day Deals', type: 'text' },
  { value: 'pop-txt-04', label: 'Air Fryer', type: 'text' },
  { value: 'pop-txt-05', label: 'Lego Sets', type: 'text' },
]
const popularImage = [
  {
    value: 'pop-img-01',
    label: 'Sony WH-1000XM5',
    type: 'image',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Sony',
  },
  {
    value: 'pop-img-02',
    label: 'Apple Watch',
    type: 'image',
    img: 'https://placehold.co/80x80/2a9d8f/ffffff?text=Watch',
  },
  {
    value: 'pop-img-03',
    label: 'Running Shoes',
    type: 'image',
    img: 'https://placehold.co/80x80/e9c46a/ffffff?text=Shoes',
  },
  {
    value: 'pop-img-04',
    label: 'Robot Vacuum',
    type: 'image',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Vacuum',
  },
  {
    value: 'pop-img-05',
    label: 'Coffee Maker',
    type: 'image',
    img: 'https://placehold.co/80x80/f4a261/ffffff?text=Coffee',
  },
]
const trends = [
  { value: 'trend-01', label: 'Smart Watches', type: 'trend' },
  { value: 'trend-02', label: 'Wireless Earbuds', type: 'trend' },
  { value: 'trend-03', label: 'Standing Desks', type: 'trend' },
  { value: 'trend-04', label: 'Organic Groceries', type: 'trend' },
  { value: 'trend-05', label: 'Travel Backpacks', type: 'trend' },
]
const categorySliderItem = {
  value: 'cat-slider-01',
  label: 'Shop by Category',
  type: 'slider',
  categories: [
    {
      title: 'Electronics',
      img: 'https://placehold.co/100x80/2a9d8f/ffffff?text=Electronics',
    },
    {
      title: 'Apparel',
      img: 'https://placehold.co/100x80/e9c46a/ffffff?text=Apparel',
    },
    {
      title: 'Home',
      img: 'https://placehold.co/100x80/f4a261/ffffff?text=Home',
    },
    {
      title: 'Groceries',
      img: 'https://placehold.co/100x80/e76f51/ffffff?text=Groceries',
    },
    {
      title: 'Books',
      img: 'https://placehold.co/100x80/83c5be/ffffff?text=Books',
    },
  ],
}

const destinations = [
  { value: 'par', label: 'Paris, France', region: 'Europe' },
  { value: 'tok', label: 'Tokyo, Japan', region: 'Asia' },
  { value: 'nyc', label: 'New York, USA', region: 'North America' },
]

const flights = [
  {
    value: 'sq308',
    label: 'SQ308 - Singapore',
    airline: 'Singapore Airlines',
    img: 'https://placehold.co/20x20/FF5733/FFFFFF?text=SQ',
  },
  {
    value: 'ek211',
    label: 'EK211 - Dubai',
    airline: 'Emirates',
    img: 'https://placehold.co/20x20/33FF57/FFFFFF?text=EK',
  },
]

type FakeDataItem = {
  value: string
  label: string
} & Record<string, unknown>

const fakeApi = (
  search: string,
  data: FakeDataItem[]
): Promise<Record<string, AsyncComboBoxOption[]>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = data.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
      resolve({ Products: results.slice(0, 10) })
    }, 500)
  })
}

const fakeDefaultApi = (): Promise<Record<string, AsyncComboBoxOption[]>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        'Popular Products': [...popularText, ...popularImage],
        'Trending Searches': trends,
        'Shop by Category': [categorySliderItem],
      })
    }, 500)
  })
}

const meta: Meta<typeof AsyncComboBox> = {
  title: 'UI/Form/AsyncComboBox',
  component: AsyncComboBox,
  tags: ['dev'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
    loadOptions: { control: false },
    loadDefaultOptions: { control: false },
    renderItem: { control: false },
    notFoundContent: { control: false },
    debounceMs: {
      control: 'number',
      description: 'The debounce time in milliseconds for the async search.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '300' },
      },
    },
  },
  args: {
    label: 'Search',
    placeholder: 'Search for anything...',
    disabled: false,
    hasError: false,
    debounceMs: 300,
  },
}

export default meta
type Story = StoryObj<typeof AsyncComboBox>

const ImageSlider = ({
  categories,
}: {
  categories: { title: string; img: string }[]
}) => {
  const [index, setIndex] = useState(0)
  const total = categories.length

  const next = () => setIndex(i => (i + 1) % total)
  const prev = () => setIndex(i => (i - 1 + total) % total)

  return (
    <div className="p-space-sm w-full">
      <div className="relative w-full h-24 overflow-hidden rounded-md">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {categories.map(cat => (
            <Image
              key={cat.title}
              src={cat.img}
              alt={cat.title}
              width={80}
              height={80}
              className="w-full h-full object-cover shrink-0"
            />
          ))}
        </div>
        <button
          onClick={e => {
            e.stopPropagation()
            prev()
          }}
          className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            next()
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 text-center">
        <p className="text-body-sm font-semibold">{categories[index].title}</p>
        <p className="text-body-xs text-subtle">
          Shop all {categories[index].title}
        </p>
      </div>
    </div>
  )
}

export const ECommerceSearch: Story = {
  args: {
    label: 'Search products',
    placeholder: 'Search for electronics, apparel, groceries...',
    loadOptions: search => fakeApi(search, allProducts),
    loadDefaultOptions: fakeDefaultApi,
    renderItem: option => {
      switch (option.type) {
        case 'text':
          return (
            <div className="flex items-center gap-3 p-space-sm">
              <FiShoppingBag className="w-4 h-4 text-subtle shrink-0" />
              <span className="text-body-sm font-semibold">{option.label}</span>
            </div>
          )
        case 'image':
          return (
            <div className="flex items-center gap-3 p-space-sm">
              <Image
                src={option.img as string}
                alt={option.label as string}
                width={80}
                height={80}
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="text-body-sm font-semibold">{option.label}</span>
            </div>
          )
        case 'trend':
          return (
            <div className="flex items-center gap-3 p-space-sm">
              <FiTrendingUp className="w-4 h-4 text-subtle shrink-0" />
              <span className="text-body-sm font-semibold">{option.label}</span>
            </div>
          )
        case 'slider':
          return (
            <ImageSlider
              categories={option.categories as { title: string; img: string }[]}
            />
          )
        case 'product':
          return (
            <div className="flex items-center gap-3 p-space-sm">
              <Image
                className="w-10 h-10 rounded-md object-cover"
                src={option.img as string}
                alt={option.label as string}
                width={80}
                height={80}
              />
              <div className="flex flex-col w-full truncate">
                <span className="text-body-sm font-semibold truncate">
                  {option.label}
                </span>
                <div className="flex justify-between w-full">
                  <span className="text-body-xs text-subtle">
                    {option.category as ReactNode}
                  </span>
                  <span className="text-body-sm font-bold text-accent-green-intense">
                    ${option.price as ReactNode}
                  </span>
                </div>
              </div>
            </div>
          )
        default:
          return <div className="p-space-sm">{option.label}</div>
      }
    },
  },
  render: args => {
    const [value, setValue] = useState('')
    return <AsyncComboBox {...args} value={value} onChange={setValue} />
  },
}

export const CustomNotFound: Story = {
  args: {
    label: 'Search Destination',
    placeholder: 'e.g., Paris, Tokyo...',
    loadOptions: async search => ({
      Destinations: (await fakeApi(search, destinations))['Products'],
    }),
    renderItem: option => (
      <div className="flex items-center gap-3 p-space-sm">
        <FiMapPin className="w-4 h-4 text-subtle shrink-0" />
        <div className="flex flex-col">
          <span className="text-body-sm font-semibold">{option.label}</span>
          <span className="text-body-xs text-subtle">
            {option.region as ReactNode}
          </span>
        </div>
      </div>
    ),
    notFoundContent: (
      <div className="flex flex-col items-center justify-center p-space-lg text-subtle gap-2">
        <FiDatabase className="w-8 h-8" />
        <span className="text-body-sm font-semibold">No Data</span>
        <p className="text-body-xs text-center">
          We couldn&apos;t find any destinations matching your search.
        </p>
      </div>
    ),
  },
  render: args => {
    const [value, setValue] = useState('')
    return <AsyncComboBox {...args} value={value} onChange={setValue} />
  },
}

export const CustomLoadingSkeletons: Story = {
  args: {
    label: 'Search Flight',
    placeholder: 'e.g., SQ308...',
    loadOptions: async search => ({
      Flights: (await fakeApi(search, flights))['Products'],
    }),
    renderItem: option => (
      <div className="flex items-center gap-3 p-space-sm">
        <Image
          className="w-6 h-6 rounded-full"
          src={option.img as string}
          alt={option.airline as string}
          width={80}
          height={80}
        />
        <div className="flex flex-col">
          <span className="text-body-sm font-semibold">{option.label}</span>
          <span className="text-body-xs text-subtle">
            {option.airline as ReactNode}
          </span>
        </div>
      </div>
    ),
    loading: count =>
      Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center space-x-3 p-space-sm">
          <Skeleton rounded="full" className="h-6 w-6" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      )),
    loadingItemCount: 4,
  },
  render: args => {
    const [value, setValue] = useState('')
    return <AsyncComboBox {...args} value={value} onChange={setValue} />
  },
}
