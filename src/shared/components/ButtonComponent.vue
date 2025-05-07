<template>
  <button
      class="sweet-button"
      :class="[
      state === 'primary' ? 'primary' : 'basic',
      fullWidth ? 'full-width' : '',
      disabled ? 'disabled' : ''
    ]"
      :style="computedStyles"
      :disabled="disabled"
      @click="handleClick"
  >
    {{ text }}<slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ButtonComponent',
  props: {
    text: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'basic'].includes(value)
    },
    width: {
      type: [String, Number],
      default: null
    },
    height: {
      type: [String, Number],
      default: null
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: null
    }
  },
  computed: {
    computedStyles() {
      const styles = {};

      if (this.width) {
        styles.width = isNaN(this.width) ? this.width : `${this.width}px`;
      }

      if (this.height) {
        styles.height = isNaN(this.height) ? this.height : `${this.height}px`;
      }

      return styles;
    }
  },
  methods: {
    handleClick(event) {
      if (this.onClick && !this.disabled) {
        this.onClick(event);
      }
      this.$emit('click', event);
    }
  }
}
</script>

<style scoped>
.sweet-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  outline: none;
  min-width: 120px;
  text-align: center;
}

.primary {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

.primary:hover {
  background-color: #0055b3;
  border-color: #0055b3;
}

.primary:active {
  background-color: #004499;
  border-color: #004499;
}

.basic {
  background-color: white;
  color: #333;
  border-color: #d0d0d0;
}

.basic:hover {
  background-color: #f5f5f5;
  border-color: #c0c0c0;
}

.basic:active {
  background-color: #e8e8e8;
  border-color: #b0b0b0;
}

.full-width {
  width: 100%;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled:hover {
  opacity: 0.6;
}
</style>