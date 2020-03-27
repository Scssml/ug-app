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
      <v-icon @click="deleteItem(props.item.id)" title="Удалить">
        delete
      </v-icon>
    </td>
  </tr>
</template>

<script>
import axios from "axios";
import Chrome from "vue-color/src/components/Chrome";

axios.defaults.baseURL = process.env.VUE_APP_API_PREFIX;

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
      if (this.showPicker) {
        this.updateItem({
          color: this.color.hex
        });
      }

      this.showPicker = false;
    },
    changeSortIndex(e) {
      this.updateItem({
        sortIndex: +e.target.value
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
      const { id } = this.props.item;

      return axios.put(`/goods/${id}`, data);
    },
  },
  mounted() {
    this.color = this.props.item.color;
  }
};
</script>

<style scoped></style>
