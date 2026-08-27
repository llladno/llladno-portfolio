/*
 * Runtime-editable config: identity, social links, and the Dock layout.
 * Dock items of type `section` open a window/scroll to that section;
 * type `link` is an external anchor; type `file` points at a public asset.
 */
export default defineAppConfig({
  identity: {
    name: 'Your Name',
    role: { ru: 'Разработчик', en: 'Developer' },
    email: 'you@example.com',
  },

  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/' },
  ],

  dock: [
    { id: 'about', type: 'section', icon: 'about' },
    { id: 'projects', type: 'section', icon: 'projects' },
    { id: 'experience', type: 'section', icon: 'experience' },
    { id: 'contact', type: 'section', icon: 'contact' },
    { id: 'github', type: 'link', icon: 'github', href: 'https://github.com/' },
    { id: 'resume', type: 'file', icon: 'resume', href: '/resume/en.pdf' },
  ],

  sections: ['about', 'projects', 'experience', 'contact'] as const,
})
