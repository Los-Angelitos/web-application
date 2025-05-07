<template>
  <Checkbox v-model="internalValue" binary/>
</template>

<script>
export default {
  name: 'CheckboxComponent',
  props: {
    modelValue: Boolean
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  }
};
</script>

<style scoped>



</style>
