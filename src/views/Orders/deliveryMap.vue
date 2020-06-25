<template v-if="editedItem">
  <yandex-map
    :coords="editedItem.coordsMap"
    zoom="10"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    :controls="['trafficControl']"
    v-on:map-was-initialized="afterMapsLoaded"
    ref="yMaps"
  >
    <template v-for="(item, index) in points" v-if="points.length">
      <ymap-marker :key="index" :marker-id="`editedItemId-${item.id}`" :coords="item.coordinates" />
    </template>
  </yandex-map>
</template>

<script>
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

export default {
  name: 'deliveryMap',
  components: {
    yandexMap,
    ymapMarker,
  },
  props: {
    // ordersList: {
    //   type: Array,
    //   required: true,
    // },
    deliveryTimeOfDayList: {
      type: Array,
      required: true,
    },
    editedItem: {
      type: Object,
    },
    zones: {
      type: Array,
    },
    placemarks: {
      type: Array,
    },
  },
  data() {
    return {
      coordsMap: [53.05, 50.101783],
    };
  },
  beforeUpdate() {
    if (this.$refs.yMaps) {
      this.$refs.yMaps.myMap.geoObjects.removeAll();
    }
  },
  updated() {
    if (this.$refs.yMaps) {
      setTimeout(() => {
        this.drawZones(this.zones, this.$refs.yMaps, window.ymaps);
      });
    }
  },
  computed: {
    points() {
      return [...this.placemarks, this.editedItem];
    },
  },
  methods: {
    getDeliveryZones() {
      this.$store.dispatch('getDeliveryZones').then((zones) => {
        this.drawZones(zones, this.$refs.yMaps, window.ymaps);
      });
    },
    drawZones(zones, yMapsComponent, ymaps) {
      zones.forEach((d) => {
        yMapsComponent.myMap.geoObjects.add(new ymaps.GeoObject(
          {
            geometry: {
              type: 'Polygon',
              coordinates: d.coordinates,
              fillRule: 'nonZero',
            },
          },
          {
            fillColor: d.color,
            opacity: 0.3,
          },
        ));
      });
    },
    afterMapsLoaded() {
      this.getDeliveryZones();
    },
  },
};
</script>
