<template>
  <div>
    <div v-bind:key="p.name" v-for="p in planets">
      <div @click="$emit('selected', p.name)" class="card">
        <h3>{{p.name}}</h3>
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
.card:hover, .selected {
  background-color: #f3f3f3;
}
</style>