import { pokegenRoutes } from '@/modules/pokegen/presentation/routes';
// @ts-ignore - Vue 3 dynamic import type declaration
import NotFound from '@/shared/presentation/components/404View.vue';
// @ts-ignore - Vue 3 dynamic import type declaration
import PrivacyView from '@/shared/presentation/components/PrivacyView.vue';
// @ts-ignore - Vue 3 dynamic import type declaration
import TermsView from '@/shared/presentation/components/TermsView.vue';
import { AppRouteName } from '@/app/routing/AppRouteName';

/**
 * Definizione delle rotte dell'applicazione.
 */
export const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: AppRouteName.NotFound,
        component: NotFound,
        meta: {
            seo: {
                title: 'Page not found',
                description: 'The page you are looking for does not exist. Return to PokéGen home.',
                pageType: 'WebPage',
                robots: 'noindex, nofollow',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: '404', url: '/404' },
                ],
            },
        },
    },
    {
        path: '/privacy',
        name: AppRouteName.Privacy,
        component: PrivacyView,
        meta: {
            seo: {
                title: 'Privacy Policy',
                description: 'Read the PokéGen privacy policy and data usage details.',
                pageType: 'WebPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Privacy', url: '/privacy' },
                ],
            },
        },
    },
    {
        path: '/terms',
        name: AppRouteName.Terms,
        component: TermsView,
        meta: {
            seo: {
                title: 'Terms of Service',
                description: 'Read the PokéGen terms of service and usage guidelines.',
                pageType: 'WebPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: 'Terms', url: '/terms' },
                ],
            },
        },
    },
    { path: '/', redirect: '/generation/1', name: AppRouteName.Home, },
    ...pokegenRoutes,
];