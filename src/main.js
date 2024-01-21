import { createApp } from 'vue'
import App from './App.vue'
import './styles/style.css'
import PrimeVue from 'primevue/config'
import router from './router'
import { addComponents } from './scripts/components'
import 'primevue/resources/themes/lara-light-green/theme.css'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

addComponents(app)

app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(DialogService)

app.mount('#app')

console.log('width', window.innerWidth)