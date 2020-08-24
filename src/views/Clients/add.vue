<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Клиент добавлен</v-alert>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Добавление клиента</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-select
          label="Тип клиента"
          :items="typeClient"
          :rules="[v => !!v || 'Заполните поле']"
          item-text="name"
          item-value="id"
          v-model="editedItem.typeId"
          hide-details
          class="mb-4"
        ></v-select>
        <v-text-field
          label="Имя"
          :rules="[v => !!v || 'Заполните поле']"
          v-model="editedItem.name"
        ></v-text-field>
        <v-text-field
          label="Телефон"
          v-model="editedItem.phone"
        ></v-text-field>
        <v-autocomplete
          label="Организация"
          :items="clientsList"
          :filter="clientsFilter"
          item-text="name"
          item-value="id"
          v-model.number="editedItem.referenceId"
          hide-details
          class="mb-4"
          no-data-text="Не надено"
          clearable
          v-if="editedItem.typeId === 2"
        ></v-autocomplete>
        <v-text-field
          label="Адрес"
          v-model="editedItem.address"
        ></v-text-field>
        <v-text-field
          label="Подъезд"
          v-model="editedItem.entrance"
        ></v-text-field>
        <v-text-field
          label="Квартира"
          v-model="editedItem.flat"
        ></v-text-field>
        <v-text-field
          label="Этаж"
          v-model="editedItem.floor"
        ></v-text-field>
        <v-menu
          :close-on-content-click="false"
          v-model="dataPicker"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
          class="mb-4"
        >
          <v-text-field
            slot="activator"
            label="День рождения"
            v-model="editedItem.birthDay"
            prepend-icon="event"
            hide-details
            readonly
            :rules="[v => !!v || 'Заполните поле']"
            clearable
          ></v-text-field>
          <v-date-picker
            v-model="editedItem.birthDay"
            @input="dataPicker = false"
            no-title
            scrollable
            locale="ru-ru"
            first-day-of-week="1"
          ></v-date-picker>
        </v-menu>
        <v-text-field
          label="Счет"
          v-model.number="editedItem.bill"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Лимит"
          v-model.number="editedItem.limit"
          type="number"
        ></v-text-field>
        <v-text-field
          label="Скидка"
          v-model.number="editedItem.sale"
          type="number"
        ></v-text-field>
        <!-- <v-checkbox
          label="Активность"
          v-model="editedItem.isActive"
          color="primary"
        ></v-checkbox> -->
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  data() {
    return {
      dataPicker: false,
      editedItem: {
        name: '',
        birthDay: null,
        bill: 0,
        limit: 0,
        sale: 0,
        phone: '',
        typeId: 0,
        address: '',
        entrance: '',
        flat: '',
        floor: '',
        referenceId: null,
      },
      typeClient: [],
      createdSuccess: false,
      clientsList: [],
    };
  },
  apollo: {
    clientsList: {
      query: gql`
        query clientsList(
          $id: bigint
        ) {
          clientsList: clients(
            where: {
              typeId: { _eq: 2 }
              deleted_at: { _is_null: true }
            }
          ) {
            id
            name
            phone
          }
        }
      `,
    },
    typeClient: {
      query: gql`
        query {
          typeClient: clientTypes(where: { active: { _eq: true } }) {
            id
            name
          }
        }
      `,
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsClient = Object.assign({}, this.editedItem);

        this.$apollo.mutate({
          mutation: gql`mutation {
            createClient(input:{
              address: "${propsClient.address}"
              entrance: "${propsClient.entrance}"
              flat: "${propsClient.flat}"
              floor: "${propsClient.floor}"
              limit: ${propsClient.limit}
              name: "${propsClient.name}"
              phone: "${propsClient.phone}"
              referenceId: ${propsClient.referenceId}
              sale: ${propsClient.sale}
              typeId: ${propsClient.typeId}
              bill: ${propsClient.bill}
              birthDay: "${this.formatDate(propsClient.birthDay, 'yyyy-MM-dd')}T00:00:00Z"
            }) {
              id
            }
          }`,
        }).then(() => {
          this.createdSuccess = true;

          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        }).catch((error) => {
          console.error(error);
        });
      }
    },
    clientsFilter(item, queryText) {
      const textOne = item.name.toLowerCase();
      const textTwo = item.phone.replace(/[^0-9]/gim, '');
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1;
    },
  },
};
</script>
