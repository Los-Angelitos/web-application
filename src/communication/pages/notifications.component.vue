<script>
import ContactsList from "../components/contacts-list.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import TextAreaEmail from "../components/text-area-email.component.vue";
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
    name: "NotificationPage",
    components: {
        ContactsList,
        BasicCardComponent,
        ButtonComponent,
        TextAreaEmail
    },
    data() {
      return {
        contactSelected: null,
        userData: null,
        emailContent: "",
        subjectContent: ""
      }
    },
    mounted() {
      this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        setTimeout(() => {
          this.userData = userMock;
        }, 300);
      },
      clearEmailContent() {
        console.log("Email content cleared!");
        this.emailContent = "";
        this.subjectContent = "";
      },
      sendEmail() {
        console.log("Email sent!"); 

      },
      handleContactClick(contact) {
        this.contactSelected = contact;
      }
    }
}
</script>

<template>
  <div class="communication-container">
    <ContactsList @contact-clicked="handleContactClick" />

    <BasicCardComponent title="" class="email-card">
      <template #header-content>
        <div class="detail-form-email">
          <div class="detail-form-email-content">
          
            <div class="form-email-icon">
              <img
                src="../../assets/communication/user-icon.svg"
                alt="User Icon"
                class="email-icon"
              />
  
              <img
                src="../../assets/communication/paperplane-icon.svg"
                alt="Paper Plane Icon"
                class="email-icon"
              />
  
              <img
                src="../../assets/communication/comment-icon.svg"
                alt="Comment Icon"
                class="email-icon"
              />
            </div>
            <div class="form-email-item">
               <p><strong>From:</strong> {{ !userData? "" : userData.name + " (" + userData.email + ")" }}</p>
               <p><strong>To:</strong> {{ !contactSelected? "Select a contact" : contactSelected.name + " (" + contactSelected.email + ")"}}</p>
               <div class="form-email-content">
               <strong>Subject:</strong> <input type="text" class="subject-email-input" placeholder="Write your subject here" v-model="subjectContent"/>
               </div>
            </div>  
          </div>

        </div>
      </template>
      <div class="email-content">
        <TextAreaEmail v-model:emailContent="emailContent"/>

        <div class="buttons-email">
          <ButtonComponent
            text="Borrar"
            state="basic"
            width="150px"
            height="40px"
            :onClick="clearEmailContent"
             />

          <ButtonComponent
            text="Enviar"
            state="primary"
            width="150px"
            height="40px"
            :onClick="sendEmail"
             />
        </div>
      </div>
    </BasicCardComponent>
  </div>
</template>

<style scoped>
.communication-container {
  margin: 2rem;
  width: 960px;
  margin: 0 auto;
}

.form-email-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}


.detail-form-email-content {
  display: flex;
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 1rem;
  width: 100%;
}


.form-email-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
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

@media screen and (max-width: 960px) {
  .communication-container {
    width: fit-content;
    margin: 1rem;
  }
}

@media screen and (max-width: 490px) {
  .form-email-item p{
    text-align: left;
  }
  
  .form-email-icon {
    gap: 0.8rem;
  }

  .buttons-email {
    width: auto;
    flex-direction: column;
    align-items: center;
  }
}

@media screen and (max-width: 335px) {
  .form-email-icon {
    display: none;
  }
}

</style>