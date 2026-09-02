/** How a Dock tile renders — an external link, or a button that runs an action. */
export interface DockItemRenderProps {
  icon: string
  label: string
  /** Pointer x from the Dock, or null when the pointer is away / reduced motion. */
  pointerX: number | null
  as?: 'a' | 'button'
  href?: string
  isExternal?: boolean
}
