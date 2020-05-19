<template>
  <v-card>
    <v-alert
      :value="createdSuccess"
      type="success"
      class="my-0"
    >Оплата изменена</v-alert>
    <v-form
      ref="form"
      lazy-validation
      v-if="!loading"
    >
      <v-card-title
        class="px-4"
      >
        <span class="headline">Просмотр оплаты №{{ id }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="px-4"
      >
        <v-text-field
          label="Дата"
          :value="editedItem.created_at"
          readonly
        ></v-text-field>
        <v-text-field
          label="Клиент"
          :value="`${editedItem.client.name} (${editedItem.client.phone})`"
          readonly
        ></v-text-field>
        <v-text-field
          label="Стоимость"
          :value="editedItem.amount"
          readonly
        ></v-text-field>
        <v-text-field
          label="Тип оплаты"
          :value="editedItem.paymentType.name"
          readonly
        ></v-text-field>
        <v-text-field
          v-if="editedItem.parent && editedItem.paymentType.id === 7"
          label="Предыдущая оплата"
          :value="editedItem.parent.name"
          readonly
        ></v-text-field>
        <v-text-field
          v-if="editedItem.parent && editedItem.paymentType.id === 7"
          label="Дата предыдущей оплаты"
          :value="editedItem.parent.created_at"
          readonly
        ></v-text-field>
        <v-textarea
          label="Комментарий"
          auto-grow
          :value="editedItem.description"
          row-height="12"
          readonly
        ></v-textarea>
      </v-card-text>
      <v-card-actions
        class="px-4 pb-4"
      >
        <v-btn
          @click.native="cancel()"
        >Отмена</v-btn>
        <!-- <v-spacer></v-spacer>
        <v-btn
          color="info"
          @click="submitForm"
        >Сохранить</v-btn> -->
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import format from "date-fns/format";
import { ru } from "date-fns/locale";

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      editedItem: {},
      createdSuccess: false,
    };
  },
  apollo: {
    paymentsList: {
      query: gql`
        query paymentsList(
          $id: bigint
        ) {
          paymentsList: payments(
            where: {
              id: { _eq: $id }
            }
          ) {
            id
            created_at
            client {
              name
              phone
            }
            amount
            paymentType {
              id
              name
            }
            description
            paymentTypeBeforeReturn {
              created_at
              name
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id,
        };
      },
      update({ paymentsList }) {
        this.editedItem = paymentsList.shift();
        this.editedItem.created_at = this.formatDate(this.editedItem.created_at, 'dd.MM.yyyy HH:mm:ss');
        if (this.editedItem.parent) {
          this.editedItem.parent.created_at = this.formatDate(this.editedItem.parent.created_at, 'dd.MM.yyyy HH:mm:ss');
        }
        this.loading = false;
      },
    },
  },
  methods: {
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat, { locale: ru });
    },
    // getItem() {
    //   if (this.id) {
    //     const itemParams = {
    //       type: 'payments',
    //       id: this.id,
    //     };

    //     this.$store.dispatch('getItem', itemParams).then((response) => {
    //       this.editedItem = response;
    //       this.loading = false;
    //     }).catch(() => {
    //       console.log('error');
    //     });
    //   }
    // },
    cancel() {
      this.editedItem = {};
      this.createdSuccess = false;
      this.$emit('cancel');
    },
    submitForm() {
      const validate = this.$refs.form.validate();
      if (validate) {
        const propsItem = Object.assign({}, this.editedItem);
        delete propsItem.id;

        const itemParams = {
          type: 'payments',
          id: this.id,
          props: propsItem,
        };

        this.$store.dispatch('updateItem', itemParams).then(() => {
          this.createdSuccess = true;
          setTimeout(() => {
            this.$emit('cancel');
          }, 1000);
        });
      }
    },
  },
  mounted() {
    // this.getItem();
  },
};
</script>
