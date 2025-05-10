<template>
  <div class="subscription-register-container">
    <div class="plans-container">
      <div class="plans-header">
        <h1>Planes y suscripciones</h1>
        <p class="subtitle">¡Atrévete a ser innovador e impulsa tu hotel al cambio digital!</p>
      </div>

      <div class="plans-grid">
        <!-- BÁSICO Plan -->
        <basic-card-component title="BÁSICO" class="plan-card">
          <template #image>
            <div class="plan-icon">
              <img src="/public/basic_subscription_icon.png" alt="Plan Básico" />
            </div>
          </template>
          <template #header-content>
            <div class="plan-price">$29.90 al mes</div>
          </template>

          <div class="plan-features">
            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Acceso a gestión de habitaciones con tecnología IoT
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Administración colaborativo de hasta dos personas
              </div>
            </div>
          </div>
          <div class="space-height-basic"></div>
          <div class="plan-button">
            <button-component
                text="CONTRATAR"
                state="primary"
                :full-width="true"
                @click="selectPlan('basic')"
            ></button-component>
          </div>
        </basic-card-component>

        <!-- REGULAR Plan -->
        <basic-card-component title="REGULAR" class="plan-card">
          <template #image>
            <div class="plan-icon">
              <img src="/public/regular_subscription_icon.png" alt="Plan Regular" />
            </div>
          </template>
          <template #header-content>
            <div class="plan-price">$58.99 al mes</div>
          </template>

          <div class="plan-features">
            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Acceso a gestión de habitaciones con tecnología IoT
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Administración colaborativo de hasta diez personas
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Acceso a dashboards interactivos de gestión empresarial
              </div>
            </div>
          </div>
          <div class="space-height-regular"></div>
          <div class="plan-button">
            <button-component
                text="CONTRATAR"
                state="basic"
                :full-width="true"
                @click="selectPlan('regular')"
            ></button-component>
          </div>
        </basic-card-component>

        <!-- PREMIUM Plan -->
        <basic-card-component title="PREMIUM" class="plan-card">
          <template #image>
            <div class="plan-icon">
              <img src="/public/premium_subscription_icon.png" alt="Plan Premium" />
            </div>
          </template>
          <template #header-content>
            <div class="plan-price">$110.69 al mes</div>
          </template>

          <div class="plan-features">
            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Acceso a gestión de habitaciones con tecnología IoT
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Administración colaborativo ilimitado
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Acceso a dashboards interactivos de gestión empresarial
              </div>
            </div>

            <div class="feature-item">
              <div class="check-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="feature-text">
                Soporte y mantenimiento 24/7
              </div>
            </div>
          </div>
          <div class="plan-button">
            <button-component
                text="CONTRATAR"
                state="primary"
                :full-width="true"
                @click="selectPlan('premium')"
            ></button-component>
          </div>
        </basic-card-component>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";

export default {
  name: 'SubscriptionPlanRegister',
  components: {
    BasicCardComponent,
    ButtonComponent
  },
  data() {
    return {
      selectedPlan: null,
      formData: {
        name: '',
        email: '',
        hotelName: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        terms: false
      }
    }
  },
  computed: {
    formValid() {
      return this.formData.name &&
          this.formData.email &&
          this.formData.hotelName &&
          this.formData.phone &&
          this.formData.address &&
          this.formData.city &&
          this.formData.country &&
          this.formData.terms;
    }
  },
  methods: {
    selectPlan(planType) {
      const planToId = {
        basic: 1,
        regular: 2,
        premium: 3,
      };

      const id = planToId[planType];
      if (id) {
        this.$router.push(`/home/hotel/checkout/${id}`);
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        hotelName: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        terms: false
      };
    }
  }
}
</script>

<style scoped>
.subscription-register-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.plans-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.plans-header {
  text-align: left;
  margin-bottom: 40px;
}

.plans-header h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000;
}

.subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 300;
}

.space-height-basic {
  height: 100px;
}

.space-height-regular {
  height: 45px;
}

.plans-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
}

.plan-card {
  width: calc(30% - 20px);
  min-width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.plan-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  padding: 20px 0;
}

.plan-icon img {
  width: 80px;
  height: 80px;
  color: #0066cc;
}

.plan-price {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-top: 5px;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
  flex-grow: 1; /* This makes the features section expand to fill available space */
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.check-icon {
  color: #4CAF50;
  font-size: 20px;
  min-width: 20px;
}

.feature-text {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
}

.plan-button {
  margin-top: auto; /* Pushes the button to the bottom */
  padding-top: 25px;
}

/* Registration Form Styles */
.registration-section {
  margin-top: 40px;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.registration-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.registration-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.registration-subtitle {
  color: #666;
  font-size: 16px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.form-group.full-width {
  flex-basis: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #0066cc;
  outline: none;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checkbox-row {
  margin-top: 10px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .plan-card {
    width: calc(33.333% - 20px); /* Keep 3 cards per row even on smaller desktops */
  }
}

@media (max-width: 992px) {
  .plan-card {
    width: calc(50% - 20px);
    min-width: 280px;
  }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    min-width: 100%;
  }

  .plans-header {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .registration-section {
    padding: 20px;
  }

  .form-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .form-buttons button {
    width: 100%;
  }

  .plan-card {
    width: 100%;
    min-width: unset;
  }

  .plans-grid {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 576px) {
  .plans-header h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .registration-header h2 {
    font-size: 22px;
  }

  .plan-card {
    min-width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .plans-container {
    padding: 20px 15px;
  }

  .plans-header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>