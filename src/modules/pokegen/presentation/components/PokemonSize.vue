<script setup>
import { computed } from 'vue';

const props = defineProps(['height', 'weight', 'captureRate']);
const height = computed(() => props.height);
const weight = computed(() => props.weight);
const captureRate = computed(() => props.captureRate);
</script>

<template>
    <table id="pokemon-size" class="w-full rounded-xl my-5 bg-[var(--bg-custom)]/75 p-3" aria-label="Pokémon size information">
        <caption class="sr-only">Pokémon size information</caption>
        <thead>
            <tr>
                <th class="p-1" scope="col">Height</th>
                <th class="p-1" scope="col">Weight</th>
                <th class="p-1" scope="col">Capture Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="p-1 font-semibold">{{ height }}m</td>
                <td class="p-1 font-semibold">{{ weight }}Kg</td>
                <td class="p-1 font-semibold">{{ captureRate }}%</td>
            </tr>
        </tbody>
    </table>
</template>