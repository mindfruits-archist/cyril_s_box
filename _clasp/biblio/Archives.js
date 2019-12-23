// Fonction qui explore la bdd des membres de MindFruits et les met au format ArrayNE du reporting AdWords
// Version 1.0, Publiée le 03/05/2017
function getarrayne() {
  var contactarr = getemailsbdd("adwords")
  var arrayNE = [];
  
  for (var i in contactarr) {
    arrayNE.push([])
    var name = contactarr[i][0];
    arrayNE[i]["name"] = name;
    var email = contactarr[i][1];
    arrayNE[i]["email"] = email;
  }
  Logger.log(arrayNE[1].email)
}

function countmail(arrayNE) {
  var count = Number(0);
  var result = String()
  while(result!="undefined") {
    result = arrayNE[count]["name"]
    count++
  }

}


function findglobalinbdd(/*colname*/) {
  var colname = "global"
  var shBddpeople = shBdd.getSheetByName("people")
  var lr = shBdd.getLastRow();
  var lc = shBdd.getLastColumn()-1;
  var requestpos = Number();
  var namespos = Number();
  var headers = shBdd.getRange(getcolumn(0) + "1" +":" + getcolumn(lc) + "1").getValues();
  headers = headers[0]
  
  for(var i in headers) {
    var currentheader = headers[i]
    if(headers[i]==request) {
      requestpos = i
    }
    if(headers[i]=="prenom") {
      namespos = i
    }
  }
  
  var namepos = Number();
  var names = shBdd.getRange(getcolumn(namespos) + "2" +":" + getcolumn(namespos) + lr).getValues();
  
  for(var i in names) {
    var currentname = names[i][0]
    if(names[i][0]==name) {
      namepos = i
    }
  }
  
  var bddarray = shBdd.getRange(getcolumn(0) + "2" +":" + getcolumn(lc) + lr).getValues();
  
  var email = bddarray[namepos][requestpos]
  Logger.log("requestpos = " + requestpos + " et namepos = " + namepos)
}