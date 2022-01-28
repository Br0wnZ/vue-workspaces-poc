import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
const app = createApp(App);
const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: "es", // set locale
  fallbackLocale: "en", // set fallback locale,
  messages: {
    es,
    en,
  }, // set locale messages
});
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");