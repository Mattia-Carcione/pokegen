export const pokegenRoutes = [
    {
        path: '/generation/:id',
        name: 'Generation',
        component: () => import('@/modules/pokegen/presentation/views/GenerationView.vue'),
        props: true,
        meta: {
            seo: {
                title: 'Generation Details',
                description: 'Detailed information about the selected Pokémon generation.',
                pageType: 'WebPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Generation', url: '/generation/:id' },
                ],
            },
        },
    },
    {
        path: '/pokemon/:id',
        name: 'Pokemon',
        component: () => import('@/modules/pokegen/presentation/views/PokemonView.vue'),
        props: true,
        meta: {
            seo: {
                title: 'Pokémon Details',
                description: 'Detailed information about the selected Pokémon.',
                pageType: 'WebPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Pokémon', url: '/pokemon/:id' },
                ],
            },
        },
    },
];