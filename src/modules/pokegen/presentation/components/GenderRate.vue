<script setup>
import { computed } from 'vue';

const props = defineProps(['genderRate']);
const genderRate = computed(() => props.genderRate);
</script>

<template>
    <section id="gender" aria-label="Gender rate">
        <h3 class="text-2xl font-bold">Gender rate</h3>
        <span class="font-bold text-lg" v-if="!genderRate">Unknown</span>
        <dl class="flex items-center justify-center gap-4 mt-3" v-else>
            <div v-if="genderRate.male > 0" class="flex flex-col items-center">
                <img src="/icons/genders/male.svg" class="size-16 rounded-full bg-amber-50/75 p-1" alt="Male" />
                <dt class="sr-only">Male</dt>
                <dd class="font-semibold">{{ genderRate.male }}%</dd>
            </div>
            <div v-if="genderRate.female > 0" class="flex flex-col items-center">
                <img src="/icons/genders/female.svg" class="size-16 rounded-full bg-amber-50/75 p-1" alt="Female" />
                <dt class="sr-only">Female</dt>
                <dd class="font-semibold">{{ genderRate.female }}%</dd>
            </div>
        </dl>
    </section>
</template>