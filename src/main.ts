import { createApp } from 'vue';

import { createVuetify } from 'vuetify';
import 'vuetify/styles';

import App from './App.vue';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
