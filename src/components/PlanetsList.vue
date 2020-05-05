<template>
  <div>
    <div v-bind:key="p.name" v-for="p in planets">
      <div @click="selected(p)" class="card">
        <h3>{{p.name}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "PlanetsList",
    props: ["planets"],
    methods: {
      selected: function(p) {
        console.log(p)
        this.$parent.selected(p)
      }
    }
}
</script>

<style scoped>
.card:hover {
  background-color: #f3f3f3;
}
</style>