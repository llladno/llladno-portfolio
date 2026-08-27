import { useAppConfig } from '#imports'

export type SectionId = 'about' | 'projects' | 'experience' | 'contact'

interface OpenTarget {
  section: SectionId
  project?: string
}

/**
 * The single owner of "which section / project is open".
 *
 * Inputs: the URL hash, plus `open()` / `close()` calls from the Dock, menu bar
 * and project cards. Output: `activeSection` / `activeProject` refs consumed by
 * `WindowHost` (desktop) and the section anchors (plain).
 *
 * Hash format: `#about`, `#projects`, `#projects/<slug>`.
 */
export function useSectionRouter() {
  const route = useRoute()
  const router = useRouter()
  const appConfig = useAppConfig()
  const sections = appConfig.sections as readonly SectionId[]

  const activeSection = ref<SectionId | null>(null)
  const activeProject = ref<string | null>(null)

  function parseHash(hash: string): OpenTarget | null {
    const clean = hash.replace(/^#/, '')
    if (!clean) return null
    const [section, project] = clean.split('/') as [string, string | undefined]
    if (!sections.includes(section as SectionId)) return null
    return { section: section as SectionId, project }
  }

  function sync() {
    const parsed = parseHash(route.hash)
    activeSection.value = parsed?.section ?? null
    activeProject.value = parsed?.project ?? null
  }

  function open(section: SectionId, project?: string) {
    const hash = project ? `#${section}/${project}` : `#${section}`
    router.replace({ path: route.path, hash })
  }

  function close() {
    router.replace({ path: route.path, hash: '' })
  }

  watch(() => route.hash, sync, { immediate: true })

  return { activeSection, activeProject, open, close, sections }
}
