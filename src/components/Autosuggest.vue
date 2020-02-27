<template>
  <div class="autosuggest-container">
    <vue-autosuggest
      :suggestions="suggestions"
      :input-props="{
        id: 'autosuggest__input',
        placeholder: placeholder
      }"
      :get-suggestion-value="getSuggestionValue"
      :value="value"
      @input="onInputChange"
      @selected="onSelected"
    >
      <template slot-scope="suggestion">
        <slot v-bind="suggestion">
          <span>{{ suggestion.suggestion.item.name }}</span>
        </slot>
      </template>
    </vue-autosuggest>
  </div>
</template>

<script>
  import { VueAutosuggest } from "vue-autosuggest";

export default {
  name: "Autosuggest",
  components: {
    'vue-autosuggest': VueAutosuggest
  },
  props: {
    suggestions: {
      type: Array,
      required: true
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  methods: {
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
    onInputChange(text) {
      this.$emit("onChange", text);
    },
    onSelected({ item }) {
      this.$emit("onSelect", item);
    }
  }
};
</script>

<style>
#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  padding: 3px;
  text-indent: 8px;
  width: 100%;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  /*border: 1px solid #e0e0e0;*/
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  background: white;
  padding: 0px;
  overflow-y: auto;
  max-height: 200px;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: black;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results-item {
  padding: 5px;
}

.autosuggest__results-item:hover {
  background-color: #e0e0e0;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #ddd;
}
</style>
