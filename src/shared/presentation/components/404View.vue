<script setup>
    import { computed } from 'vue';
    import { useRoute, RouterLink } from 'vue-router';
    import { AppRouteName } from '@/app/routing/AppRouteName';

    const props = defineProps(['error']);
    const route = useRoute();
    const message = computed(() => props.error?.error ?? 'Unknown error.');
</script>

<template>
    <section class="container mx-auto px-4" aria-labelledby="error-title">
        <header>
            <h1 id="error-title" class="text-6xl font-bold text-[#ee6052] text-center mt-12">Something went wrong.</h1>
        </header>

        <div class="flex flex-wrap mt-8 justify-center items-center">
            <figure class="w-1/2 flex justify-center items-center">
                <img src="/404.png" alt="sad pokemon" class="w-35 md:w-48 lg:w-60"/>
                <figcaption class="sr-only">Error illustration</figcaption>
            </figure>

            <div class="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
                <p id="error" class="text-[10rem] sm:text-[12rem] xs:text-[11rem] text-center text-[#ee6052]">404</p>
                <p class="text-xl mt-4 mb-8 text-center font-bold text-[var(--color-secondary)]">Ops! Page not found. {{ message }}</p>
                <RouterLink :to="{ name: AppRouteName.Home }"
                    class="bg-[var(--color-primary)] text-[var(--color-secondary)] px-6 py-3 rounded-lg hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition border border-2 border-[var(--color-secondary)]"
                    aria-label="Go to Home">
                    Go to Home
                </RouterLink>
            </div>
        </div>
    </section>
</template>