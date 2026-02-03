<script setup>
import { computed } from 'vue';

import AbilitiesInfo from './AbilitiesInfo.vue';
import GenderRate from './GenderRate.vue';
import PokemonSize from './PokemonSize.vue';

const props = defineProps(['pokemon']);
const pokemon = computed(() => props.pokemon);
</script>
 
<template>
    <!-- Base Info -->
    <section id="base-info" class="bg-[var(--bg-custom)]/50 rounded-xl p-3 flex flex-col items-center text-center">
        <header class="p-1">
            <p class="text-lg font-semibold" translate="no">{{ pokemon.genus }}</p>
        </header>
        <div id="pokemon-generation" class="my-2">
            <RouterLink :to="pokemon.generation.href" :aria-label="pokemon.generation.href.name" translate="no">
                <span class="font-bold text-2xl capitalize underline">
                    {{ pokemon.generation.name }}
                </span>
            </RouterLink>
        </div>
        <AbilitiesInfo :abilities="pokemon.abilities" />
        <PokemonSize :height="pokemon.height" :weight="pokemon.weight" :captureRate="pokemon.captureRate" />
        <GenderRate :genderRate="pokemon.genderRate" />
    </section>
</template>
