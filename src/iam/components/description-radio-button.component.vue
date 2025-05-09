<template>
  <div class="radio-group">
    <div
        class="radio-option"
        v-for="(option, index) in options"
        :key="index"
    >
      <RadioButton
          :inputId="`option${index}`"
          :name="groupName"
          :value="option.value"
          v-model="internalValue"
      />
      <label :for="`option${index}`" class="radio-label">
        <div class="option-title">{{ option.label }}</div>
        <div class="option-description">{{ option.description }}</div>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DescriptionRadioButtonComponent',
  props: {
    modelValue: String,
    groupName: {
      type: String,
      default: 'group'
    },
    options: {
      type: Array,
      required: true // Each option should be { value, label, description }
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
};
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  text-align: left;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.radio-label {
  cursor: pointer;
}

.option-title {
  font-weight: 500;
  font-size: 0.7rem;
  color: #000;
}

.option-description {
  font-size: 0.65rem;
  color: #666;
  margin-top: 0.1rem;
}
</style>
