<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { appContainer } from '@/app/di/AppContainer';
import Skeleton from './Skeleton.vue';
import { useIntersectionObserver } from '@/shared/presentation/composables/UseIntersectionObserver';

const { pokemon, className } = defineProps(['pokemon', 'className']);
const style = className ?? 'w-[50px] h-[50px] md:h-[90px] md:w-[90px]';

const controller = appContainer.blobController();
const img = ref(null);
const loaded = ref(false);
const element = ref(null);
const loadImage = async () => {
    if (img.value || !pokemon.sprite) return;
    try {
        const blob = await controller.loadData(pokemon.sprite);
        img.value = URL.createObjectURL(blob);
    } catch (e) {
        console.error('Error loading sprite image:', e);
    }
};

useIntersectionObserver(
    element,
    async () => {
        await loadImage();
    },
    { threshold: 0.1 }
);

</script>

<template>
    <div ref="element" :class="`${style} flex justify-center-safe items-center bg-[var(--bg-custom)]/50 rounded-full`"
        :aria-label="`Sprite del Pokémon ${pokemon.name}`" role="img">
        <Skeleton v-if="!loaded" :class="style" />
        <img v-if="img" :src="img" :alt="`Sprite ufficiale di ${pokemon.name}`" :class="`${style} z-10 object-cover transition-opacity duration-300`" :style="{ opacity: loaded ? 1 : 0 }" loading="lazy" @load="loaded = true" />
    </div>
</template>
