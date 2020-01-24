<template>
  <v-card class="order">
    <v-card-title
      class="px-2 py-1"
    >
      <span class="headline" style="margin: 0 auto;">Заказ №{{ order.id }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text
      class="px-2 pt-0"
    >
      <yandex-map
        :coords="order.coordinates"
        zoom="10"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        :controls="['trafficControl']"
        ref="yMaps"
      >
        <ymap-marker marker-id="editedItemId" :coords="order.coordinates" />
      </yandex-map>
    </v-card-text>
    <v-card-actions
      class="px-4 py-2"
    >
      <v-btn
        @click="cancel()"
      >Отмена</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  components: {
    yandexMap,
    ymapMarker,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.comment = '';
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
  .order.v-card {
    position: relative;
  }
  .order .v-card__title {
    background: #fff;
    position: relative;
    z-index: 2;
    border-bottom: 1px solid rgba(0,0,0,.12);
  }
  .order .v-card__text {
    padding-bottom: 52px;
  }
  .order .v-card__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 5px;
    z-index: 2;
  }
</style>
