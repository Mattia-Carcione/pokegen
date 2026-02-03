<script setup>
defineProps({
    title: String,
    rows: { type: Array, default: () => [] },
    extraLabel: String,
    extraValue: Function,
    buildTypeBadge: Function,
    formatCategory: Function,
});
</script>

<template>
    <article class="p-4 border border-[var(--bg-custom)] rounded-xl overflow-x-auto">
        <h3 class="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]/80">
            {{ title }}
        </h3>

        <hr class="mt-1 border-[var(--bg-custom)]" />

        <div v-if="rows.length" class="mt-3 overflow-x-auto">
            <table class="w-full lg:w-1/2 mx-auto text-sm table-auto">
                <thead class="text-left text-[var(--text-primary)]">
                    <tr>
                        <th class="p-2">Move</th>
                        <th class="p-2">Type</th>
                        <th class="p-2">Category</th>
                        <th class="p-2">Power</th>
                        <th class="p-2">Accuracy</th>
                        <th class="p-2">PP</th>
                        <th class="p-2">{{ extraLabel }}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="move in rows" :key="move.slug" class="border-t border-[var(--bg-custom)]">
                        <td class="p-2 font-medium">{{ move.name }}</td>

                        <td class="font-medium text-center">
                            <template v-if="move.detail">
                                <span
                                    class="inline-flex items-center gap-2 px-2 py-1 text-xs font-bold text-[var(--text-primary)]/80 w-full bg-[var(--bg-custom)]/75 rounded-full capitalize" >
                                    <img v-if="buildTypeBadge(move.detail.type).icon"
                                        :src="buildTypeBadge(move.detail.type).icon" class="h-4 w-4 bg-white rounded-full"
                                        :alt="buildTypeBadge(move.detail.type).label" />
                                    {{ buildTypeBadge(move.detail.type).label }}
                                </span>
                            </template>
                            <span v-else>-</span>
                        </td>

                        <td class="p-2 font-medium">
                            <span class="inline-block px-2 py-1 text-xs font-semibold text-white w-full text-center capitalize" :class="{
                                'bg-[#6D5ACF]': move.detail?.damageClass === 'special',
                                'bg-[#F95587]': move.detail?.damageClass === 'physical',
                                'bg-[#A8A878]': move.detail?.damageClass === 'status'
                            }">
                                {{ move.detail?.damageClass ? move.detail.damageClass : '-' }}
                            </span>
                        </td>
                        <td class="p-2 font-medium">{{ move.detail?.power ?? '-' }}</td>
                        <td class="p-2 font-medium">{{ move.detail?.accuracy ?? '-' }}</td>
                        <td class="p-2 font-medium">{{ move.detail?.pp ?? '-' }}</td>
                        <td class="p-2 font-medium">{{ extraValue(move) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="mt-3 text-sm text-[var(--text-primary)]/60">
            No moves available.
        </p>
    </article>
</template>