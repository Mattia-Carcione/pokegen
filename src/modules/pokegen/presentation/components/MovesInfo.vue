<script setup>
import { computed } from 'vue';

import { useMovesInfo } from '@/modules/pokegen/presentation/composables/useMovesInfo';

import MovesTable from './MovesTable.vue';

const props = defineProps(['moves']);
const moves = computed(() => props.moves ?? []);

const {
  availableGenerations,
  selectedGeneration,
  generationLabel,
  levelUpMoves,
  machineMoves,
  eggAndEvoMoves,
  buildTypeBadge,
  formatCategory,
} = useMovesInfo(moves);
</script>

<template>
  <section id="pokemon-moves" aria-label="Pokemon moves" class="mt-6 rounded-xl border border-gray-200 bg-white/60 p-4">
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 class="font-bold text-xl p-1">Moves by generation</h2>

      <div v-if="availableGenerations?.length" class="flex flex-wrap gap-2">
        <button
          v-for="gen in availableGenerations"
          :key="gen"
          type="button"
          class="rounded-full border border-2 px-3 py-1 text-sm md:text-sm font-bold cursor-pointer"
          :class="gen === selectedGeneration ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white' : 'border-[var(--color-secondary)] text-[var(--text-primary)]'"
          @click="selectedGeneration = gen"
        >
          {{ generationLabel(gen) }}
        </button>
      </div>
    </header>

    <div v-if="!selectedGeneration" class="py-6 text-center text-sm text-[var(--text-primary)]/70">
      No moves available.
    </div>

    <div v-else class="mt-4 grid gap-4">
        <MovesTable title="Level-up" 
            :rows="levelUpMoves" 
            extra-label="Level" 
            :extra-value="m => `Lv ${m.level}`"
            :build-type-badge="buildTypeBadge" 
            :format-category="formatCategory" />

        <MovesTable title="TM / machine" 
            :rows="machineMoves" 
            extra-label="MT" 
            :extra-value="m => m.machine"
            :build-type-badge="buildTypeBadge" 
            :format-category="formatCategory" />

        <MovesTable title="Egg / previous evolutions" 
            :rows="eggAndEvoMoves" 
            extra-label="Method"
            :extra-value="m => m.method" 
            :build-type-badge="buildTypeBadge" 
            :format-category="formatCategory" />
    </div>
  </section>
</template>
