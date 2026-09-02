<script setup lang="ts">
/*
 * A centred modal that previews the résumé PDF (an <iframe>) with a prominent
 * download button. Teleported to <body>, closes on Escape / backdrop click,
 * moves focus into the panel and locks body scroll while open. Locale-aware
 * href, so the RU / EN visitor downloads the right file.
 */
import { useResumeModal } from '~/features/resume-viewer/model/use-resume-modal'
import type { Locale } from '~/shared/config/i18n'

const { isOpen, close } = useResumeModal()
const { locale, t } = useI18n()

const resumeHref = computed(() => `/resume/${locale.value as Locale}.pdf`)

const panelEl = ref<HTMLElement | null>(null)
const titleId = useId()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

watch(isOpen, (openNow) => {
  if (import.meta.server) return
  document.body.style.overflow = openNow ? 'hidden' : ''
  if (openNow) nextTick(() => panelEl.value?.focus())
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="resume-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm sm:p-8"
        @click.self="close"
        @keydown="onKeydown"
      >
        <div
          ref="panelEl"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          class="glass flex max-h-[86dvh] w-full max-w-3xl flex-col overflow-hidden rounded-window outline-none"
        >
          <header
            class="flex items-center justify-between gap-4 border-b border-line px-5 py-3"
          >
            <h2 :id="titleId" class="font-display text-base font-semibold text-fg">
              {{ t('resume.title') }}
            </h2>
            <button
              type="button"
              class="rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              :aria-label="t('resume.close')"
              @click="close"
            >
              ✕
            </button>
          </header>

          <div class="min-h-0 grow bg-surface">
            <iframe
              :src="resumeHref"
              :title="t('resume.title')"
              class="h-full min-h-[50vh] w-full border-0"
            />
          </div>

          <footer
            class="flex items-center justify-end gap-3 border-t border-line px-5 py-3"
          >
            <a
              :href="resumeHref"
              download
              class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {{ t('resume.download') }}
            </a>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.resume-modal-enter-active,
.resume-modal-leave-active {
  transition: opacity 0.2s ease;
}
.resume-modal-enter-from,
.resume-modal-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .resume-modal-enter-active,
  .resume-modal-leave-active {
    transition: none;
  }
}
</style>
