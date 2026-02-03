<script setup>
import { computed } from 'vue';
import { RouterLink } from "vue-router";

import Sprite from "./Sprite.vue";

const props = defineProps(['varieties']);
const varieties = computed(() => props.varieties ?? []);
const style = 'w-25 h-25 lg:w-[150px] lg:h-[150px]';
</script>

<template>
    <section id="variants" class="mt-5 bg-[var(--bg-custom)]/50 p-5 rounded-xl">
        <h2 class="font-bold text-xl mb-3">Variants</h2>
        <div class="flex flex-wrap gap-4 md:gap-8 justify-center items-center">
            <RouterLink
                v-for="variant in varieties"
                :key="variant.pokemon.name"
                :to="variant.pokemon.href"
                class="p-3 flex flex-col items-center text-center hover:scale-105 transition-transform"
                :aria-label="`View details of ${variant.pokemon.name}`"
                translate="no">
                <Sprite :pokemon="variant.pokemon" :className="style" />
                <span class="font-semibold capitalize">{{ variant.pokemon.name }}</span>
            </RouterLink>
        </div>
    </section>
</template>