<template>
  <div class="autocomplete">
    <v-text-field
      label="Адрес"
      :value="address"
      hide-details
      class="mb-4"
      :rules="[v => !!v || 'Заполните поле']"
      :readonly="readonly"
      placeholder="Введите местоположение"
      @input="getAddress($event)"
    ></v-text-field>
    <template v-if="objectList.length > 0">
      <div class="autocomplete__result">
        <template v-for="(item, index) in objectList">
          <a
            :key="index"
            @click.prevent="setAddress(item)"
          >{{ item.name }}</a>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AutocompleteAddressYandex',
  props: {
    value: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      address: '',
      objectList: [],
    };
  },
  watch: {
    value(newVal) {
      if (newVal !== this.address) {
        this.getAddress(this.value);
      }
    },
  },
  methods: {
    getAddress(value) {
      this.objectList = [];
      this.address = value;

      const myGeocoder = ymapsGeo.geocode(value, {
        json: true,
        boundedBy: [
          [52.9516, 49.6254],
          [53.5152, 50.7515],
        ],
      });

      myGeocoder.then((res) => {
        this.objectList = res.GeoObjectCollection.featureMember.map((item) => {
          const object = {
            name: `${item.GeoObject.description}, ${item.GeoObject.name}`,
            coords: item.GeoObject.Point.pos.split(' ').reverse(),
          };
          return object;
        });

        this.objectList.push({
          name: 'Ничего не подошло',
          coords: [],
        });
      });
    },
    setAddress(object) {
      if (object.coords.length === 2) {
        this.address = object.name;
      }

      const addressName = this.address;

      this.$emit('change', {
        address: addressName,
        geo: object.coords,
      });

      this.objectList = [];
    },
  },
  created() {
    this.address = (this.value.length > 0) ? this.value : '';
  },
};
</script>

<style lang="scss">
  .autocomplete {
    position: relative;

    &__result {
      position: absolute;
      width: 100%;
      margin-top: -20px;
      border: 1px solid #ccc;
      box-shadow: 1px 1px 5px rgba(0,0,0,.2);
      background: #fff;
      z-index: 999;

      a {
        display: block;
        color: #000;
        border-bottom: 1px dotted #ccc;
        padding: 5px;
        transition: background-color .25s ease-in-out;

        &:hover,
        &:focus {
          background-color: #ccc;
        }
      }
    }
  }
</style>
