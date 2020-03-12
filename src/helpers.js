import arrayToObject from 'vuex-map-fields/src/lib/array-to-object';

export function mapDynamicFields(prefix, fields, dynamicIndex) {
  const fieldsObject = arrayToObject(fields.map(field => `${prefix}.${field}`));
  return Object.keys(fieldsObject).reduce((prev, key) => {
    prev[key] = {
      get() {
        // 'this' refer to vue component
        const path = fieldsObject[key].replace('[]', `[${this[dynamicIndex]}]`);
        return this.$store.getters[`getField`](path);
      },
      set(value) {
        // 'this' refer to vue component
        const path = fieldsObject[key].replace('[]', `[${this[dynamicIndex]}]`);
        this.$store.commit(`updateField`, { path, value });
      },
    };
    return prev;
  }, {});
}
