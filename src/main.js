import Vue from 'vue';
import App from './App.vue';
import store from './store';
import VueClipboard from 'vue-clipboard2';
import {BootstrapVue, BootstrapVueIcons, VBModalPlugin} from 'bootstrap-vue';
import VueMeta from 'vue-meta';

import './assets/main.scss';

Vue.config.productionTip = false;

Vue.use(VueClipboard);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VBModalPlugin);
Vue.use(VueMeta);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
