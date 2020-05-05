<template>
  <div id="app">
    <main>
      <section id="sw-wiki" class="wiki" v-bind:text="swText">
        {{swText}}
      </section>
      <section>
        <PlanetsSearch />
        <PlanetsList 
          v-bind:planets="SWPNames"
          v-on:selected="SWPSelected"/>
      </section>
      <section>
        <PlanetsList />
      </section>
      <section class="wiki">
        <p>
          Lorem ipsum dolor sit amet, consplanetectetur adipiscing elit. In cursus orci a lacinia gravida. Curabitur odio metus, porta in venenatis a, lobortis ac ante. Nullam sodales nec purus at laoreet. Quisque sollicitudin facilisis massa, ac rhoncus dolor faucibus nec. Vestibulum nec ante dapibus diam facilisis iaculis eu a augue. Quisque congue enim elit, eu faucibus ante laoreet a. Vestibulum vitae nunc id ex semper maximus. Phasellus sapien dui, iaculis facilisis nibh id, venenatis posuere risus. Donec vitae lectus tempor, rutrum eros nec, hendrerit enim. Proin eget congue est. Sed volutpat tempor eleifend. Vivamus quis leo vel mi volutpat sodales.
        </p>
      </section>

    </main>
  </div>
</template>

<script>
import PlanetsList from './components/PlanetsList.vue'
import PlanetsSearch from "./components/PlanetsSearch.vue";

export default {
  name: 'App',
  components: {
    PlanetsList,
    PlanetsSearch
  },
  data() {
    return {
      SWPlanets: [], // Full planet data
      SWPNames: ['loading'], // Just the names for the list.
      swText: "Hello"
    }
  },
  created() {
    this.getSWPlanets();
  },
  methods: {
    getSWPlanets: function() {
      // Get just the first page for now.
      fetch("http://swapi.dev/api/planets/?search=&page=1")
      .then(resp => {return resp.json()})
      .then(data => {
        this.SWPlanets = data.results;
        console.log(data.results)
        this.SWPNames = data.results.map(
          p => p.name
        );
      })
    },
    SWPSelected: function(name) {
      this.swText = name
    },
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

.wiki, .card {
  padding: 20px;
}

.card {
  border-bottom: 1px solid #F3F3F3;
}

.selected {
  background-color: #F3F3F3;
}

</style>
