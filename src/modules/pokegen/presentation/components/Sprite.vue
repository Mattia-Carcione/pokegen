<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { appContainer } from '@/app/di/AppContainer';
import { useIntersectionObserver } from '@/shared/presentation/composables/UseIntersectionObserver';

import Skeleton from './Skeleton.vue';

const props = defineProps(['pokemon', 'className']);
const pokemon = computed(() => props.pokemon);
const style = computed(() => props.className ?? 'w-[50px] h-[50px] md:h-[90px] md:w-[90px]');

const controller = appContainer.blobController();
const img = ref(null);
const loaded = ref(false);
const element = ref(null);
const isVisible = ref(false);

const loadImage = async () => {
    if (!pokemon.value?.sprite || !isVisible.value) return;
    try {
        const blob = await controller.loadData(pokemon.value.sprite);
        if (img.value) URL.revokeObjectURL(img.value);
        img.value = URL.createObjectURL(blob);
    } catch (e) {
        console.error('Error loading sprite image:', e);
    }
};

useIntersectionObserver(
    element,
    async () => {
        isVisible.value = true;
        await loadImage();
    },
    { threshold: 0.1 }
);

watch(
    () => [pokemon.value?.sprite, isVisible.value],
    async ([sprite, visible]) => {
        loaded.value = false;
        if (!sprite || !visible) return;
        await loadImage();
    }
);

onBeforeUnmount(() => {
    if (img.value) {
        URL.revokeObjectURL(img.value);
    }
});

</script>

<template>
    <div ref="element" :class="`${style} flex justify-center-safe items-center bg-[var(--bg-custom)]/50 rounded-full`"
        :aria-label="`Sprite del Pokémon ${pokemon?.name}`" role="img">
        <Skeleton v-if="!loaded" :class="style" />
        <img v-if="img" :src="img" :alt="`Sprite ufficiale di ${pokemon?.name}`" :class="`${style} z-10 object-cover transition-opacity duration-300`" :style="{ opacity: loaded ? 1 : 0 }" loading="lazy" @load="loaded = true" />
    </div>
</template>
