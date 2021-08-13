<template>
  <tr>
    <td>
      <v-text-field
        label="Склад"
        solo
        flat
        hide-details
        :value="+props.item.stock + +props.item.count"
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
        :value="props.item.name"
        class="scs-small"
        @change="changeProps('name', $event)"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Сортировка"
        solo
        flat
        hide-details
        :value="props.item.sort_index"
        class="scs-small"
        @change="changeProps('sort_index', +$event)"
      ></v-text-field>
    </td>
    <td>
      <v-text-field
        label="Цена"
        solo
        flat
        hide-details
        type="number"
        :value="props.item.price"
        @input="handleItemChange(props.item.id, 'price', +$event)"
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
        @input="handleItemChange(props.item.id, 'count', +$event)"
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
      <ChromePicker
        v-model="color"
        v-if="showPicker"
        v-click-outside="changeColor"
      />
    </td>
    <td class="text-xs-right">
      <!-- <v-icon
        @click="deleteItem(props.item.id)"
        title="Удалить"
        v-if="+props.item.stock === 0"
      >
        delete
      </v-icon> -->
    </td>
  </tr>
</template>

<script>
import axios from 'axios';
import ChromePicker from 'vue-color/src/components/Chrome.vue';

export default {
  name: 'ListItem',
  props: {
    props: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data: () => ({
    color: '#FFF',
    showPicker: false,
  }),
  components: {
    ChromePicker,
  },
  methods: {
    changeProps(code, value) {
      const propsItem = Object.assign({}, this.props.item);
      const url = `goods/${propsItem.id}`;

      delete propsItem.id;
      delete propsItem.count;

      propsItem[code] = value;

      axios
        .post(url, propsItem)
        .then((response) => {
          const { count, oldPrice } = this.props.item;
          this.props.item = response.data;
          this.props.item.count = count;
          this.props.item.oldPrice = oldPrice;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleItemChange(id, code, value) {
      this.$emit('onChange', { id, code, value });
    },
    handleColorPickerButtonClick() {
      this.showPicker = true;
    },
    changeColor() {
      if (this.showPicker && this.color.hex) {
        this.changeProps('color', this.color.hex);
      }

      this.showPicker = false;
    },
    deleteItem(id) {
      this.$emit('deleteItem', id);
    },
  },
  mounted() {
    this.color = this.props.item.color;
  },
};
</script>

<style scoped></style>
