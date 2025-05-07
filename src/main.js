import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import {createVuetify} from "vuetify/framework";
import 'primeicons/primeicons.css';


const vuetify = createVuetify();
const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount('#app');
