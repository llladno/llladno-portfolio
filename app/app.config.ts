import type { DockItemConfig } from '~/shared/config/navigation'

interface SocialLink {
  id: string
  label: string
  href: string
}

interface Identity {
  name: string
  role: { ru: string; en: string }
  email: string
}

/**
 * Runtime-editable config: identity, social links, and the Dock layout.
 * Dock items of kind `section` open a window / scroll to that section;
 * `link` is an external anchor; `file` points at a public asset.
 */
export default defineAppConfig({
  identity: {
    name: 'Your Name',
    role: { ru: 'Разработчик', en: 'Developer' },
    email: 'you@example.com',
  } satisfies Identity,

  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/' },
  ] satisfies SocialLink[],

  dock: [
    { id: 'about', kind: 'section', icon: 'about' },
    { id: 'projects', kind: 'section', icon: 'projects' },
    { id: 'experience', kind: 'section', icon: 'experience' },
    { id: 'contact', kind: 'section', icon: 'contact' },
    { id: 'github', kind: 'link', icon: 'github', href: 'https://github.com/' },
    { id: 'resume', kind: 'file', icon: 'resume', href: '/resume/en.pdf' },
  ] satisfies DockItemConfig[],
})
