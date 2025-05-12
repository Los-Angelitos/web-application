<script>
import contactsMock from "../../mocks/communication/contacts.json";

export default {
    name: "ContactsList",
    data() {
        return {
            contacts: []
        }
    },
    mounted() {
        this.fetchContacts();
    },  
    methods: {
        fetchContacts() {
            setTimeout(() => {
                this.contacts = contactsMock;
            }, 300);
        },
        handleContactClick(contact) {
            this.$emit("contact-clicked", contact);
        }
    }
}
</script>

<template>
    <div class="contacts-list-container">
        <div class="contacts-list">
            <div class="contact-item" v-for="contact in contacts" :key="contact.id" @click="handleContactClick(contact)">
                <img :src="contact.image" alt="Contact Avatar" class="contact-avatar"/>
                <div class="contact-info">
                    <p>{{ contact.name }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.contacts-list-container {
    width: 100%;
    overflow-x: auto;
}

.contacts-list {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    flex-direction: column;
    text-align: center;
    max-width: 100px;
}

.contact-item img {
    transition: all 0.3s ease;
}

.contact-item img:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.contact-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.contact-info {
    font-size: 14px;
    color: var(--gray-color);
}

@media screen and (max-width: 335px) {
  .contacts-list {
    flex-wrap: nowrap;
    width: max-content;
  }

  .contacts-list-container {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .contact-item {
    flex: 0 0 auto;
  }
}

</style>