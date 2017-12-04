var avdeling = document.querySelector("[name=vegavdeling]"),
seksjon = document.querySelector("[name=seksjon]"),
form = document.querySelector("[name=prosjektregistrering]"),
prosjekt = document.querySelector("#prosjektdetaljer"),
kart = document.querySelector("#stedfesting"),
submit = document.querySelector("#sendinn"),
nyttProsjekt = document.querySelector("[name=nyttprosjekt]"),
formMessage = document.querySelector("#valideringForm"),
skjemaItems = document.querySelectorAll(".formitem input,.formitem select");

console.log(form);

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
    formMessage.innerHTML = "";
    window.scrollTo(0,191);
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

nyttProsjekt.addEventListener("click",function(){
  fjernCss();
  prosjekt.classList.add("active");
  document.getElementById("prosjektinfo").classList.add("aapen");
  window.scrollTo(0,0);
});
