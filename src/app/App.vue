<script setup>
import { onMounted } from "vue";
import { RouterView } from 'vue-router';

import ScrollToTop from '@/shared/presentation/components/ScrollToTop.vue';
import LegalNoticeBanner from '@/shared/presentation/components/LegalNoticeBanner.vue';

onMounted(async () => {
  
});
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
    <LegalNoticeBanner />
</template>