<script setup>
import CardDetailNavigation from './CardDetailNavigation.vue';
import BadgeName from './BadgeName.vue';
import BagdeType from './BadgeType.vue';
import GenderRate from './GenderRate.vue';
import PokemonSize from './PokemonSize.vue';
import FlavorTextTable from './FlavorTextTable.vue';
import Sprite from './Sprite.vue';
import StatsInfo from './StatsInfo.vue';
import EvolutionChain from './EvolutionChain.vue';
import BaseInfo from './BaseInfo.vue';
import Forms from './Forms.vue';

const { pokemon, prev, next, name } = defineProps(['pokemon', 'prev', 'next', 'name']);

const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
const colors = pokemon.types.map(t => t.color);
const [firstType, secondaryType = firstType] = colors;
</script>


<template>
    <section id="details" class="p-1 mt-3" aria-label="Pokémon details">
        <article :id="`info-pokemon-${name}`" class="pokemon-card relative shadow-xl p-1 md:p-5 rounded-xl"
            :style="{ background: `linear-gradient(90deg, ${firstType} 50%, ${secondaryType} 50%)` }"
            aria-label="Pokémon info">

            <!-- Navigation -->
            <nav id="detail-nav" aria-label="pokemon navigation" class="flex justify-between py-2">
                <CardDetailNavigation :prev="prev" :next="next" />
            </nav>

            <!-- Article -->
            <article id="pokemon-info" aria-label="Pokémon info"
                class="rounded-xl border border-amber-50/50 mt-3 md:p-5">
                <!-- Name and Types -->
                <header id="name-and-types" class="flex justify-between py-2 px-1">
                    <BadgeName :number="pokemon.pokedexNumber" :name="pokemon.name" />

                    <BagdeType :types="pokemon.types" />
                </header>

                <!-- Details -->
                <section id="main-info-grid" aria-label="main pokemon info"
                    class="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
                    <aside class="row-span-2 space-y-8 col-span-1">
                        <!-- Sprite -->
                        <figure id="sprite" class="flex items-center justify-center">
                            <Sprite :pokemon="pokemon" :className="style" />
                            <figcaption class="sr-only">{{ pokemon.name }} sprite</figcaption>
                        </figure>

                        <!-- Base Info -->
                        <BaseInfo :pokemon="pokemon" />
                    </aside>

                    <!-- Detail -->
                    <section id="main-info-content" class="md:p-5 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        <!-- Flavor Text -->
                        <FlavorTextTable :flavorText="pokemon.flavorText" />

                        <!-- Stats Info -->
                        <StatsInfo :stats="pokemon.stats" />

                        <!-- Evolution Chain -->
                        <EvolutionChain :pokemon="pokemon" />

                        <!-- Variants -->
                        <Forms v-if="pokemon.varieties?.length > 1" :varieties="pokemon.varieties" />
                    </section>
                </section>
            </article>
        </article>
    </section>
</template>
