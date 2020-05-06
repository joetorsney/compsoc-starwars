<template>
  <div id="app">
    <main>
      <section id="sw-wiki" class="wiki" v-bind:data="swWikiData">
        <h1>{{swWikiData.name}}</h1>
        <p>
        Climate: {{swWikiData.climate}} <br>
        Terrain: {{swWikiData.terrain}} <br>
        Popliation: {{swWikiData.population}} <br>
        Diameter: {{swWikiData.diameter}} <br>
        Gravity: {{swWikiData.gravity}} <br>
        Orbital Period: {{swWikiData.orbital_period}} <br>
        Rotation Period: {{swWikiData.rotation_period}} <br>
        </p>
        
      </section>
      <section>
        <PlanetsSearch />
        <PlanetsList 
          v-bind:planets="swNames"
          v-on:selected="swChangeWiki"/>
      </section>
      <section>
        <PlanetsList />
      </section>
      <section class="wiki">
      </section>

    </main>
  </div>
</template>

<script>
import PlanetsList from './components/PlanetsList.vue'
import PlanetsSearch from "./components/PlanetsSearch.vue";
import { loadNasaData } from "./planetlib.js"

export default {
  name: 'App',
  components: {
    PlanetsList,
    PlanetsSearch
  },
  data() {
    return {
      swPlanets: [], // Full planet data
      swNames: ['Planets loading...'], // Just the names for the list.
      swWikiData: "Hello"
    }
  },
  created() {
    this.getSWPlanets();
    loadNasaData();
  },
  methods: {
    getSWPlanets: function() {
      // Get just the first page for now.
      fetch("http://swapi.dev/api/planets/?search=&page=1")
      .then(resp => {return resp.json()})
      .then(data => {
        this.swPlanets = data.results;
        this.swNames = data.results.map(
          p => p.name
        );
      })
    },
    swChangeWiki: function(name) {
      this.swWikiData = this.swPlanets.filter(p => p.name == name)[0]
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

.wiki li {
  list-style: none;
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
