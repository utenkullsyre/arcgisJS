var avdeling = document.querySelector("[name=vegavdeling]"),
seksjon = document.querySelector("[name=seksjon]"),
form = document.querySelector("[name=prosjektregistrering]"),
prosjekt = document.querySelector("#prosjektdetaljer"),
kart = document.querySelector("#stedfesting"),
submit = document.querySelector("#sendinn"),
nyttProsjekt = document.querySelector("[name=nyttprosjekt]"),
formMessage = document.querySelector("#valideringForm"),
skjemaItems = document.querySelectorAll(".formitem input,.formitem select");


var acc = document.getElementsByClassName("accordion");
var i;

function fjernCss(){
  var acc = document.getElementsByClassName("accordion");
  var panel = document.getElementsByClassName("panel");

  Array.prototype.map.call(acc, function(obj) {
        obj.classList.remove("active");
      })

  Array.prototype.map.call(panel, function(obj) {
        obj.classList.remove("aapen");
      })
}

function skjemaValidering(){
  if(form.checkValidity() && seksjon.value!="placeholder" && avdeling.value !="placeholder"){
    return true
  } else {
    return false
  }
}

function testSkjemadrit(element){
  if(!element.checkValidity()){
    element.classList.add("invalid")
  } else {
    element.classList.remove("invalid")
  }
}



prosjekt.addEventListener("click",function(){
  fjernCss();
  this.classList.add("active");
  this.nextElementSibling.classList.add("aapen");
});

Array.prototype.map.call(skjemaItems, function(obj) {
      obj.addEventListener("focusout", function(){
        testSkjemadrit(this);
      });
    })

kart.addEventListener("click",function(){


  if(skjemaValidering()){
    formMessage.innerHTML = "<p>Skjemaet er godkjent</p>";
    fjernCss();
    this.classList.add("active");
    this.nextElementSibling.classList.add("aapen");

  } else {
    Array.prototype.map.call(skjemaItems, function(obj) {
          testSkjemadrit(obj);
        })
      formMessage.innerHTML = "<p>Skjemaet er ikke godkjent, fyll det ut riktig før du kan stedfeste prosjektet.</p>";
  }
});

submit.addEventListener("click",function(){
  if(skjemaValidering() && document.querySelector("#viewDiv")){
  //Hvis grafikk er registrert og skjema er fyllt ut, lagre prosjekt i AGOL
  //og gi beskjed om at prosjektet er suksessfullt lagt inn.
  //kanskje til og med legg til link til kart på agol for å vise det
  fjernCss();
  this.classList.add("active");
  this.nextElementSibling.classList.add("aapen");
} else {
  document.querySelector("#kart .errorMessage").innerHTML = "<p>Prosjektinfo er ikke fyllt ut eller stedfestet</p>";
}

nyttProsjekt.addEventListener("click",function(){
  fjernCss();
  prosjekt.classList.add("active");
  document.getElementById("prosjektinfo").classList.add("aapen");
  form.reset();



})

});
