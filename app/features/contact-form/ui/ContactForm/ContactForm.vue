<script setup lang="ts">
/*
 * Contact form. Client-side POST to Web3Forms (the site stays static). A
 * hidden honeypot (`botcheck`) catches bots. The access key comes from runtime
 * config; with no key the form renders but submit is disabled.
 */
import {
  CONTACT_SUBJECT,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  WEB3FORMS_ENDPOINT,
} from '~/features/contact-form/ui/ContactForm/constants'

type Status = 'idle' | 'sending' | 'ok' | 'error'

const { t } = useI18n()
const accessKey = useRuntimeConfig().public.web3formsKey as string

const form = reactive({ name: '', email: '', message: '', botcheck: '' })
const status = ref<Status>('idle')
const hasKey = computed(() => accessKey.length > 0)

const fieldId = {
  name: useId(),
  email: useId(),
  message: useId(),
}

const submit = async () => {
  if (!hasKey.value || status.value === 'sending') return
  if (form.botcheck) return // a bot filled the honeypot
  status.value = 'sending'
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: CONTACT_SUBJECT,
        from_name: form.name,
        replyto: form.email,
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    })
    const result = (await response.json()) as { success?: boolean }
    if (response.ok && result.success) {
      status.value = 'ok'
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form id="contact-form" class="space-y-5" novalidate @submit.prevent="submit">
    <p class="text-fg/80">{{ t('contact.lead') }}</p>

    <div
      v-if="!hasKey"
      class="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted"
    >
      {{ t('contact.noKey') }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label :for="fieldId.name" class="block text-sm">
        <span class="mb-1 block font-medium text-faint">{{ t('contact.name') }}</span>
        <input
          :id="fieldId.name"
          v-model.trim="form.name"
          name="name"
          type="text"
          required
          :maxlength="NAME_MAX_LENGTH"
          class="w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
        />
      </label>
      <label :for="fieldId.email" class="block text-sm">
        <span class="mb-1 block font-medium text-faint">{{ t('contact.email') }}</span>
        <input
          :id="fieldId.email"
          v-model.trim="form.email"
          name="email"
          type="email"
          required
          :maxlength="EMAIL_MAX_LENGTH"
          class="w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
        />
      </label>
    </div>

    <label :for="fieldId.message" class="block text-sm">
      <span class="mb-1 block font-medium text-faint">{{ t('contact.message') }}</span>
      <textarea
        :id="fieldId.message"
        v-model.trim="form.message"
        name="message"
        required
        rows="5"
        :maxlength="MESSAGE_MAX_LENGTH"
        class="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus-visible:border-accent"
      />
    </label>

    <input
      v-model="form.botcheck"
      type="checkbox"
      name="botcheck"
      tabindex="-1"
      autocomplete="off"
      class="hidden"
      aria-hidden="true"
    />

    <div class="flex items-center gap-4">
      <button
        type="submit"
        :disabled="!hasKey || status === 'sending'"
        class="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ status === 'sending' ? t('contact.sending') : t('contact.send') }}
      </button>
      <p
        v-if="status === 'ok' || status === 'error'"
        role="status"
        aria-live="polite"
        class="text-sm"
        :class="status === 'ok' ? 'text-accent' : 'text-danger'"
      >
        {{ status === 'ok' ? t('contact.ok') : t('contact.error') }}
      </p>
    </div>
  </form>
</template>
