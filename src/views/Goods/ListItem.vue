<template>
  <tr>
    <td>
      <v-text-field
        label="Склад"
        solo
        flat
        hide-details
        :value="+props.item.stockBalance + +props.item.count"
        class="scs-small"
        readonly
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Название"
        solo
        flat
        hide-details
        v-model="props.item.name"
        class="scs-small"
        @blur="changeName"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Сортировка"
        solo
        flat
        hide-details
        v-model="props.item.sortIndex"
        class="scs-small"
        @blur="changeSortIndex"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Цена"
        solo
        flat
        hide-details
        type="number"
        v-model="props.item.price"
        @keyup="handleItemChange('price')($event)"
        class="scs-small"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Кол-во"
        solo
        flat
        hide-details
        type="text"
        :value="props.item.count"
        @keyup="handleItemChange('count')($event)"
        class="scs-small"
      ></v-text-field>
    </td>
    <td>
      <v-icon
        title="Выбрать цвет"
        v-if="!showPicker && $store.getters.getAuthUserGroup.code === 'admin'"
        @click="handleColorPickerButtonClick"
      >
        color_lens
      </v-icon>
      <chrome-picker
        v-model="color"
        v-if="showPicker"
        v-click-outside="handleClickOutsidePicker"
      />
    </td>
    <td class="text-xs-right" style="width: 7%;">
      <v-icon
        @click="deleteItem(props.item.id)"
        title="Удалить"
        v-if="+props.item.stockBalance === 0"
      >
        delete
      </v-icon>
    </td>
  </tr>
</template>

<script>
import gql from "graphql-tag";
import Chrome from "vue-color/src/components/Chrome";

export default {
  name: "ListItem",
  props: ["props", "exelCalc"],
  data: () => ({
    color: "#FFF",
    showPicker: false
  }),
  components: {
    "chrome-picker": Chrome
  },
  methods: {
    handleColorPickerButtonClick() {
      this.showPicker = true;
    },
    handleClickOutsidePicker() {
      if (this.showPicker && this.color.hex) {
        this.$apollo.mutate({
          mutation: gql`mutation {
            updateGood(input: {
              id: ${this.props.item.id}
              color: "${this.color.hex}"
            }) {
              id
            }
          }`,
        }).then(() => {
          console.log('success');
        }).catch((error) => {
          console.error(error);
        });
      }

      this.showPicker = false;
    },
    changeSortIndex(e) {
      this.$apollo.mutate({
        mutation: gql`mutation {
          updateGood(input: {
            id: ${this.props.item.id}
            sortIndex: ${+e.target.value}
          }) {
            id
          }
        }`,
      }).then(() => {
        console.log('success');
      }).catch((error) => {
        console.error(error);
      });
    },
    changeName(e) {
      this.$apollo.mutate({
        mutation: gql`mutation {
          updateGood(input: {
            id: ${this.props.item.id}
            name: "${e.target.value}"
          }) {
            id
          }
        }`,
      }).then(() => {
        console.log('success');
      }).catch((error) => {
        console.error(error);
      });
    },
    handleItemChange(prop) {
      return e => {
        const { value } = e.target;

        if (value) {
          this.$emit("onChange", { id: this.props.item.id, value, prop });
        }
      };
    },
    deleteItem(id) {
      this.$emit("deleteItem", id);
    },
    updateItem(data) {
      let props = {
        id: this.props.item.id,
      };

      props = Object.assign(props, data);

      this.$apollo.mutate({
        mutation: gql`mutation (
          $props: UpdateGood!
        ) {
          updateGood(input: $props) {
            id
          }
        }`,
        variables: {
          props,
        },
      }).then(() => {
        console.log('success');
      }).catch((error) => {
        console.error(error);
      });
    },
  },
  mounted() {
    this.color = this.props.item.color;
  }
};
</script>

<style scoped></style>
