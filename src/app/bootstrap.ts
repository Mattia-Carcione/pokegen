import { createApp } from "vue";

import { AppContainer } from "@/app/di/AppContainer";
import pinia from "@/app/providers/Pinia";
import router from './app/routing/index.js';
import App from "./App.vue";

import { useGenerationStore } from "@/modules/pokegen/presentation/stores/UseGenerationStore";
import Hero from "./presentation/layout/Hero.vue";
import Navbar from "./presentation/layout/Navbar.vue";
import Footer from "./presentation/layout/Footer.vue";

export async function bootstrap() {
  const app = createApp(App);
  const hero = createApp(Hero);
  // const search = createApp(SearchIn);
  const nav = createApp(Navbar);
  const footer = createApp(Footer);

  app.use(pinia);
  app.use(router);
  hero.use(router);
  nav.use(router);
  footer.use(router);

  const container = AppContainer.getInstance();
  const generationController = container.resolveGenerationController();

  const store = useGenerationStore();
  await store.loadAll(generationController);

  app.mount("#app");
  hero.mount('#header');
  nav.mount('#nav');
  footer.mount('#footer');
}
