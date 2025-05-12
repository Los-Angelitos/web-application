<script>
import InputTextComponent from "../../shared/components/input-text.component.vue";
import InputPasswordComponent from "../../shared/components/input-password.component.vue";
import RadioButtonComponent from "../../shared/components/radio-button.component.vue";
import DescriptionRadioButtonComponent from "../components/description-radio-button.component.vue";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: "SignUpRolePage",
  components: {
    Toast,
    RadioButtonComponent,
    DescriptionRadioButtonComponent,
    InputPasswordComponent,
    InputTextComponent
  },
  data() {
    return {
      username: '',
      password: '',
      roleSelected: ''
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleLogin() {
      if (!this.roleSelected) {
        this.toast.add({
          severity: 'warn',
          summary: 'Rol requerido',
          detail: 'Por favor selecciona un rol para tu cuenta.',
          life: 3000
        });
        return;
      }

      this.toast.add({
        severity: 'success',
        summary: 'Rol seleccionado',
        detail: `Has elegido: ${this.roleSelected}`,
        life: 2000
      });

      this.$router.push('/auth/sign-up');
    },
    sendToSignUp() {
      this.$router.push('/auth/sign-up');
    }
  }
}
</script>


<template>
  <Toast />
  <div class="login-container">

    <div class="login-section">
      <div class="login-logo-image">
        <img src="/sweetmanager-circle-logo.png" alt="logo" />
      </div>
      <div class="login-box">

        <h2 class="title">¡Solo algo más!</h2>
        <p class="ask">En SweetManager nos preocupamos por</p>
        <p class="ask">brindar la mejor experiencia posible.</p>


        <p class="ask" style="margin-top:1.2rem; font-size:1.2rem">¿Para quien será esta cuenta?</p>
        <DescriptionRadioButtonComponent
            v-model="roleSelected"
            :options="[
    { value: 'guest', label: 'Huésped', description: 'Utilizaré mi cuenta para buscar, reservar una estancia dentro de un hotel.' },
    { value: 'admin', label: 'Administrador', description: 'Me encargaré de gestionar y manejar cada estancia dentro de un hotel para brindar la mayor comodidad posible.' },
    { value: 'manager', label: 'Gerente', description: 'Estaré al pendiente de todas las comodidades dentro de mi hotel y administraré lo necesario para mis clientes.' }
  ]"
            groupName="accountRole"
        />


        <button @click="handleLogin" class="login-button">Regístrate</button>

        <hr class="line-container"></hr>

        <div style="margin-top:1rem; font-size:0.8rem;">¿Ya tienes una cuenta?</div>
        <button class="crear-cuenta" style="font-size:0.8rem; color: var(--primary-color); background: none; border: none; cursor: pointer; margin-top:-1rem" @click="sendToSignUp">Iniciar Sesión</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.web-logos i{
  flex: 1; /* Hace que cada elemento ocupe el mismo espacio */
  text-align: center; /* Centra el contenido dentro de cada elemento */
  font-size: 2rem; /* Tamaño del icono */
}
.web-logos i:hover {
  color: #0056b3; /* Cambia el color al pasar el mouse */
}
.crear-cuenta i:hover {
  color: #0056b3; /* Cambia el color al pasar el mouse */
}

.line-container {
  display: flex;
  align-items: center;
  font-size: 10px;
  margin-top: 1rem;
}




.login-logo-image {
  position: absolute; /* Coloca el logo en una posición absoluta */
  margin-top:1.5rem;
  z-index: 1000; /* Asegura que esté en la capa superior */
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
}


.login-section {
  display: flex;
  justify-content: center;
  width: 100%;
}



.login-box label {
  display: block;
  margin-bottom: 5px;
}

.login-box {
  padding: 30px;
  width: 28rem;
  height: 35rem;
  margin-top: 5rem;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}


.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #000;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-color) !important;
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}






.login-box h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.no-movement input,
.no-movement #password{
  min-width: 100%;
  width: 100%;
  max-width: 100%
}
.login-logo-image {
  margin-bottom: 30px;
  margin-left: 1rem;
}

.login-logo-image img {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
}


.ask {
  font-size: 0.9rem;
  width: 100%;
}



.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 2rem;
}
.login-button:hover {
  background-color: #0056b3;
}


.error-message {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 768px) {

  .logo-section img {
    display:none;
  }
  .login-section {
    width: 100vw;
    height: 100vh;
    display: flex; /* Ensure it's a flex container */
    justify-content: center; /* Center horizontally */
  }
}
</style>