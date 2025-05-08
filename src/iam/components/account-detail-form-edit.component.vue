<script>
import InputTextComponent from '../../shared/components/input-text.component.vue';

export default {
    name: "AccountDetailFormEdit",
    components: {
        InputTextComponent
    },
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
    data() {
        return {
            editingField: null,
        }
    },
    methods: {
        formatFieldName(field) {
            return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
        },
        editField(field) {
            console.log("Edit field:", field, "Current value:", this.userData[field]);
            
            if(this.editingField === field) {
                console.log("asd");
                this.editingField = null;
                this.$emit("save", field, this.userData[field]);
            } else {
                console.log("else");
                this.editingField = field;
                this.$emit("edit", field, this.userData[field]);
            }
        }
    }
}
</script>

<template>
    <div v-if="userData" class="account-details">
        <div v-for="(key, index) in filteredFields" :key="index" class="account-detail-item">
        <div class="item-fields">
            <p class="account-detail-item__field">{{ formatFieldName(key) }}</p> 
            <p v-if="editingField !== key" class="account-detail-item__field-value">{{ userData[key] }}</p>
            <InputTextComponent v-else v-model="userData[key]" :label="formatFieldName(key)" class="account-detail-item__field-value" />
        </div>

        <div class="item-edit" @click="editField(key)">
            <img
                :src="editingField === key ? '/icon_save.svg' : '/icon_pen.svg'"
                :alt="editingField === key ? 'Save Icon' : 'Edit Icon'"
                class="edit-icon"
            />
            <p class="account-detail-item__edit">{{ editingField === key ? 'Save' : 'Edit' }}</p>
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

@media screen and (max-width: 460px) {
  .account-detail-item__edit {
    display: none;
  }
}
</style>