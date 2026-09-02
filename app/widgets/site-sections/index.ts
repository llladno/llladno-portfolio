import type { SectionRegistry } from '~/shared/config/navigation'
import { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
import { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
import { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
import { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

export { AboutSection } from '~/widgets/site-sections/ui/AboutSection'
export { ExperienceSection } from '~/widgets/site-sections/ui/ExperienceSection'
export { ProjectsSection } from '~/widgets/site-sections/ui/ProjectsSection'
export { ContactSection } from '~/widgets/site-sections/ui/ContactSection'

/** Section id → the component rendered inline and inside its deck window. */
export const SECTION_REGISTRY: SectionRegistry = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  contact: ContactSection,
}
