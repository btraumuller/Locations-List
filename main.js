const Vue = require('vue');
const axios = require('axios');
let locationSection = require('./Locations/locationResults.vue').default;
Vue.prototype.$http = axios;

import vSelect from 'vue-select';


if (document.querySelector('#location-listing') !== null) {

    new Vue({
        el: '#location-listing',
        render: function (createElement) {
            return createElement(locationSection);
        }
    });
}

