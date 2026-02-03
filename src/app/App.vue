<script setup>
import { onMounted } from "vue";
import { appContainer } from './di/AppContainer';
import { RouterView } from 'vue-router';
import ScrollToTop from '@/shared/presentation/components/ScrollToTop.vue';
import LegalNoticeBanner from '@/shared/presentation/components/LegalNoticeBanner.vue';

const pokeApiController = appContainer.pokeApiController();
const pokemonTypesController = appContainer.pokemonTypesController();
const versionGroupsController = appContainer.versionGroupsController();

onMounted(async () => {
  await Promise.all([
    pokeApiController.loadData(),
    pokemonTypesController.loadData(),
    versionGroupsController.loadData(),
  ]);
});

</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
    <LegalNoticeBanner />
</template>