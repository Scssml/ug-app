<template>
  <v-text-field
    label="Адрес"
    v-model="address"
    hide-details
    class="mb-4"
    :rules="[v => !!v || 'Заполните поле']"
    :readonly="readonly"
    ref="autocomplete"
    placeholder="Введите местоположение"
  ></v-text-field>
</template>

<script>
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
    };
  },
  created() {
    this.address = this.value;
  },
  mounted() {
    const ref = this.$refs.autocomplete.$refs.input;
    this.autocomplete = new google.maps.places.Autocomplete(ref, { types: ['address'] });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      const address = place.address_components;
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

        this.address = `${locationInfo.city}, ${locationInfo.street} ${locationInfo.streetNumber}`;
        this.$emit('change', {
          address: this.address,
          geo: locationInfo.geo,
        });
      }
    });
  },
};
</script>
