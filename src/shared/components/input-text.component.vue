

<script>
export default {
  name: 'InputTextComponent',
  props: {
    modelValue: String,
    label: {
      type: String,
      default: 'Label'
    }
  },
  computed: {
    //para llamarlo, llamalo asi:   <InputTextComponent v-model="usuario" label="Nombre de usuario" />
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  }
}
</script>

<template>
  <IftaLabel>
    <InputText
        class="mylabel"
        id="username"
        v-model="internalValue"
        variant="filled"
    />
    <label for="username" style="font-size: 0.7rem">{{ label }}</label>
  </IftaLabel>
</template>

<style scoped>
.mylabel {
  width: 100%;
  height: 3rem;
}
</style>
