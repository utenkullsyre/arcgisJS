<template lang="html">
  <div class="form-group">
    <label for="objekttype">Velg kontraktsområde</label>
    <div>
      <div class="wrapper">
          <input type="text" name="" v-model="filterTekst" @keyup="valgtObjekttype =''" @keydown.esc="filterTekst=''" placeholder="Søk på kontraktsområde" required>
          <i class="material-icons" @click="filterTekst = ''" v-if="filterTekst.length > 0">close</i>
      </div>

      <ul v-if="filterTekst.length>0 && valgtObjekttype.length == 0">
        <li id="objforslag" v-for="item in filtrertData" :data-id="item.id" @click="velgObjtype" > {{ item.navn }}</li>
      </ul>
    </div>
    <small for="objekttype">Søk på gjeldende kontraktsområde</small>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      options: {
        // params: {
        //   f: 'json',
        //   where: '1=1',
        //   outFields: '*',
        //   returnGeometry: false
        // }
      },
      url: 'https://www.vegvesen.no/nvdb/api/v2/omrader/kontraktsomrader',
      source: null,
      filterTekst: '',
      valgtObjekttype: '',
      forslagAApen: false
    }
  },
  computed: {
    filtrertData() {
      return this.source.filter((el) => {
        return el.navn.toLowerCase().match(this.filterTekst.toLowerCase())
      })
    }
  },
  methods: {
    velgObjtype(event) {
      this.valgtObjekttype = event.target.innerText
      this.filterTekst = event.target.innerText
    },
    faen() {
      this.valgtObjekttype = null
      alert('Helvete')
    }
  },
  created() {
    axios.get(this.url)
    .then(response => {
      console.log(typeof(response));
      this.source = response.data.map(el => {
        if(!el.navn.startsWith('Utgår_')) {
          return JSON.parse(JSON.stringify(el))
        }
      }).filter(el => {
        return el != null
      })
    })
    .catch(e => {
      console.log(e)
    })
  }
}
</script>

<style lang="css" scoped>
input {
  font-family: 'Rambla', sans-serif;
  max-width: 400px;
  width: 300px;
  font-size: 1.2em;
  height: 40px;
  padding: 0 5px;
  background-color: rgb(255, 233, 212);
  color: rgb(207, 118, 33);
}

#objforslag {
  position: relative;
}

ul {
  list-style: none;
  padding: 0 5px;
  margin: 0;
  background-color: white;
  position: absolute;
  max-height: 250px;
  width: 297px;
  overflow-y: scroll;
  border: 2px solid #91ade8;
  z-index: 40
  }

li{
  transition: all 0.1s
}

li:hover {
  background-color: rgb(233, 233, 233);
  cursor: pointer;
}

.wrapper{
  display: flex;
  position: relative;
}

i {
  position: absolute;
  left: 280px;
  top: 7px;
  font-weight: bold;
  color: #7d7d7d;
  cursor: pointer;
}
</style>
