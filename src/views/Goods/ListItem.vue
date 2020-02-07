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
    <td class="text-xs-right" style="width: 7%;">
      <v-icon
        @click="deleteItem(props.item.id)"
        title="Удалить"
      >
        delete
      </v-icon>
    </td>
  </tr>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListItem',
  props: ['props', 'exelCalc'],
  methods: {
    changeSortIndex(e) {
      const { id } = this.props.item;

      axios
        .put(`/goods/${id}`, {
          sortIndex: +e.target.value
        })
        .then(() => {});
    },
    handleItemChange(prop) {
      return e => {
        const { value } = e.target;

        if(value) {
          this.$emit("onChange", { id: this.props.item.id, value, prop });
        }
      };
    },
    deleteItem(id) {
      this.$emit('deleteItem', id);
    },
  }
};
</script>

<style scoped></style>
