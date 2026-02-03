<script setup>
import { computed, ref } from 'vue';

const props = defineProps(['flavorText']);
const flavorText = computed(() => props.flavorText ?? []);
const expanded = ref(false);

const toggle = () => {
    expanded.value = !expanded.value;
};
</script>

<template>
    <section id="flavor-text-section" class="flex flex-col space-y-2 w-full mx-auto rounded-xl bg-[var(--bg-custom)]/50 p-1">

        <!-- HEADER -->
        <header class="flex items-center gap-2 p-3 select-none">
            <button
                type="button"
                class="flex items-center gap-2 w-full text-left cursor-pointer"
                @click="toggle"
                :aria-expanded="expanded"
                aria-controls="flavor-text-content"
            >
                <h2 class="font-bold text-xl flex items-center">
                    Flavor Text Entry
                </h2>

                <!-- TOGGLE -->
                <span class="inline-block transition-transform duration-200" :class="expanded ? 'rotate-0' : '-rotate-90'">
                    <img src="/icons/arrowDown.svg" class="h-10 w-10" alt="">
                </span>
            </button>
        </header>
        <!-- CICLO GENERAZIONI -->
        <div id="flavor-text-content" v-show="expanded" class="bg-amber-50/75 rounded-xl md:p-2">
            <template v-for="item in flavorText" :key="item.version">
                <!-- TABELLA -->
                <h3 class="text-center font-bold text-lg pb-3">
                    <!-- Generation {{ item.generation }} -->
                </h3>
                <table class="table-auto w-full">

                    <tbody class="space-y-[1px]">
                        <!-- CICLO VERSIONI INTERNE -->
                        <tr class="flex flex-col md:block border rounded-xl bg-amber-50">
                            <td class="p-1 md:p-5 font-bold capitalize text-center" v-if="item.version">
                                {{ item.version }}:
                            </td>
                            <td class="p-1 md:p-2 rounded-xl" v-if="item.text">
                                {{ item.text ?? "No text available" }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </section>
</template>