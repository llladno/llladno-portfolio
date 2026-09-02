<script setup lang="ts">
/*
 * The social links (GitHub / LinkedIn / Telegram) as brand-icon buttons. Used
 * as the footer of the mobile / plain layout, where there is no Dock.
 */
import { BRAND_ICON_PATHS } from '~/shared/config/brand-icons'

interface SocialLink {
  id: string
  label: string
  href: string
}

const appConfig = useAppConfig()
const { t } = useI18n()

const socials = computed(() => (appConfig.socials as SocialLink[]) ?? [])
</script>

<template>
  <nav :aria-label="t('a11y.socials')" class="flex items-center justify-center gap-3">
    <a
      v-for="social in socials"
      :key="social.id"
      :href="social.href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="social.label"
      class="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        class="size-5"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
        aria-hidden="true"
      >
        <path
          v-for="(pathData, index) in BRAND_ICON_PATHS[social.id]"
          :key="index"
          :d="pathData"
        />
      </svg>
    </a>
  </nav>
</template>
