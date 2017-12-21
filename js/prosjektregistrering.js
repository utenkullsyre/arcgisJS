var avdeling = document.querySelector('[name=vegavdeling]')
var seksjon = document.querySelector('[name=seksjon]')
var form = document.querySelector('[name=prosjektregistrering]')
var prosjekt = document.querySelector('#prosjektdetaljer')
var kart = document.querySelector('#stedfesting')
var submit = document.querySelector('#sendinn')
var nyttProsjekt = document.querySelector('[name=nyttprosjekt]')
var formMessage = document.querySelector('#valideringForm')
var skjemaItems = document.querySelectorAll('.formitem input,.formitem select')

console.log(form)

var acc = document.getElementsByClassName('accordion')

function fjernCss () {
  var acc = document.getElementsByClassName('accordion')
  var panel = document.getElementsByClassName('panel')

  Array.prototype.map.call(acc, function (obj) {
    obj.classList.remove('active')
  })

  Array.prototype.map.call(panel, function (obj) {
    obj.classList.remove('aapen')
  })
}

function skjemaValidering () {
  if (form.checkValidity() && seksjon.value !== 'placeholder' && avdeling.value !== 'placeholder') {
    return true
  } else {
    return false
  }
}

function testSkjemadrit (element) {
  if (!element.checkValidity()) {
    element.classList.add('invalid')
  } else {
    element.classList.remove('invalid')
  }
}

<<<<<<< HEAD
prosjekt.addEventListener('click', function () {
  fjernCss()
  this.classList.add('active')
  this.nextElementSibling.classList.add('aapen')
})

Array.prototype.map.call(skjemaItems, function (obj) {
  obj.addEventListener('focusout', function () {
    testSkjemadrit(this)
  })
})

kart.addEventListener('click', function () {
  if (skjemaValidering()) {
    formMessage.innerHTML = ''
    fjernCss()
    this.classList.add('active')
    this.nextElementSibling.classList.add('aapen')
    window.scrollTo(0, 191)
=======


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

>>>>>>> 0e4f9646b5b1e8abe3b331543d5e4c7e5f1cbe41
  } else {
    Array.prototype.map.call(skjemaItems, function (obj) {
      testSkjemadrit(obj)
    })
    formMessage.innerHTML = '<p>Skjemaet er ikke godkjent, fyll det ut riktig før du kan stedfeste prosjektet.</p>'
  }
})

<<<<<<< HEAD
nyttProsjekt.addEventListener('click', function () {
  fjernCss()
  prosjekt.classList.add('active')
  document.getElementById('prosjektinfo').classList.add('aapen')
})
=======
nyttProsjekt.addEventListener("click",function(){
  fjernCss();
  prosjekt.classList.add("active");
  document.getElementById("prosjektinfo").classList.add("aapen");
  window.scrollTo(0,0);
});
>>>>>>> 0e4f9646b5b1e8abe3b331543d5e4c7e5f1cbe41
