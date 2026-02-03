<script setup>
import { computed } from 'vue';

const props = defineProps(['stats']);
const stats = computed(() => props.stats ?? []);
const statColorVar = (name) => {
    return `--stat-${name.toLowerCase().replace(' ', '-')}`;
};

const maxStatValue = 255; // Valore massimo per le statistiche dei Pokémon
const totalBaseStats = computed(() => stats.value.reduce((total, stat) => total + stat.base, 0));
</script>

<template>
    <section id="stats" aria-label="base stats section" class="rounded-xl bg-[var(--bg-custom)]/50 mt-3 space-y-2 p-1">
        <header>
            <h2 class="font-bold text-xl p-3">Base Stats</h2>
        </header>
        <dl id="stats-grid" aria-label="stats grid" class="grid grid-cols-2 gap-4 justify-items-center items-center max-w-2xl mx-auto p-5 space-y-3">
            <!-- Stats -->
            <div v-for="stat in stats" :key="stat.name" class="flex flex-col items-center w-full max-w-[252px]">
                <dt class="text-sm font-bold capitalize mb-1">
                    {{ stat.name }}
                </dt>
                <dd class="relative w-full h-6 rounded-full bg-[var(--bg-custom)]/75 overflow-hidden">
                    <!-- Barra -->
                    <div class="h-6 rounded-full transition-all duration-500" :style="{
                        width: `${(stat.base / maxStatValue) * 100}%`,
                        backgroundColor: `var(${statColorVar(stat.name)})`
                    }">
                    </div>

                    <!-- Numero -->
                    <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                        {{ stat.base }}
                    </span>
                </dd>
            </div>
            <!-- Total Stats -->
            <div class="col-span-2 mt-4">
                <span class="font-bold text-lg">
                    Total Base Stats: {{ totalBaseStats }}
                </span>
            </div>
        </dl>
    </section>
</template>