<script setup lang="ts">
import { SectionShell } from '~/shared/ui'
import { ContactForm } from '~/features/contact-form'

defineProps<{ inWindow?: boolean }>()

const { t } = useI18n()
</script>

<template>
  <SectionShell id="contact" :title="t('sections.contact')" :in-window="inWindow">
    <ContactForm />
  </SectionShell>
</template>
