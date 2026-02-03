<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AppRouteName } from '@/app/routing/AppRouteName';
import { dismissBanner, isBannerDismissed } from '@/shared/utils/legalConsent';

const hidden = ref(isBannerDismissed());
const open = computed(() => !hidden.value);

const closeBanner = () => {
  dismissBanner();
  hidden.value = true;
};
</script>

<template>
  <div
    v-if="open"
    class="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/10"
    role="status"
    aria-live="polite"
  >
    <div class="relative flex flex-col gap-2 text-sm text-[var(--text-primary)]/85 sm:flex-row sm:items-center sm:justify-between">
      <p>
        By continuing to use this site, you agree to the
        <RouterLink class="text-blue-600 underline" :to="{ name: AppRouteName.Terms }">Terms of Service</RouterLink>
        and
        <RouterLink class="text-blue-600 underline" :to="{ name: AppRouteName.Privacy }">Privacy Policy</RouterLink>.
      </p>
      <button
        type="button"
        aria-label="Close notice"
        class="fixed top-2 right-4 self-start rounded-lg border border-gray-300 p-1 md:px-3 text-xs font-semibold sm:self-auto"
        @click="closeBanner"
      >
        &times;
      </button>
    </div>
  </div>
</template>
