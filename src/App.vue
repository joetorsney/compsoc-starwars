<template>
  <div id="app">
    <main>
      <section id="sw-wiki" class="wiki" v-bind:data="swWikiData">
        <div v-if="!(swWikiData == null)">
          <h1>{{swWikiData.name}}</h1>
          <p>
          Climate: <span>{{swWikiData.climate}}</span> <br>
          Terrain: <span>{{swWikiData.terrain}}</span> <br>
          Popliation: <span>{{swWikiData.population}}</span> <br>
          Diameter (km): <span>{{swWikiData.diameter}}</span> <br>
          Gravity: <span>{{swWikiData.gravity}}</span> <br>
          Orbital Period (days): <span>{{swWikiData.orbital_period}}</span> <br>
          Rotation Period (hours): <span>{{swWikiData.rotation_period}}</span> <br>
          </p>
        </div>
        <div v-else>
          <h1>Welcome!</h1>
          <h2>What is this?</h2>
          <p>This VueJS calculates which real life (confirmed) exoplanets most closely match a given star wars planet.</p>
          <br><h2>How do I use this?</h2>
          <p>Select a Star Wars planet from the list on the left. 
            On doing so, this message will be replaced (sorry, you can't get it back without refreshing!) 
            with information about that planet. Then, the list on the right will display the five closest
            matching exoplanets. Choosing an exoplanet from this list will show information about it in 
            the section on the far right.</p>
          <br><h2>How do you know how similar planets are?</h2>
          <p>The similarity between two planets is the Euclidean distance between them. Currently, only 3 dimensions are used: Orbital Period, Mass and Radius. 
          </p>
          <br><h2>Where does your data come from?</h2>
          <p><a href="https://swapi.dev/">SWAPI Star Wars API</a>
          and the <a href="https://exoplanetarchive.ipac.caltech.edu/">The NASA Exoplanet Archive</a>.
          </p>
          <br><h2>The design is a bit weird</h2>
          <p>Yes, it's inspired by <a href="https://andymatuschak.org/">Andy Matuschacks' website</a> (and <a href="https://notes.andymatuschak.org/">his notes</a>). It's probably not great on mobile.</p>
          <br><h2>Cool, can I see the source code?</h2>
          <p>It's on my <a href="https://github.com/joetorsney/compsoc-starwars/">my github</a>. This was my first VueJS app - hacked together in about a week. <br>Thank you and enjoy!</p>
          
        </div>
      </section>
      <section class="list-section">
        <div class="section-header">
          <h1>Star Wars Planets</h1>
            <input type="text" v-model="swSearch" @keyup="filterSwNames" placeholder="Filter planets..."/>
        </div>
        <PlanetsList 
          v-bind:planets="swNamesFiltered"
          v-on:selected="swPlanetSelected"/>
      </section>
      <section class="list-section">
        <div class="section-header">
          <h1>Exoplanets</h1>
          <p v-if="exoplanets == null">Fetching...</p>
          <p v-else>Ready</p>
        </div>
        <PlanetsList 
          v-bind:planets="exoNames"
          v-on:selected="exoplanetSelected"/>
      </section>
      <section class="wiki">
        <div v-if="!(exoWikiData == null)">
          <h1>{{exoWikiData[0]}}</h1>
          Discovery Method: <span>{{exoWikiData[1]}}</span><br>
          Number of planets in system: <span>{{exoWikiData[2]}}</span><br>
          Orbital Period (days): <span>{{exoWikiData[3]}}</span><br>
          Planet Mass (Jupiters): <span>{{exoWikiData[7]}}</span><br>
          Planet Radius (Jupiters): <span>{{exoWikiData[8]}}</span><br>
          Distance from Earth (parsecs): <span>{{exoWikiData[9]}}</span><br>
          Star Effective Temperature (K): <span>{{exoWikiData[10]}}</span> <br>
          Discovery Date: <span>{{exoWikiData[11]}}</span> <br>
          Discovery Facility <span>{{exoWikiData[12]}}</span> <br><br>
          More Information: <br> 
          <a v-bind:href="exoWikiData[13]">Exoplanet Catalog</a> <br> 
          <a v-bind:href="exoWikiData[14]">Exoplanet Data Visualiser</a> <br>
        </div> 
      </section>

    </main>
  </div>
</template>

<script>
import Papa from 'papaparse';
import PlanetsList from './components/PlanetsList.vue'
import { nasaurl, buildExoMatrix, swPlanetToArray, matchPlanets } from "./planetlib.js"

export default {
  name: 'App',
  components: {
    PlanetsList,
  },
  data() {
    return {
      swPlanets: [], // Full Star Wars planet data
      swNames: [], // List of names to display.
      swNamesFiltered: [],
      swWikiData: null, // Data to be displayed in the sw wiki.
      swSearch: "",
      exoplanets: null, // Full exoplanet data
      exoNames: [], // List of names to display
      exoWikiData: null, // Data to be displayed in the exoplanet wiki.
      exoMatrix: null, // A matrix of numeric data for the exoplanets.
    }
  },

  created() {
    this.getSWPlanets();
    this.getExoplanets();
  },

  methods: {
    getSWPlanets: function() {
      // Fetch from all 6 pages of planet data at once.
      let apiPromises = []
      for (let i = 1; i <= 6; i++) {
        apiPromises.push(
          fetch("https://swapi.dev/api/planets/?search=&page="+i)
          .then(response => response.json())
        )
      }

      // Once all the promises are resolved, process the results.
      Promise.all(apiPromises)
      .then(data => {
        this.swPlanets = data.map(d => d.results).flat()
        this.swNames = this.swPlanets.map(
          p => p.name
        );
        this.swNamesFiltered = this.swNames;
      })
    },

    getExoplanets: function() {
      // Fetch all the exoplanets from nasa api
      Papa.parse(nasaurl, {
        download: true,
        complete: (results) => {
          this.gotExoplanets(results.data);
        }
      });
    },

    gotExoplanets: function(data) {
      // When we get them, remove the header row
      data = data.slice(1, this.length)
      this.exoplanets = data // Then keep the full data...
      this.exoMatrix = buildExoMatrix(data) // ...and numeric data.
    },

    swPlanetSelected: function(name) {
      // Updates the data to be displayed in the star wars wiki
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

    exoplanetSelected: function(name) {
      // Updates the data to be displayed in the exoplanet wiki.
      this.exoWikiData = this.exoplanets.filter(p => p[0] == name)[0]
    },

    filterSwNames() {
      // Filters the list of sw planets to be displayed according to 
      // the search box.
      this.swNamesFiltered = this.swNames.filter(p => {
        return p.toLowerCase().includes(this.swSearch.toLowerCase())
      })
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@700&family=Rubik+Mono+One&family=Rubik:wght@400;500&display=swap");

:root {
  --color-vibrant: #ff6000;
  --color-light: #b76935;
  --color-dark: #143642; 
  --color-bg: whitesmoke;
  --color-hover: #7C9BA1;
}

* {
  font-family: 'Rubik', sans-serif;
  font-size: 20px;
}

/* Headings */

h1 {
  font-family: 'Rubik Mono One', sans-serif;
  font-weight: 400;

  text-align: center;
  font-size: 30px;
}

h2, h3 {
  font-weight: 500;
  font-size: 25px;
}

/* Set colours */
div, section, .card {
  background-color: var(--color-bg)
}

h1, a {
  color: var(--color-vibrant);;
}

p, h2, h3 {
  color: var(--color-dark)
}

/* Layout */
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
  width: 500px;
  overflow-y: scroll;
  flex-shrink: 0;
  flex-grow: 0;
}

/* wiki */
.wiki li {
  list-style: none;
}

.wiki, .card, .section-header {
  padding: 20px;
}

.wiki span {
  float: right;
}

.section-header {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}

.section-header * {
  text-align: center;
}

input {
  width: 100%;
  padding: 5px;
  background-color: #F3F3F3;
  border-radius: 5px;
}

.card {
  border-bottom: 1px solid #F3F3F3;
}

.selected {
  background-color: #F3F3F3;
}

</style>
