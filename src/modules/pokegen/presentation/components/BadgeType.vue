<script setup>
import { computed } from 'vue';

import Skeleton from './Skeleton.vue';

const props = defineProps(['types']);
const types = computed(() => props.types ?? []);
</script>

<template>
    <ul class="flex gap-1" aria-label="Badge dei tipi Pokémon">
        <li v-for="type in types" :key="type.id"
            class="flex flex-col justify-center-safe items-center w-14 h-14 bg-[var(--bg-custom)] rounded-full p-1"
            :aria-label="type.name">
            <Skeleton />
            <img class="rounded-full opacity-0 transition-opacity duration-300" :src="type.icon" :alt="type.name"
                loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" />
            <span class="font-bold" translate="no">{{ type.name }}</span>
        </li>
    </ul>
</template>