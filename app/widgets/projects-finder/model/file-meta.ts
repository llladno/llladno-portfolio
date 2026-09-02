import { FINDER_MEDIA_BASE_PATH } from '~/widgets/projects-finder/model/constants'
import type { LocalizedProject } from '~/entities/project'

/** The "filename" a project's Finder tile shows. */
export const projectFileName = (project: LocalizedProject): string => {
  const { media, slug } = project
  if (!media) return `${slug}.webloc`
  if (media.kind === 'video') return `${slug}.mp4`
  if (media.kind === 'doc') return `${slug}.md`
  return media.src.split('/').pop() ?? `${slug}.jpg`
}

/** The dimensions sub-label under a tile, e.g. "1280 × 800" — "—" when unknown. */
export const projectFileDimensions = (project: LocalizedProject): string => {
  const { media } = project
  if (media && 'width' in media) return `${media.width} × ${media.height}`
  return '—'
}

export const projectPosterSrc = (slug: string): string =>
  `${FINDER_MEDIA_BASE_PATH}/${slug}.jpg`

export const projectVideoSrc = (slug: string, extension: 'mp4' | 'webm'): string =>
  `${FINDER_MEDIA_BASE_PATH}/${slug}.${extension}`
