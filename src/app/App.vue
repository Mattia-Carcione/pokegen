<script setup>
import { onMounted } from "vue";
import { appContainer } from './di/AppContainer';
import { RouterView } from 'vue-router';
import ScrollToTop from '@/shared/presentation/components/ScrollToTop.vue';

const pokeApiController = appContainer.pokeApiController();
const pokemonTypesController = appContainer.pokemonTypesController();

onMounted(async () => {
  await Promise.all([
    pokeApiController.loadData(),
    pokemonTypesController.loadData(),
  ]);
});
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
</template>