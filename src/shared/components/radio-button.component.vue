<template>
  <div class="card flex justify-center">
    <div class="flex flex-wrap gap-4">
      <div
          class="flex items-center gap-2"
          v-for="(option, index) in options"
          :key="index"
      >
        <RadioButton
            :inputId="`option${index}`"
            :name="groupName"
            :value="option"
            v-model="internalValue"
        />
        <label :for="`option${index}`">{{ option }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioButtonComponent',
  props: {
    modelValue: String,
    options: {
      type: Array,
      required: true
    },
    groupName: {
      type: String,
      default: 'group'
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
/*
<template>
  <div>
    <h2>Selecciona un ingrediente:</h2>
    <RadioButtonComponent
        v-model="selectedOption"
        :options="['Cheese', 'Mushroom', 'Pepper', 'Onion']"
        groupName="pizza"
    />
    <p>Seleccionaste: {{ selectedOption }}</p>
  </div>
</template>

<script>

import RadioButtonComponent from "../../shared/components/radio-button.component.vue";

export default {
  name: 'MainPage',
  components: {
    RadioButtonComponent
  },
  data() {
    return {
      selectedOption: ''
    };
  }
};
 */
</script>


