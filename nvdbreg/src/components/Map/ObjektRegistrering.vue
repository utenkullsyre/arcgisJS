<template lang="html">
  <div id="knappecontainer">
    <div class="knapperad">
      <button class="action-button" id="freehandButton" type="button"title="Freehand"><i class="material-icons">gesture</i></button>
      <button type="button" name="button"><i class="material-icons">undo</i></button>
    </div>
    <div class="knapperad">
      <button type="button" name="pkt"><i class="material-icons">place</i></button>
      <button type="button" name="linje"><i class="material-icons">timeline</i></button>
      <button type="button" name="button"><i class="material-icons">delete_forever</i></button>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
  #knappecontainer{
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .knapperad{
    margin: 2px;
  }

  button{
    color: rgb(238, 142, 0);
    height: 40px;
    width: 40px;
    border: 2px solid #ecb140;
    border-radius: 4px;
    background-color: rgb(255, 233, 212);
  }

  /* #freehandButton {
    position: absolute;
    bottom: 35px;
    color: black;
  }

  #resetBtn {
    position: absolute;
    bottom: 70px;
    color: black;
  } */
</style>
