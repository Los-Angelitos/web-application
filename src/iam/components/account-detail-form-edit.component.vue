<script>
export default {
    name: "AccountDetailFormEdit",
    props: {
        userData: {
            type: Object,
            required: true
        },
        notShowFields: {
            type: Array,
            default: () => ["id", "type", "created_at", "updated_at", "image", "preferences"]
        }
    },
    computed: {
      filteredFields() {
        if (!this.userData) return [];
        return Object.keys(this.userData).filter(key => !this.notShowFields.includes(key));
      }
    },
    methods: {
        formatFieldName(field) {
            return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
        },
        editField(field) {
            // Logic to edit the field
            console.log(`Editing field: ${field}`);
        }
    }
}
</script>

<template>
    <div v-if="userData" class="account-details">
        <div v-for="(key, index) in filteredFields" :key="index" class="account-detail-item">
        <div class="item-fields">
            <p class="account-detail-item__field">{{ formatFieldName(key) }}</p> 
            <p class="account-detail-item__field-value">{{ userData[key] }}</p>
        </div>

        <div class="item-edit" @click="editField(key)">
            <img src="/icon_pen.svg" alt="Edit Icon" class="edit-icon" />
            <p class="account-detail-item__edit">Edit</p>
        </div>
        </div>
    </div>
</template>

<style scoped>
.account-details {
  margin-top: 2rem;
}

.account-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--gray-extra-light-color);
  width: 100%;
  
}

.item-fields{
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.account-detail-item__field {
  font-size: 1.2rem;
}

.account-detail-item__field-value {
  font-size: .9rem;
  color: var(--gray-light-color);
}

.item-edit {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.edit-icon {
  width: .8rem;
  height: .8rem;
  margin-right: .5rem;
}

.account-detail-item__edit {
  font-size: .9rem;
  color: #000;
}
</style>