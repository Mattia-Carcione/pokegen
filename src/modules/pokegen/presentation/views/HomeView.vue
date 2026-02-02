<script setup>
    import { useRoute } from 'vue-router';
    import { watch } from 'vue';
    
    import { appContainer } from '@/app/di/AppContainer';
    import { TypeRequestEnum } from '../enums/TypeRequestEnum';
    import { HomeViewModel } from '../viewmodels/HomeViewModel';
    import { usePokegenHomeSeo } from '@/modules/pokegen/presentation/composables/usePokegenSeo';

    import Loader from '@/shared/presentation/components/Loader.vue';
    import CustomSection from '@/shared/presentation/components/CustomSection.vue';
    import Card from '../components/Card.vue';
    import ErrorView from '@/shared/presentation/components/404View.vue';

    const route = useRoute();
    const pokemonController = appContainer.pokemonController();
    const { id } = defineProps({ id: String });
    
    usePokegenHomeSeo(route, { value: id });

    watch(() => [route.name, id, route.query.search], async ([routeName, newId, search]) => {
        if (typeof search === 'string' && search.length >= 3) {
            await pokemonController.searching({
                endpoint: search,
                req: TypeRequestEnum.SEARCH
            });
            return;
        }
        if (routeName && id) {
            await pokemonController.loadData({
                endpoint: id,
                req: TypeRequestEnum.HOME
            });
            return;
        }
    }, { immediate: true });
</script>

<template>
    <section id="home-view" aria-label="Pokémon list" class="my-3">
        <template v-if="pokemonController.isLoading.value">
            <Loader />
        </template>
        
        <template v-else-if="pokemonController.error.value">
            <ErrorView :error="pokemonController.error.value" />
        </template>

        <template v-else>
            <template v-if="pokemonController.data.value instanceof HomeViewModel && pokemonController.data.value.pokemon">
                <h2 class="sr-only">Pokémon results</h2>
                <CustomSection>
                    <Card :card="pkm" v-for="pkm in pokemonController.data.value.pokemon" :key="pkm.id" />
                </CustomSection>
            </template>
            
            <template v-else>
                <p class="text-[var(--text-primary)] text-[2rem] font-bold text-center py-10" role="status">
                    No Pokémon found for this generation.
                </p>
            </template>
        </template>
    </section>
</template>
