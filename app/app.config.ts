import type { DockItemConfig } from '~/shared/config/navigation'

interface SocialLink {
  id: string
  label: string
  href: string
}

interface Identity {
  name: { ru: string; en: string }
  role: { ru: string; en: string }
  email: string
}

/**
 * Runtime-editable config: identity, social links, and the Dock layout.
 * Dock items are external links / files now — section navigation lives on the
 * desktop (folders) and in the scroll deck.
 */
export default defineAppConfig({
  identity: {
    name: { ru: 'Григорий Мансуров', en: 'Grigory Mansurov' },
    role: { ru: 'Frontend-разработчик', en: 'Frontend Developer' },
    email: 'man30968@gmail.com',
  } satisfies Identity,

  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/llladno' },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/grigoriy-mansurov',
    },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/llladnooo' },
  ] satisfies SocialLink[],

  dock: [
    { id: 'github', kind: 'link', icon: 'github', href: 'https://github.com/llladno' },
    {
      id: 'linkedin',
      kind: 'link',
      icon: 'linkedin',
      href: 'https://linkedin.com/in/grigoriy-mansurov',
    },
    { id: 'telegram', kind: 'link', icon: 'telegram', href: 'https://t.me/llladnooo' },
    { id: 'resume', kind: 'file', icon: 'resume', href: '/resume/en.pdf' },
  ] satisfies DockItemConfig[],
})
