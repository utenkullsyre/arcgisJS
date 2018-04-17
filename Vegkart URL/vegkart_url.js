function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
                console.log(data);

            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

var url, typeID, objID = "";
typeID = 96;
objID = 89248158;
apiQuery = "https://www.vegvesen.no/nvdb/api/v2/vegobjekter/" + typeID +"/"+ objID


var vegobjekt, pktGeo = {};

function 

ajax_get(apiQuery,function(data){
  vegobjekt = data;
  var xyz = data.geometri.wkt.split(/[()]+/)[1].split(" ");
  pktGeo.x = xyz[0];
  pktGeo.y = xyz[1];
  pktGeo.koord = vegobjekt.geometri.srid
})

var vegkartUrl = "https://www.vegvesen.no/vegkart/vegkart/#kartlag:geodata/hva:(~(id:"+ typeID +",filter:(~),farge:'0_0))/@538437,7631243,14/vegobjekt:" + objID + ":58b02c:" + typeID
