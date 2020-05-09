<template>
  <div id="app">
    <main>
      <section id="sw-wiki" class="wiki" v-bind:data="swWikiData">
        <h1>{{swWikiData.name}}</h1>
        <p>
        Climate: <span>{{swWikiData.climate}}</span> <br>
        Terrain: <span>{{swWikiData.terrain}}</span> <br>
        Popliation: <span>{{swWikiData.population}}</span> <br>
        Diameter: <span>{{swWikiData.diameter}}</span> <br>
        Gravity: <span>{{swWikiData.gravity}}</span> <br>
        Orbital Period: <span>{{swWikiData.orbital_period}}</span> <br>
        Rotation Period: <span>{{swWikiData.rotation_period}}</span> <br>
        </p>
        
      </section>
      <section>
        <PlanetsSearch />
        <PlanetsList 
          v-bind:planets="swNames"
          v-on:selected="swChangeWiki"/>
      </section>
      <section>
        <PlanetsList 
          v-bind:planets="exoNames"
          v-on:selected="exoChangeWiki"/>
      </section>
      <section class="wiki">
        <h1>{{exoWikiData[0]}}</h1>
        Discovery Method: <span>{{exoWikiData[1]}}</span><br>
        Number of planets in system: <span>{{exoWikiData[2]}}</span><br>
        Orbital Period (years): <span>{{exoWikiData[3]}}</span><br>
        Planet Mass (Jupiters): <span>{{exoWikiData[7]}}</span><br>
        Planet Radius (Jupiters): <span>{{exoWikiData[8]}}</span><br>
        Distance from Earth (parsecs): <span>{{exoWikiData[9]}}</span><br>
        Star Effective Temperature (K): <span>{{exoWikiData[10]}}</span> <br>
        Discovery Date: <span>{{exoWikiData[11]}}</span> <br>
        Discovery Facility <span>{{exoWikiData[12]}}</span> <br><br>
        More Information: <br> 
        <a v-bind:href="exoWikiData[13]">Exoplanet Catalog</a> <br> 
        <a v-bind:href="exoWikiData[14]">Exoplanet Data Visualiser</a> <br> 
      </section>

    </main>
  </div>
</template>

<script>
import Papa from 'papaparse';
// import numjs from 'numjs';

import PlanetsList from './components/PlanetsList.vue'
import PlanetsSearch from "./components/PlanetsSearch.vue";
import { nasaurl, buildExoMatrix, swPlanetToArray, matchPlanets } from "./planetlib.js"

export default {
  name: 'App',
  components: {
    PlanetsList,
    PlanetsSearch
  },
  data() {
    return {
      swPlanets: [], // Full Star Wars planet data
      swNames: ['Planets loading...'], // List of names to display.
      swWikiData: "", // Data to be displayed in the sw wiki.
      exoplanets: [], // Full exoplanet data
      exoNames: ['Exoplanets loading...'], // List of names to display
      exoWikiData: "", // Data to be displayed in the exoplanet wiki.
      exoMatrix: null // A matrix of numeric data for the exoplanets.
    }
  },

  created() {
    this.getSWPlanets();
    this.getExoplanets();
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
    getExoplanets: function() {
      Papa.parse(nasaurl, {
        download: true,
        complete: (results) => {
          this.gotExoplanets(results.data);
        }
      });
    },
    gotExoplanets: function(data) {
      data = data.slice(1, this.length)
      this.exoplanets = data
      this.exoNames = data.map(x => x[0])
      this.exoMatrix = buildExoMatrix(data)
    },
    swChangeWiki: function(name) {
      this.swWikiData = this.swPlanets.filter(p => p.name == name)[0]

      // get the indices of 5 closest exoplanets
      let closestIndices = matchPlanets(
        swPlanetToArray(this.swWikiData), 
        this.exoMatrix,
        5
      ) 

      // get the names of the closest
      this.exoNames = closestIndices.map(i => this.exoplanets[i][0]);       
    },
    exoChangeWiki: function(name) {
      this.exoWikiData = this.exoplanets.filter(p => p[0] == name)[0]
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

.wiki span {
  float: right;
}

.card {
  border-bottom: 1px solid #F3F3F3;
}

.selected {
  background-color: #F3F3F3;
}

</style>
