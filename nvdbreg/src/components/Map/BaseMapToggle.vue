<template lang="html">
  <div id="baseToggle" @click="test">
    <img id="bilde1" v-if="erFlyfoto" src="../../assets/baseSVV.jpg">
    <img id="bilde2" v-if="!erFlyfoto" src="../../assets/baseBilde.jpg">
  </div>
</template>

<script>
export default {
  data() {
    return {
      erFlyfoto: true
    }
  },
  props: ['baseMap'],
  methods: {
    test() {
      this.erFlyfoto = !this.erFlyfoto
      this.baseMap[0].layer.visible = !this.baseMap[0].layer.visible
      this.baseMap[1].layer.visible = !this.baseMap[1].layer.visible
    }
  }
}
</script>

<style lang="css" scoped>
  #baseToggle{
    position: absolute;
    box-sizing: border-box;
    border: 2px solid #ecb140;
    border-radius: 4px;
    bottom: 10px;
    left: 10px;
    cursor: pointer;
  }

  img{
  left: 0px;
  bottom: 0px;
  border: 2px #ecc347 solid;
  position: absolute;
  transition: all 0.5s;
  border-radius: 5px;
  height: 40px;
  }

</style>
