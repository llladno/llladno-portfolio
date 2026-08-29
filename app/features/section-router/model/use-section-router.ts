import { isSectionId, type SectionId } from '~/shared/config/navigation'

const HASH_SEPARATOR = '/'

interface OpenTarget {
  section: SectionId
  projectSlug?: string
}

const parseHash = (hash: string): OpenTarget | null => {
  const withoutLeadingHash = hash.replace(/^#/, '')
  if (!withoutLeadingHash) return null

  const [section, projectSlug] = withoutLeadingHash.split(HASH_SEPARATOR)
  if (!section || !isSectionId(section)) return null

  return { section, projectSlug }
}

const buildHash = (section: SectionId, projectSlug?: string): string =>
  projectSlug ? `#${section}${HASH_SEPARATOR}${projectSlug}` : `#${section}`

/**
 * The single owner of "which section / project is open".
 *
 * Inputs: the URL hash, plus `open()` / `close()` from the Dock, menu bar and
 * project cards. Output: `activeSection` / `activeProjectSlug` refs consumed by
 * the window host (desktop) and the section anchors (plain).
 *
 * Hash format: `#about`, `#projects`, `#projects/<slug>`.
 */
export const useSectionRouter = () => {
  const route = useRoute()
  const router = useRouter()

  const activeSection = ref<SectionId | null>(null)
  const activeProjectSlug = ref<string | null>(null)

  const syncFromHash = () => {
    const target = parseHash(route.hash)
    activeSection.value = target?.section ?? null
    activeProjectSlug.value = target?.projectSlug ?? null
  }

  const open = (section: SectionId, projectSlug?: string) => {
    router.replace({ path: route.path, hash: buildHash(section, projectSlug) })
  }

  const close = () => {
    router.replace({ path: route.path, hash: '' })
  }

  watch(() => route.hash, syncFromHash, { immediate: true })

  return { activeSection, activeProjectSlug, open, close }
}
