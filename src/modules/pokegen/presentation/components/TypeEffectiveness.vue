<script setup>
import { computed } from 'vue';

const props = defineProps({
  effectiveness: {
    type: Object,
    default: () => ({
      defense: { weak: [], resist: [], immune: [], normal: [] },
    })
  }
});

const renderList = (list) => list && list.length > 0;

const defenseGroups = computed(() => {
  const effectiveness = props.effectiveness;
  if (!effectiveness) return [];
  return [
    { key: 'weak', title: 'Weak to', className: 'text-red-500', list: effectiveness.defense?.weak, valueClass: 'text-red-600' },
    { key: 'resist', title: 'Resistant to', className: 'text-emerald-600', list: effectiveness.defense?.resist, valueClass: 'text-emerald-600' },
    { key: 'immune', title: 'Immune to', className: 'text-slate-600', list: effectiveness.defense?.immune, valueClass: 'text-slate-600' },
    { key: 'normal', title: 'Normal', className: 'text-gray-500', list: effectiveness.defense?.normal, valueClass: 'text-gray-500' },
  ];
});
</script>

<template>
  <section class="mt-3 bg-[var(--bg-custom)]/50 rounded-xl p-3" aria-label="Type effectiveness">
    <header>
      <h2 class="font-bold text-xl p-1">Type Effectiveness</h2>
      <p class="text-sm text-gray-500 px-1">Defense multipliers</p>
    </header>

      <!-- Defense -->
      <article class="p-3 my-3 space-y-3 flex items-center justify-center" aria-label="Defense effectiveness">
        <div class="w-full md:w-1/2">
            <div class="mt-3 space-y-3">
            <template v-for="group in defenseGroups" :key="`def-${group.key}`">
                <section v-if="group && renderList(group.list)">
                <h4 :class="`font-bold text-sm ${group.className}`">{{ group.title }}</h4>
                <ul class="flex flex-wrap items-center justify-center gap-1 mt-2">
                    <li v-for="t in group.list" :key="`def-${group.key}-${t.name}`"
                    class="flex items-center gap-1 bg-white/70 rounded-full px-2 py-1">
                    <img class="w-7 h-7 rounded-full" :src="t.icon" :alt="t.label" loading="lazy" />
                    <span class="text-xs font-bold" translate="no">{{ t.label }}</span>
                    <span :class="`text-xs font-bold ${group.valueClass}`">{{ t.multiplierLabel }}</span>
                    </li>
                </ul>
                </section>
            </template>
            </div>
        </div>
      </article>
  </section>
</template>
