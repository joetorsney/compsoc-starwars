<template>
  <div id="app">
    <main>
      <wiki-box msg="ST Wiki"/>
      <planets-box msg="ST Planets"/>
      <planets-box msg="NASA Planets"/>
      <wiki-box msg="NASA Wiki"/>
    </main>
  </div>
</template>

<script>
import PlanetsBox from './components/PlanetsBox.vue'
import WikiBox from './components/WikiBox.vue'

export default {
  name: 'App',
  components: {
    PlanetsBox,
    WikiBox
  }
}
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif
}

main {
  display: flex;
  flex-grow: 0;

  overflow-x: scroll;
  width: 100%;

  height: 100vh;
}

section {
  width: 450px;
  overflow-y: scroll;
}

</style>
