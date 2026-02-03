<script setup>
import { computed } from 'vue';

import Sprite from './Sprite.vue';

const props = defineProps(['next', 'prev']);
const next = computed(() => props.next);
const prev = computed(() => props.prev);
</script>

<template>
    <div class="flex w-full justify-between">
        <section id="previous" aria-label="Previous Pokémon">
            <template v-if="prev">
                <RouterLink :to="prev.href" :aria-label="`Vai al Pokémon ${prev.name}`" class="flex flex-col items-center justify-center">
                    <Sprite :pokemon="prev" />
                    <span class="underline flex items-center mt-1 rounded-full bg-[var(--bg-custom)]/50 p-1 font-bold">
                        <img class="origin-center rotate-90 h-7 w-7" src="/icons/arrowDown.svg" alt="Arrow left icon" />
                        #{{ prev.pokedexNumber }} <span class="hidden lg:block capitalize" translate="no">- {{ prev.name
                        }}</span>
                    </span>
                </RouterLink>
            </template>
        </section>
        <section id="next" aria-label="Next Pokémon">
            <template v-if="next">
                <RouterLink :to="next.href" :aria-label="`Vai al Pokémon ${next.name}`" class="flex flex-col items-center justify-center">
                    <Sprite :pokemon="next" />
                    <span class="underline flex items-center mt-1 rounded-full bg-[var(--bg-custom)]/50 p-1 font-bold">
                        #{{ next.pokedexNumber }} <span class="hidden lg:block capitalize" translate="no">- {{ next.name }}</span>
                        <img class="origin-center rotate-270 h-7 w-7" src="/icons/arrowDown.svg" alt="Arrow right icon" />
                    </span>
                </RouterLink>
            </template>
        </section>
    </div>
</template>