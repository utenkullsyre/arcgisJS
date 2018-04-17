var formRegistrering = document.querySelector("#form"),
      nyTur =  document.querySelector("#nyTopp"),
      lukkRegistrering = document.querySelector("#form i");


var test = Array.prototype.map.call([nyTur, lukkRegistrering], function(obj) {
    obj.addEventListener("click", function(){
      formRegistrering.classList.toggle('none');
      formRegistrering.classList.toggle('showFlex');
      });
    ;})
