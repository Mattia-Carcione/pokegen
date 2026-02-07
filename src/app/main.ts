import { createApp } from "vue";
import App from "./App.vue";

import { AppContainer } from "@/app/di/AppContainer";
import { EnvironmentEnum } from "@/core/environments/EnvironmentEnum";

async function start() {
  const env =
    import.meta.env.MODE === "production"
      ? EnvironmentEnum.PRODUCTION
      : EnvironmentEnum.DEVELOPMENT;

  const container = new AppContainer(env);

  // PRE-MOUNT
  await container.bootstrap();

  // MOUNT
  const app = createApp(App);
  app.mount("#app");

  // FETCH iniziale
  await container.mount();
}

start();
