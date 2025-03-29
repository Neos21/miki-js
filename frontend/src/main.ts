import './styles.css';
import 'vuetify/styles';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './app.vue';
import { router } from './core/routes/router';

const vuetify = createVuetify({ components, directives });

const app = createApp(App);
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.mount('#app');
