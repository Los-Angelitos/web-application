<template>
  <div class="checkout-container">
    <div class="checkout-header">
      <h1>Pago y checkout</h1>
      <p class="subtitle">Completa el siguiente formulario.</p>
    </div>

    <div class="checkout-content">
      <basic-card-component title="" class="payment-card">
        <div class="payment-card-content">
          <div class="payment-header">
            <div class="plan-info">
              <div class="plan-title">{{this.planTitle}}</div>
              <div class="plan-price">{{ this.planPrice }}</div>
            </div>
            <div class="payment-logo">
              <img src="/public/niubiz_logo.png" alt="Niubiz" />
            </div>
          </div>

          <div class="payment-icon">
            <img src="/public/credit_card_icon.png" alt="Credit Card" />
          </div>

          <div class="payment-methods">
            <div class="payment-method-options">
              <div class="payment-method-option">
                <img src="/public/amex_logo.png" alt="American Express" />
              </div>
              <div class="payment-method-option">
                <img src="/public/visa_logo.png" alt="Visa" />
              </div>
              <div class="payment-method-option">
                <img src="/public/diners_logo.png" alt="Diners Club" />
              </div>
              <div class="payment-method-option">
                <img src="/public/mastercard_logo.png" alt="Mastercard" />
              </div>
              <div class="payment-method-option">
                <img src="/public/google_pay_logo.png" alt="Google Pay" />
              </div>
              <div class="payment-method-option">
                <img src="/public/apple_pay_logo.png" alt="Apple Pay" />
              </div>
            </div>
          </div>

          <div class="payment-form">
            <div class="form-group">
              <label for="cardNumber">Número de tarjeta</label>
              <input
                  type="text"
                  id="cardNumber"
                  v-model="cardNumber"
                  placeholder="4506 5547 8872 5156"
                  class="form-input"
                  @input="formatCardNumber"
                  maxlength="19"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Fecha de vencimiento</label>
                <input
                    type="text"
                    id="expiryDate"
                    v-model="expiryDate"
                    placeholder="05/28"
                    class="form-input"
                    @input="formatExpiryDate"
                    maxlength="5"
                />
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input
                    type="text"
                    id="cvv"
                    v-model="cvv"
                    placeholder="999"
                    class="form-input"
                    maxlength="4"
                />
              </div>
            </div>

            <div class="checkout-button">
              <button-component
                  text="PAGAR"
                  state="primary"
                  :full-width="true"
                  @click="processPayment"
              ></button-component>
            </div>
          </div>
        </div>
      </basic-card-component>
    </div>
  </div>
  <ModalComponent
      v-model="showErrorModal"
      title="Validation Error"
      :close-on-overlay-click="true"
      width="400px"
  >
    <template #body>
      <p>{{ errorMessage }}</p>
    </template>
    <template #footer>
      <button-component height="40" width="100" @click="showErrorModal = false">Close</button-component>
    </template>
  </ModalComponent>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import ModalComponent from "../../shared/components/modal.component.vue";

export default {
  name: 'CheckoutPage',
  components: {
    ModalComponent,
    BasicCardComponent,
    ButtonComponent
  },
  props: {
    planType: {
      type: String,
      default: 'REGULAR'
    },
    amount: {
      type: Number,
      default: 149.90
    }
  },
  mounted() {
    const id = this.$route.params.id;
    this.loadSubscriptionData(id);
  },
  data() {
    return {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isProcessing: false,
      showErrorModal: false,
      errorMessage: '',
      planTitle: '',
      planPrice: '',
    }
  },
  methods: {
    loadSubscriptionData(id){
      if(id == 1){
        this.planTitle = 'Plan BÁSICO';
        this.planPrice = 'Total a pagar: $22.10';
      } else if(id == 2){
        this.planTitle = 'Plan REGULAR';
        this.planPrice = 'Total a pagar: $41.29';
      } else if(id == 3){
        this.planTitle = 'Plan PREMIUM';
        this.planPrice = 'Total a pagar: $69.90';
      }
    },
    formatCardNumber(event) {
      // Remove any non-digit characters
      let value = event.target.value.replace(/\D/g, '');

      // Add space after every 4 digits
      let formattedValue = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += value[i];
      }

      this.cardNumber = formattedValue;
    },
    formatExpiryDate(event) {
      // Remove any non-digit characters
      let value = event.target.value.replace(/\D/g, '');

      // Format as MM/YY
      if (value.length > 2) {
        this.expiryDate = value.substring(0, 2) + '/' + value.substring(2);
      } else {
        this.expiryDate = value;
      }
    },
    processPayment() {
      if (this.validateForm()) {
        this.isProcessing = true;

        // Simulate payment processing
        setTimeout(() => {
          this.isProcessing = false;
          this.$emit('payment-completed', {
            success: true,
            planType: this.planType,
            amount: this.amount,
            cardNumber: this.cardNumber.slice(-4)
          });
        }, 2000);
        this.$router.push('/home/hotel/set-up');
      }
    },
    validateForm() {
      if (this.cardNumber.replace(/\s/g, '').length < 16) {
        this.errorMessage = 'Please enter a valid card number';
        this.showErrorModal = true;
        return false;
      }

      if (this.expiryDate.length < 5) {
        this.errorMessage = 'Please enter a valid expiry date';
        this.showErrorModal = true;
        return false;
      }

      if (this.cvv.length < 3) {
        this.errorMessage = 'Please enter a valid CVV';
        this.showErrorModal = true;
        return false;
      }

      return true;
    }
  }
}
</script>

<style scoped>
.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
}

.checkout-header {
  text-align: left;
  margin-bottom: 30px;
}

.checkout-header h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #000;
}

.subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 300;
}

.checkout-content {
  display: flex;
  justify-content: center;
}

.payment-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.payment-card-content {
  padding: 10px;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.plan-price {
  font-size: 16px;
  color: #777;
  margin-top: 5px;
}

.payment-logo img {
  height: 30px;
}

.payment-icon {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.payment-icon img {
  width: 60px;
  height: 60px;
  color: #0066cc;
}

.payment-methods {
  margin-bottom: 30px;
}

.payment-method-options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.payment-method-option {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method-option:hover {
  border-color: #0066cc;
}

.payment-method-option img {
  height: 24px;
}

.payment-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
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

.checkout-button {
  margin-top: 20px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .checkout-container {
    padding: 20px 15px;
  }

  .checkout-header {
    text-align: center;
  }

  .payment-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .payment-logo {
    margin-top: 15px;
  }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .checkout-header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 16px;
  }

  .payment-method-options {
    gap: 5px;
  }

  .payment-method-option {
    padding: 5px 8px;
  }

  .payment-method-option img {
    height: 20px;
  }
}
</style>