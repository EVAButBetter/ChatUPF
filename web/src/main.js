import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMicrophone, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faMicrophone)
library.add(faSpinner)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Vant)

Vue.config.productionTip = false
Vue.prototype.$http_text = axios.create({
  baseURL: 'http://localhost:3000/'
})

Vue.prototype.$http_voice = axios.create({
  baseURL: 'http://localhost:8001/'
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
