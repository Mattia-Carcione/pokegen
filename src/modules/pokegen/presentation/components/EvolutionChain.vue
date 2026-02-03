<script setup>
import { ref } from "vue";
import Sprite from "./Sprite.vue";
import { RouterLink } from "vue-router";

const { pokemon } = defineProps(['pokemon']);
const style = 'w-25 h-25 lg:w-[150px] lg:h-[150px]';
const arrayLength = pokemon.evolution.some(
    stage =>
        (stage.evolutions?.length ?? 0) > 2 ||
        (stage.pokemons?.length ?? 0) > 2
);
</script>
<template>
    <section class="mt-3 bg-[var(--bg-custom)]/50 rounded-xl p-3" aria-label="Evolution chain">
        <header>
            <h2 class="font-bold text-xl p-1">Evolution Chain</h2>
        </header>

        <!-- container principale: colonne -->
        <div role="list" :class="`flex ${arrayLength ? 'flex-row' : 'flex-col lg:flex-row'} justify-center items-center gap-6 w-full`">
            <template v-for="(stage, i) in pokemon.evolution" :key="i">
                <!-- Colonna dello stage -->
                <article role="listitem" :class="`flex ${arrayLength ? 'flex-row' : 'flex-col lg:flex-row'} items-center gap-4 justify-evenly w-full lg:w-auto`">

                    <!-- Ciclo dei Pokémon base in questo stage -->
                    <template v-if="i === 0">
                        <RouterLink class="flex flex-col items-center justify-center mt-5 hover:scale-105 transition-transform" :to="stage.pokemons.href" :aria-label="`Vai al Pokémon ${stage.pokemons.name}`">
                            <Sprite :pokemon="{ name: stage.pokemons.name, sprite: stage.pokemons.sprite }" :className="style" />
                            <p class="capitalize font-semibold text-center mt-1">{{ stage.pokemons.name }}</p>
                            <p v-if="stage.evolutions?.length === 0" class="italic text-center text-gray-500 text-sm mt-1">This Pokémon has no Evolution.</p>
                        </RouterLink>
                    </template>

                    <!-- Evoluzioni con trigger -->
                    <div v-if="stage.evolutions?.length"
                        :class="`flex  ${arrayLength ? 'flex-col' : 'flex-row lg:flex-col'} items-center gap-6 mt-2 w-full`">
                        <template v-for="evo in stage.evolutions" :key="evo.to">
                            <div :class="`flex ${arrayLength ? 'flex-row' : 'flex-col lg:flex-row'} items-center justify-center gap-8 w-full mt-5`">

                                <!-- freccia + trigger -->
                                <div class="flex flex-col lg:flex-row items-center text-gray-600 w-full gap-2">

                                    <!-- info evoluzione (solo se presenti) -->
                                    <div class="text-xs capitalize space-y-1 text-center" translate="no">
                                        <!-- info -->
                                        <p v-for="(info, i) in evo.info" :key="i"
                                            class="text-sm font-semibold whitespace-pre-line">
                                            {{ info }}
                                        </p>

                                        <!-- item -->
                                        <template v-if="evo.item && evo.trigger">
                                            <Sprite :pokemon="{ name: evo.item, sprite: evo.itemSprite }"
                                                className="w-5 h-5 mx-auto" />
                                            <p class="text-sm font-semibold">
                                                {{ evo.trigger }} <br>
                                                {{ evo.item.replace(/-/g, ' ') }}
                                            </p>
                                        </template>

                                        <!-- held item -->
                                        <template v-if="evo.heldItem">
                                            <p class="text-sm font-semibold">
                                                with {{ evo.heldItem.replace(/-/g, ' ') }}
                                            </p>
                                            <Sprite
                                                :pokemon="{ name: evo.heldItem, sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evo.heldItem.toLowerCase()}.png` }"
                                                className="w-5 h-5 mx-auto" />
                                        </template>
                                    </div>

                                    <!-- freccia (SEMPRE PRESENTE) -->
                                    <svg :class="`w-5 h-5  ${arrayLength ? 'rotate-90' : 'rotate-180 lg:rotate-90'} shrink-0`"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 0v8" />
                                        <path d="M6 6l6-6 6 6" />
                                    </svg>

                                </div>

                                <!-- Pokémon evoluto -->
                                <div class="flex flex-col items-center justify-center hover:scale-105 transition-transform">
                                    <RouterLink :to="evo.href" :aria-label="`Vai al Pokémon ${evo.to}`">
                                        <Sprite :pokemon="{ name: evo.to, sprite: evo.sprite }" :className="style" />
                                        <p class="capitalize text-sm font-semibold mt-1 text-center">{{ evo.to }}</p>
                                    </RouterLink>
                                </div>
                            </div>
                        </template>
                    </div>
                </article>
            </template>
        </div>
    </section>
</template>