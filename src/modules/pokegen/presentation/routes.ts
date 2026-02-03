import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";
// @ts-ignore - Vue 3 dynamic import type declaration
import HomeView from "@/modules/pokegen/presentation/views/HomeView.vue";
// @ts-ignore - Vue 3 dynamic import type declaration
import DetailView from "@/modules/pokegen/presentation/views/DetailView.vue";

/**
 * Percorsi delle rotte per la funzionalità PokéGen.
 */
export const pokegenRoutes =[
    {
        path: '/generation/:id([1-9]\\d*)',
        name: PokegenRouteName.Generation,
        props: true,
        component: HomeView,
        meta: {
            seo: {
                title: 'Generation {id}',
                description: 'Browse all Pokémon from Generation {id} with stats, types, evolutions, and learnable moves.',
                pageType: 'CollectionPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Generation {id}', url: '/generation/{id}' },
                ],
            },
        },
    },
    {
        path: '/pokemon/:name',
        name: PokegenRouteName.Pokemon,
        props: true,
        component: DetailView,
        meta: {
            seo: {
                title: '{name}',
                description: 'Discover stats, types, evolutions, and move details (power, accuracy, PP, TM/MT) for {name}.',
                pageType: 'ItemPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: '{name}', url: '/pokemon/{name}' },
                ],
            },
        },
    },
]