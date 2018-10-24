<template>
  <div>
    <v-text-field
      :label="label"
      :hint="hint"
      persistent-hint
      :required="required"
      :rules="rules"
      :value="value"
      readonly
      @click.native="onFocus('fileInput')"
    ></v-text-field>
    <input
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      ref="fileInput"
      class="hidden"
      @change="uploadFile($event)"
    >
  </div>
</template>

<script>
export default {
  name: 'InputTypeFile',
  props: {
    label: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
    },
    rules: {
      type: Array,
      required: false,
    },
    accept: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      value: '',
    };
  },
  methods: {
    uploadFile: function uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      console.log(files);
      this.value = '';
      this.files = [];

      this.value = [...files].map(file => file.name).join(', ');

      for (let i = 0; files[i]; i += 1) {
        this.files.push(files[i]);
      }

      this.$emit('input', this.files);
    },
    onFocus: function onFocus(refInput) {
      if (!this.disabled) {
        this.$refs[refInput].click();
      }
    },
  },
};
</script>

<style lang="sass" scoped>
  .hidden { display: none; }
</style>
