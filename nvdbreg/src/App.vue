<template>
  <div id="app">
    <div class="wrapper">
      <div class="sidepanel"></div>
      <div class="hovedpanel">
        <div id="header">
          <img id="logo" src="./assets/logo_svv.png">
          <span>Registrering av NVDB-mangler</span>
          <img id="strek" src="./assets/strek.png">
        </div>
        <div id="form">
          <!-- Introtekst -->
          <div class="intro">
            <p>I dette skjemaet kan du registrere mangler og avvik i NVDB-dataene. Velg først hvilken objekttype det er snakk om, og deretter marker i kartet i form av et punkt eller en linje. Om du har en merknad så kan man også skrive inn dette.</p>
          </div>
          <app-kontrakt></app-kontrakt>
          <!-- Velg objekttype -->
          <app-objekttype></app-objekttype>
          <!-- Marker i kart -->
          <app-map></app-map>
          <!-- Merknad -->
          <div class="form-group">
            <label for="merknad">Merknad</label>
            <textarea name="merknad" rows="8" cols="80"></textarea>
            <small for="merknad">Fyll ut en merknad om det er nødvendig</small>
          </div>
          <div id="sendinn">
            <p>Hvis all informasjon er fyllt ut så kan du melde inn avviket</p>
            <button type="button" name="button">Send inn</button>
            <p></p>
          </div>
        </div>
    </div>
    <div class="sidepanel"></div>
  </div>
</div>
</template>

<script>
import Objekttype from './components/Objekttype.vue'
import Kontrakt from './components/Kontraktsomraade.vue'
import Map from './components/Map/Map.vue'

export default {
  components: {
    appObjekttype: Objekttype,
    appMap: Map,
    appKontrakt: Kontrakt
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Raleway');

body{
  margin:0;
  padding:0;
  font-family: "Raleway",sans-serif;
  color: #2E3539;
  min-height: 100vh;
  background-image: url("./assets/bakgrunn_blur4.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

a{
  color: #ED9300;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all ease-in 0.2s;
}

a:hover{
  font-weight: bold;
  border-bottom: 2px solid #ED9300;
}

button {
  border:2px #e3b513 solid;
  background-color: #f1c883;
  color: #a3820b;
  height: 40px;
  font-size: 1.3em;
  font-family: 'Rambla', sans-serif;
}

#header{
  display: flex;
  color: white;
  background-color: #45515A;
  justify-content:  space-between;
  align-items: center;
  border-bottom: 1px #c37900 solid;
  position: relative;
  overflow: hidden;
}

#header span {
  font-size: 1.5rem;
  padding: 0 10px;
}

#logo{
  left: 0;
  height: 40px
}

#strek{
  height: 70px
}

.wrapper{
  display:flex;
  flex: 0 1 auto;
  }

.sidepanel{
  flex: 1 1 auto;
}
.hovedpanel{
  flex: 0 1 850px;
  /*border: 3px #c37900 solid;*/
  min-width: 0;
  display: flex;
  flex-flow: column;
  background-color: white;
}

#form {
  background-color: white;
  padding: 10px 20px;
}

.form-group {
  display: flex;
  flex-flow: column;
  padding: 20px 0;
}

input, textarea, select {
  border: 2px solid #ecb140;
  border-radius: 4px;
}

textarea {
  font-family: 'Rambla', sans-serif;
  font-size: 1.2em;
  padding: 0 5px;
  background-color: rgb(255, 233, 212);
  color: rgb(207, 118, 33);
  padding: 10px 5px;
  resize: none;
}

@media (min-width: 480px) {
}
</style>
