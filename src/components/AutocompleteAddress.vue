<template>
  <v-text-field
    label="Адрес"
    :value="address"
    hide-details
    class="mb-4"
    :rules="[v => !!v || 'Заполните поле']"
    :readonly="readonly"
    ref="autocomplete"
    placeholder="Введите местоположение"
    @input="setPrefix($event)"
  ></v-text-field>
</template>

<script>
import _throttle from 'lodash/throttle';

export default {
  name: 'AutocompleteAddress',
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
      autocomplete: null,
      bounds: null,
    };
  },
  watch: {
    value: function(val, oldVal) {
      this.address = (val.length > 0) ? val : '';
    },
  },
  methods: {
    setPrefix(value) {
      // const address = value.replace('г. Самара, ', '');
      // this.address = `г. Самара, ${address}`;

      const address = value;
      this.address = `${address}`;

      this.$emit('change', {
        address: this.address,
        geo: [],
      });
    },
    handlePlaceChange() {
      const place = this.autocomplete.getPlace();
      const address = place.address_components;
      if (!place.geometry) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const locationInfo = {
        country: null,
        state: null,
        city: null,
        postalCode: null,
        street: null,
        streetNumber: null,
        geo: [lat, lng],
      };

      if (place.address_components !== undefined) {
        for (let i = 0; i < address.length; i += 1) {
          const component = address[i].types[0];
          switch (component) {
            case 'country':
              locationInfo.country = address[i].long_name;
              break;
            case 'administrative_area_level_1':
              locationInfo.state = address[i].long_name;
              break;
            case 'locality':
              locationInfo.city = address[i].long_name;
              break;
            case 'postal_code':
              locationInfo.postalCode = address[i].long_name;
              break;
            case 'route':
              locationInfo.street = address[i].short_name;
              break;
            case 'street_number':
              locationInfo.streetNumber = address[i].long_name;
              break;
            default:
              break;
          }
        }

        this.address = `г. ${locationInfo.city}, ${locationInfo.street} ${locationInfo.streetNumber}`;
        this.$emit('change', {
          address: this.address,
          geo: locationInfo.geo,
        });
      }
    },
  },
  created() {
    this.address = (this.value.length > 0) ? this.value : '';
  },
  mounted() {
    this.bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(50.00615400000004, 50.39000009999995),
      new google.maps.LatLng(53.090497, 53.43131899999999),
    );

    const ref = this.$refs.autocomplete.$refs.input;
    this.autocomplete = new google.maps.places.Autocomplete(
      ref,
      {
        bounds: this.bounds,
        types: ['address'],
        // types: ['geocode'],
        componentRestrictions: {
          country: 'ru',
        },
      },
    );

    this.autocomplete.addListener('place_changed', _throttle(this.handlePlaceChange, 1000));
  },
};
</script>
