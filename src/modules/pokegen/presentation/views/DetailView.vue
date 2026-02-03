<script setup>
import { watch } from 'vue';

import { DetailViewModel } from '../viewmodels/DetailViewModel';
import { appContainer } from '@/app/di/AppContainer';
import { TypeRequestEnum } from '../enums/TypeRequestEnum';
import { usePokegenDetailSeo } from '@/modules/pokegen/presentation/composables/usePokegenSeo';

import Loader from '@/shared/presentation/components/Loader.vue';
import ErrorView from '@/shared/presentation/components/404View.vue';
import CardDetail from '../components/CardDetail.vue';

const props = defineProps({ name: String });

const pkmDetailController = appContainer.pokemonController();

watch(() => props.name, async (newName) => {
    await pkmDetailController.loadData({ endpoint: newName, req: TypeRequestEnum.DETAIL });
}, { immediate: true });

usePokegenDetailSeo(pkmDetailController);
</script>

<template>
    <section id="detail-view-section" aria-label="details view section" class="detail-view-wrapper my-3">
        <template v-if="pkmDetailController.isLoading.value">
            <Loader />
        </template>

        <template v-else-if="pkmDetailController.error.value">
            <ErrorView :error="pkmDetailController.error.value" />
        </template>

        <template v-else-if="pkmDetailController.data.value">
            <template v-if="pkmDetailController.data.value instanceof DetailViewModel && pkmDetailController.data.value.pokemon" >
                <!-- Detail view content goes here -->
                 <CardDetail
                    :pokemon="pkmDetailController.data.value.pokemon"
                    :prev="pkmDetailController.data.value.prev"
                    :next="pkmDetailController.data.value.next"
                    :name="props.name"
                    :typeEffectiveness="pkmDetailController.data.value.typeEffectiveness"
                />
            </template>
            
            <template v-else>
                <div class="flex justify-center py-10">
                    <p class="text-[var(--text-primary)] text-[2rem] font-bold text-center" role="status">Data not found.</p>
                </div>
            </template>
        </template>
    </section>
</template>
