<template lang="html">
  <div id="sokInfo" >
    <!-- Stedssøk input -->
    <div id="search">
      <input type="text" placeholder="Søk på stedsnavn" v-model="stedsNavn" @keyup="stedSok" @keydown.enter="alert('Helvete')">
      <!-- <input type="text" placeholder="Søk på stedsnavn" :value="stedsNavn" @keyup="stedSok"> -->
    </div>

    <!-- Stedssøk resultat -->
    <div id="searchResult" v-if="stedsNavn.length > 0">
      <ul>
        <li v-for="item in resultat" :data-x="item.x" :data-y="item.y" @click="zoomTilSted">{{ item.navn }}, {{ item.type }} i {{ item.kommune }}</li>
      </ul>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      stedsNavn: '',
      resultat: [],
      valgtSted: false
    }
  },
  props: ['pos'],
  methods: {
    resetSok() {
      this.stedsNavn = '';
      this.valgtSted = true;
    },
    stedSok(evt) {
      if(evt.target.value.length>0){
        var url = "https://ws.geonorge.no/SKWS3Index/v2/ssr/sok?"
        if(evt.target.value.split(",")[1]){
          var inputNavn = evt.target.value.split(",")[0];
          var inputEkstra = evt.target.value.split(",")[1];
        } else {
          var inputNavn = evt.target.value;
          var inputEkstra = "";
        }
        var options = {
            params: {
              navn: inputNavn + "*",
              fylkeKommuneNavnListe: inputEkstra,
              eksakteForst:true,
              antPerSide:15,
              epsgKode:25833,
            },
            responseType: 'xml'
          };
          axios.get(url, options)
          .then((response) => {
            console.log(response);
            this.resultat = response.data.stedsnavn.map((el)=>{
              return {
                navn: el.stedsnavn,
                type: el.navnetype,
                kommune: el.kommunenavn,
                fylke: el.fylkesnavn,
                x: el.aust,
                y: el.nord
              };
            });
            console.log(this.resultat);
          });
      }
    },
    zoomTilSted(evt) {
      let pos = {
        x: parseInt(evt.target.attributes["data-x"].value),
        y: parseInt(evt.target.attributes["data-y"].value)
      };
      this.$emit('valgt-sted', pos)
      this.resetSok();

    }
  }
}
</script>

<style lang="css" scoped>
  input[type=text] {
    margin: 10px;
    position: absolute;
    width: 30px;
    box-sizing: border-box;
    border: 2px solid #ecb140;
    border-radius: 4px;
    font-size: 1.5em;
    font-family: 'Rambla', sans-serif;
    background-color: rgb(255, 233, 212);
    background-image: url(../../assets/searchicon.png);
    background-position: 10px 9px;
    background-repeat: no-repeat;
    padding: 5px 0px 5px 40px;
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
    max-width: 400px;
  }

  input[type=text]:focus {
      width: 400px;
  }

  #sokInfo{
    position: absolute;
    z-index: 2 ;
    width: 400px
  }

  #searchResult{
    position: relative;
    left: 10px;
    top: 51px;
    padding: 5px 3px 5px 3px;
    border: 2px solid #ecb140;
    width: 400px;
    background-color: rgb(255, 233, 212);
    box-sizing: border-box;
    max-height: 200px;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
    overflow-y: scroll;
  }

  #searchResult .closebtn{
    position: absolute;
    right: 7px;
    top: -17px;
    text-decoration: none;
    color: black;
    font-size: 3.5em;
  }

  #searchResult ul{
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  #searchResult ul li{
    font-size: 1.2em;
    margin: 5px 0;
  }

  #searchResult ul li:hover{
    background-color: rgb(242, 189, 138);
  }


  #sokResultat{
    position: absolute;
    top: 45px;
    background-color: white;
    border-radius: 4px;
    max-height: 0px;
  }
</style>
