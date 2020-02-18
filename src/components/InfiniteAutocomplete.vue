<template>
  <v-autocomplete
    id="mytestcomponent"
    :item-text="itemText"
    :item-value="itemValue"
    class="mb-4 scs-small"
    :items="items"
    label="Клиент"
    hide-details
    solo
    flat
    @change="handleChange"
  />
</template>

<script>
const autocompleteMenuSelector = ".v-autocomplete__content";

export default {
  props: {
    hasMore: Boolean,
    items: Array,
    itemText: String,
    itemValue: String
  },
  methods: {
    handleChange(event) {
      this.$emit("onChange", event);
    },
    handleScroll(event) {
      const element = event.target;

      if (
        Math.round(element.scrollHeight - element.scrollTop) <=
        element.clientHeight + 100
      ) {
        element.scrollTop -= 100;
        this.handleEndOfItemsList(event);
      }
    },
    handleEndOfItemsList(event) {
      if (this.hasMore) {
        this.$emit("needMore");
      }
    }
  },
  mounted() {
    const element = document.querySelectorAll(autocompleteMenuSelector)[0];

    element.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    const element = document.querySelectorAll(autocompleteMenuSelector)[0];

    element.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
