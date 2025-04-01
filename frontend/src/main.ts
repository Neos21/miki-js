import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles/main.css';
import './styles.css';

import { createApp } from 'vue';

import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { md2 } from 'vuetify/blueprints';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './app.vue';
import { router } from './core/routes/router';

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md2,
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {  // テーマ名
        colors: {
          primary: '#1976d2'
        }
      }
    }
  }
});

const app = createApp(App);
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.mount('#app');
