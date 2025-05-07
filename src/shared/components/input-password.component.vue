
<template>
  <IftaLabel>
    <Password class="mylabel" v-model="internalValue" inputId="over_label" toggleMask />
    <label for="over_label" style="font-size: 0.7rem">{{ label }}</label>
  </IftaLabel>
</template>


<script>
export default {
  name: "InputPasswordComponent",
  props: {
    modelValue: String,
    label: {
      type: String,
      default: 'Label'
    }
  },
  computed: {
    //para llamarlo, llamalo asi:   <InputPasswordComponent v-model="usuario" label="Nombre de usuario" />
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
.mylabel {
  width: 100%;
  height: 3rem;
}
</style>