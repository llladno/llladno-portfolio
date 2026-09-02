/**
 * Shared open/closed state for the résumé preview modal. `useState`-backed so
 * the Dock (and later the menu bar) can trigger the same modal, which is
 * mounted once in <DesktopShell>.
 */
export const useResumeModal = () => {
  const isOpen = useState('resume:open', () => false)
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  return { isOpen, open, close }
}
