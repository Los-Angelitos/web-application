<script>
import ContactsList from "../components/contacts-list.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import TextAreaEmail from "../components/text-area-email.component.vue";

export default {
    name: "NotificationPage",
    components: {
        ContactsList,
        BasicCardComponent,
        ButtonComponent,
        TextAreaEmail
    },
}
</script>

<template>
  <div class="communication-container">
    <ContactsList />

    <BasicCardComponent title="" class="email-card">
      <template #header-content>
        <div class="detail-form-email">
          <div class="form-email-item">
            <img
              src="../../assets/communication/paperplane-icon.svg"
              alt="Paper Plane Icon"
              class="email-icon"
            />
            <p><strong>Para:</strong> Mauricio Rojas (mauwiwi@mono.com)</p>
          </div>

          <div class="form-email-item">
            <img
              src="../../assets/communication/comment-icon.svg"
              alt="Comment Icon"
              class="email-icon"
            />
            <div class="form-email-content">
              <strong>Asunto:</strong> <input type="text" class="subject-email-input" placeholder="Write your subject here"/>
          </div>
          </div>
        </div>
      </template>
      <div class="email-content">
        <TextAreaEmail />

        <div class="buttons-email">
          <ButtonComponent
            text="Borrar"
            state="basic"
            width="150px"
            height="40px"
             />

          <ButtonComponent
            text="Enviar"
            state="primary"
            width="150px"
            height="40px"
             />
        </div>
      </div>
    </BasicCardComponent>
  </div>
</template>

<style scoped>
.communication-container {
  margin: 2rem;
}

.form-email-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: .5rem;
}

.detail-form-email::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin-top: 1rem;
}

.email-card {
  width: 100%;
  margin: 0 auto;
  padding-bottom: 2rem;
}

::v-deep(.card) {
  margin-top: 2rem;
}

.buttons-email {
  width: max-content;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}

.subject-email-input {
  width: 100%;
  height: 20px;
  padding: 10px;
  color: var(--gray-color);
  border: none;
}

.subject-email-input:focus {
  outline: none;
  border: none;
}

.form-email-content {
  display: flex;
  align-items: center;
  width: 100%;
}

</style>