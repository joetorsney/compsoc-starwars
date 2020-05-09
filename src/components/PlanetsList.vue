<template>
  <div>
    <div v-bind:key="p" v-for="p in planets">
      <div @click="$emit('selected', p)" class="card">
        <h2>{{p}}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "PlanetsList",
    props: ["planets"],
}
</script>

<style scoped>
.card:hover,  .selected {
  background-color: lightgrey;
}
</style>