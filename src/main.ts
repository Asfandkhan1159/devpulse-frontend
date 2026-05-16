import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import Aura from '@primevue/themes/aura'
import '@primevue/themes/aura'
import './style.css'
import Ripple from 'primevue/ripple'
const app = createApp(App)
app.directive('ripple', Ripple)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(createPinia())
app.use(router)

app.mount('#app')
