import type { SectionRegistry } from '~/shared/config/navigation'
import { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
import { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
import { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
import { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

export { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
export { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
export { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
export { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

/** Section id → the component rendered both inline and inside its window. */
export const SECTION_REGISTRY: SectionRegistry = {
  about: AboutSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  contact: ContactSection,
}
