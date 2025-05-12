<script>
import InputTextComponent from "../../shared/components/input-text.component.vue";
import InputPasswordComponent from "../../shared/components/input-password.component.vue";
import CheckboxComponent from "../../shared/components/checkbox.component.vue";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: "SignUpPage",
  components: {
    CheckboxComponent,
    InputPasswordComponent,
    InputTextComponent,
    Toast
  },
  data() {
    return {
      data: {
        name: '',
        surname: '',
        mail: '',
        phone: '',
        password: '',
        confirmPassword: '',
        read: false
      }
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    handleLogin() {
      if (!this.data.name || !this.data.mail || !this.data.phone || !this.data.password || !this.data.confirmPassword || !this.data.read) {
        this.toast.add({
          severity: 'error',
          summary: 'Campos incompletos',
          detail: 'Por favor completa todos los campos y acepta los términos.',
          life: 3000
        });
        return;
      }

      if (this.data.password !== this.data.confirmPassword) {
        this.toast.add({
          severity: 'warn',
          summary: 'Contraseñas no coinciden',
          detail: 'Verifica que las contraseñas coincidan.',
          life: 3000
        });
        return;
      }

      if (this.data.password.length < 6) {
        this.toast.add({
          severity: 'info',
          summary: 'Contraseña débil',
          detail: 'Debe tener al menos 6 caracteres.',
          life: 3000
        });
        return;
      }

      // Simulación de éxito
      this.toast.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: '¡Vamos al siguiente paso!',
        life: 2000
      });

      this.$router.push('/auth/sign-up/role');
    },
    sendToSignUp() {
      this.$router.push('/auth/sign-in');
    }
  }
};
</script>


<template>
  <Toast />
  <div class="login-container">

    <div class="login-section">
      <div class="login-logo-image">
        <img src="/sweetmanager-circle-logo.png" alt="logo" />
      </div>
      <div class="login-box">

        <h2 class="title">¡Bienvenido!</h2>
        <text class="ask">Ingresa tus credenciales para acceder</text>


        <InputTextComponent v-model="data.name" label="Nombre Completo" class="no-movement"/>
        <InputTextComponent v-model="data.mail" label="Correo Electrónico" class="no-movement"/>
        <InputTextComponent v-model="data.phone" label="Teléfono" class="no-movement"/>
        <InputPasswordComponent v-model="data.password" label="Contraseña" class="no-movement" />
        <InputPasswordComponent style="width:100%" v-model="data.confirmPassword" label="Confirmar Contraseña" class="no-movement" />
        <text style="font-size: 0.65rem; width:100%"><CheckboxComponent v-model="data.read"/>  Acepto los <text style="color: var(--primary-color)">Términos y Condiciones</text> y <text style="color: var(--primary-color)">Politica de Privacidad</text></text>
        <button @click="handleLogin" class="login-button">Ingresar</button>

        <div class="line-container">
          <span>o continua con</span>

        </div>
        <div class="web-logos">
          <i class="fab fa-google"></i> <!-- Ícono de Google -->
          <i class="fab fa-facebook"></i> <!-- Ícono de Facebook -->
          <i class="fab fa-linkedin"></i>
        </div>
        <div style="margin-top:0.8rem; font-size:0.8rem;">¿Ya tienes una cuenta?</div>
        <button class="crear-cuenta" style="font-size:0.8rem; color: var(--primary-color); background: none; border: none; cursor: pointer; margin-top:-1rem" @click="sendToSignUp">Iniciar Sesión</button>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
    <div class="logo-section">
      <img src="/image95.png" alt="Company Logo" class="company-logo" />
    </div>
  </div>
</template>

<style scoped>
.web-logos{
  display: flex;
  justify-content: center;
  color: var(--primary-color) !important;
  margin-top: 0.5rem;


}
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

.line-container::before,
.line-container::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #ccc;
  margin: 0 10px;
}
.login-logo-image {
  position: absolute; /* Coloca el logo en una posición absoluta */
  margin-top:0.5rem;
  z-index: 1000; /* Asegura que esté en la capa superior */
}
.login-container {
  display: flex;
  height: 100vh;

}

.logo-section {
  width: 80vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-section {
  width: 50vw;
  display: flex;
  justify-content: center;
  margin-top:2rem;
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;

}
.login-box label {
  display: block;
  margin-bottom: 5px;
}



.login-box {
  padding: 30px;
  width:25rem;
  height: 37rem;
  margin-top:4rem;
  border: 0.5px solid #ccc;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
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

/* Enlace a GitHub */
.extra-links {
  margin-top: 15px;
}

.github-link {
  display: block;
  color: #007bff;
  text-decoration: none;
  font-size: 12px;
  margin-bottom: 1rem;
  text-align: right;
}




.login-box h2 {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}
.no-movement{
  margin-top: 0.5rem
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

.welcome {
  font-size: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  width: 100%;
}

.ask {
  font-size: 0.8rem;
  display: block;
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
  margin-top: 10px;
}
.login-button:hover {
  background-color: #0056b3;
}

.no-movement :deep(input),
.no-movement :deep(.p-inputtext),
.no-movement :deep(.p-password-input) {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
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