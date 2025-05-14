import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from "./router/index.js";
import {createVuetify} from "vuetify/framework";
import PrimeVue from 'primevue/config';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import 'primeicons/primeicons.css';
import Aura from '@primevue/themes/aura';
import Password from 'primevue/password';
import {Checkbox} from "primevue";
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";

// i18n
import i18n from "./i18n.js"

const vuetify = createVuetify();
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(i18n);

app.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            cssLayer: false,
            darkModeSelector: 'manual'
        }
    }
});
app.component('InputText', InputText);
app.component('FloatLabel', FloatLabel);
app.component('Password', Password);
app.use(ToastService);
app.component("Toast", Toast);
app.component('Checkbox', Checkbox);
app.component('RadioButton', RadioButton);

app.component('RadioButtonGroup', RadioButtonGroup);
app.component('IftaLabel', IftaLabel);
app.mount('#app');
