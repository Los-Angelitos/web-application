<!--
Use:
    data() {
        return {
            showFormModal: false,
            userData: {
                name: "",
                email: "",
                role: ""
            }
        };
    },

    methods: {
        // Método para abrir el modal
        openModal() {
            this.showFormModal = true;
        },

        // Método para guardar los datos del usuario
        saveUser() {
            console.log("Datos del usuario guardados:", this.userData);
            this.showFormModal = false;
        }
    },

  <ModalComponent
      v-model="showFormModal"
      title="Editar Usuario"
      width="600px"
      :closeOnOverlayClick="false"
      backgroundColor="#f8f9fa"
    >
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="userData.name" placeholder="Nombre">
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="userData.email" placeholder="Email">
      </div>
      
      <div class="form-group">
        <label for="role">Rol</label>
        <select id="role" v-model="userData.role">
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          <option value="guest">Invitado</option>
        </select>
      </div>
      
      <template #footer>
        <button class="btn secondary" @click="showFormModal = false">Cancelar</button>
        <button class="btn primary" @click="saveUser">Guardar</button>
      </template>
    </ModalComponent>

-->

<script>
  export default {
    name: 'ModalComponent',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      showCloseButton: {
        type: Boolean,
        default: true
      },
      closeOnOverlayClick: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: '500px'
      },
      height: {
        type: String,
        default: 'auto'
      },
      backgroundColor: {
        type: String,
        default: '#ffffff'
      },
      overlayOpacity: {
        type: Number,
        default: 0.5
      }
    },
    computed: {
      cardStyles() {
        return {
          width: this.width,
          height: this.height,
          backgroundColor: this.backgroundColor
        };
      },
      modalStyles() {
        return {
          '--overlay-opacity': this.overlayOpacity
        };
      }
    },
    methods: {
      closeModal() {
        if (this.closeOnOverlayClick) {
          this.$emit('update:modelValue', false);
        }
      },
      open() {
        this.$emit('update:modelValue', true);
      },
      close() {
        this.$emit('update:modelValue', false);
      }
    }
  };
  </script>

<template>
    <transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="modal-overlay" 
        @click.self="closeModal"
      >
        <div class="modal-container" :style="modalStyles">
          <div class="modal-card" :style="cardStyles">
            <!-- Botón de cierre opcional -->
            <div 
              v-if="showCloseButton" 
              class="modal-close" 
              @click="closeModal"
            >
              &times;
            </div>
            
            <!-- Header del modal -->
            <div v-if="$slots.header || title" class="modal-header">
              <slot name="header">
                <h3 class="modal-title">{{ title }}</h3>
              </slot>
            </div>
            
            <!-- Contenido del modal -->
            <div class="modal-body">
              <slot></slot>
            </div>
            
            <!-- Footer del modal -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, var(--overlay-opacity));
    z-index: 1000;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px;
  }
  
  .modal-container {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    z-index: 1001;
  }
  
  .modal-card {
    position: relative;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    color: #666;
    z-index: 10;
  }
  
  .modal-close:hover {
    color: #333;
  }
  
  .modal-header {
    padding: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .modal-body {
    padding: 16px;
    overflow-y: auto;
  }
  
  .modal-footer {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  /* Transiciones */
  .modal-fade-enter-active, 
  .modal-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .modal-fade-enter-from {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .modal-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  </style>