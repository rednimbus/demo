{{version}}
import Vue from 'vue';
import App from './App.vue';
{{import-supplement}}
// eslint-disable-next-line
new Vue({
    el: '#app',{{vue-supplement}}
    render: h => h(App)
});
