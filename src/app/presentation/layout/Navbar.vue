<script setup>

</script>

<template>
    <nav id="main-nav"
        class="table mx-auto rounded-[1rem] bg-[#FFF] mt-4 [box-shadow:0_0_15px_0_rgba(0,0,0,0.2)]"
        aria-label="Navigazione generazioni Pokémon">
        <ul v-if="!genController.isLoading.value" class="flex flex-wrap">
            <li v-for="(gen, x) in genController.data.value.generation" :key="gen.version">
                <RouterLink :to="gen.href" :aria-label="gen.label" translate="no"
                    class="relative inline-block align-middle text-[var(--color-dark)] text-[1rem] md:text-[2rem] p-3 font-bold overflow-hidden transition-all navigation-link"
                    :class="{ active: ($route.name === AppRouteName.Generation && gen.version == route.params.id), 'rounded-l-[1rem]': x === 0, 'rounded-r-[1rem]': x === genController.data.value.generation.length - 1 }"
                    :aria-current="($route.name === AppRouteName.Generation && gen.version == route.params.id) ? 'page' : undefined">
                    {{ gen.displayVersion }}
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>