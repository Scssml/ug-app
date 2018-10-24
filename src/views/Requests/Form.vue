<template>
  <v-container grid-list-lg fluid>
    <h1 class="display-1 text-xs-center">{{ nameForm }}</h1>
    <v-form ref="form" lazy-validation>
      <v-layout row wrap>
        <template v-for="(prop, index) in formProps">
          <v-flex
            xs4
            :key="index"
          >
            <template v-if="prop.type === 'text'">
              <v-text-field
                :label="prop.title"
                :hint="prop.description"
                persistent-hint
                :required="prop.required"
                :rules="prop.rules"
                v-model="prop.value"
              ></v-text-field>
            </template>

            <template v-if="prop.type === 'select'">
              <v-select
                :label="prop.title"
                :hint="prop.description"
                persistent-hint
                :items="prop.items"
                :multiple="prop.multiple"
                :required="prop.required"
                :rules="prop.rules"
                v-model="prop.value"
              ></v-select>
            </template>

            <template v-if="prop.type === 'textarea'">
              <v-textarea
                :label="prop.title"
                :hint="prop.description"
                persistent-hint
                auto-grow
                :required="prop.required"
                :rules="prop.rules"
                v-model="prop.value"
              ></v-textarea>
            </template>

            <template v-if="prop.type === 'radio'">
              <v-radio-group
                v-model="prop.value"
                :hint="prop.description"
                persistent-hint
              >
                <v-radio
                  v-for="(item, n) in prop.items"
                  :key="n"
                  :label="item.label"
                  :value="item.value"
                  ripple
                  color="primary"
                ></v-radio>
              </v-radio-group>
            </template>

            <template v-if="prop.type === 'checkbox'">
              <v-checkbox
                v-for="(item, n) in prop.items"
                :key="n"
                :label="item.label"
                :value="item.value"
                :hint="item.description"
                persistent-hint
                ripple
                color="primary"
                v-model="prop.value"
              ></v-checkbox>
            </template>

            <template v-if="prop.type === 'file'">
              <input-type-file
                :label="prop.title"
                :hint="prop.description"
                :required="prop.required"
                :rules="prop.rules"
                :accept="prop.accept"
                :multiple="prop.multiple"
                :disabled="false"
                v-model="prop.value"
              >
              </input-type-file>
            </template>
          </v-flex>
        </template>
      </v-layout>

      <v-divider class="my-4"></v-divider>

      <v-btn
        color="primary"
        ripple
        @click="submitForm"
      >
        Отправить
      </v-btn>
      <v-btn
        to="/requests/"
        color="grey lighten-3"
        ripple
      >Отмена</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import InputTypeFile from '../../components/InputTypeFile.vue';

export default {
  name: 'Form',
  components: {
    'input-type-file': InputTypeFile,
  },
  data() {
    return {
      nameForm: 'Заявка на ТП',
      formProps: [
        {
          title: 'Поле 1',
          description: 'Описание',
          type: 'text',
          value: null,
          required: true,
          rules: [v => !!v || 'Заполните поле'],
        },
        {
          title: 'Поле 2',
          description: 'Описание',
          type: 'select',
          items: [
            'Значение 1',
            'Значение 2',
            'Значение 3',
            'Значение 4',
            'Значение 5',
          ],
          value: null,
          required: true,
          rules: [v => !!v || 'Заполните поле'],
          multiple: false,
        },
        {
          title: 'Поле 3',
          description: 'Описание',
          type: 'select',
          items: [
            'Значение 1',
            'Значение 2',
            'Значение 3',
            'Значение 4',
            'Значение 5',
          ],
          value: [],
          required: true,
          rules: [v => !!v.length || 'Заполните поле'],
          multiple: true,
        },
        {
          title: 'Поле 4',
          description: 'Описание',
          type: 'textarea',
          value: [],
          required: true,
          rules: [v => !!v.length || 'Заполните поле'],
        },
        {
          title: 'Поле 5',
          description: 'Описание',
          type: 'radio',
          items: [
            {
              label: 'Значение 1',
              value: 1,
            },
            {
              label: 'Значение 2',
              value: 2,
            },
            {
              label: 'Значение 3',
              value: 3,
            },
            {
              label: 'Значение 4',
              value: 4,
            },
          ],
          value: null,
          required: true,
          rules: [v => !!v.length || 'Заполните поле'],
        },
        {
          title: 'Поле 6',
          type: 'checkbox',
          items: [
            {
              label: 'Значение 1',
              value: 1,
              description: 'Описание',
            },
            {
              label: 'Значение 2',
              value: 2,
              description: '',
            },
            {
              label: 'Значение 3',
              value: 3,
              description: '',
            },
          ],
          value: [],
        },
        {
          title: 'Поле 7',
          type: 'checkbox',
          items: [
            {
              label: 'Значение 1',
              value: 1,
              description: 'Описание',
            },
          ],
          value: [],
        },
        {
          title: 'Поле 7',
          description: 'Описание',
          type: 'file',
          value: null,
          required: true,
          rules: [v => !!v || 'Заполните поле'],
          multiple: true,
          accept: '*',
        },
      ],
    };
  },
  methods: {
    submitForm: function submitForm() {
      this.$refs.form.validate();
    },
    uploadFile: function uploadFile(index, e) {
      const files = e.target.files || e.dataTransfer.files;
      console.log(files);
      this.formProps[index].value = [];
      this.formProps[index].files = [];

      this.formProps[index].value = [...files].map(file => file.name).join(', ');

      for (let i = 0; files[i]; i += 1) {
        this.formProps[index].files.push(files[i]);
      }
    },
    onFocus: function onFocus(refInput) {
      if (!this.disabled) {
        this.$refs[refInput][0].click();
      }
    },
  },
};
</script>
