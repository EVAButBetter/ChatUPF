import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMicrophone, faSpinner,faPlay, faEllipsis } from '@fortawesome/free-solid-svg-icons'

library.add(faMicrophone)
library.add(faSpinner)
library.add(faPlay)
library.add(faEllipsis)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Vant)

Vue.config.productionTip = false
// voice
Vue.prototype.$http_voice = axios.create({
  baseURL: 'http://localhost:8001/'
})
// text
Vue.prototype.$http_text = axios.create({
  baseURL: 'http://localhost:8002/'
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
