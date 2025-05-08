<!--
Use:
<ModalComponent v-model="showModal" title="Hello World" :showCloseButton="true" :closeOnOverlayClick="true" :width="'500px'" :height="'auto'" :backgroundColor="'#ffffff'">
    <template #header>
      <h1>Header</h1>
    </template>
    <template #body>
      <p>This is the body of the modal.</p>
    </template>
    <template #footer>
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
    },
    computed: {
      cardStyles() {
        return {
          width: this.width,
          height: this.height,
          backgroundColor: this.backgroundColor
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
      <div class="modal-container">
        <div class="modal-card" :style="cardStyles">
          <div 
            v-if="showCloseButton" 
            class="modal-close" 
            @click="closeModal"
          >
            &times;
          </div>

          <div v-if="$slots.image" class="modal-image">
            <slot name="image"></slot>
          </div>
          
          <div v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
          </div>
          
          <div class="modal-body">
            <slot name="body">
              <p>Este es el contenido del modal.</p>
            </slot>
          </div>
          
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
  background-color: rgba(0, 0, 0, .5);
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
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
  z-index: 10;
}

.modal-close:hover {
  color: #333;
}

.modal-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.modal-header {
  padding: 16px;
  color: #3D3D67;
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
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

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