import { renderSidebarItem, type SidebarItemProps } from '../components/SidebarItem'

export default {
  filters: {
    patterns: (item: { tags: string[] }) => !item.tags?.includes('hidden'),
  },
  renderLabel: (item: SidebarItemProps) => {
    const { tags, type, name, children, storiesImports } = item
    return renderSidebarItem({ tags, children, name, storiesImports, type })
  }
}