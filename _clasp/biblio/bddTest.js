// Fonction principale qui explore la bdd des membres de MindFruits afin de faire correspondre des variables correspondantes.
function exploreglobalbdd(name,request) {
  /* var name = "Guillaume"
  var request = "email" */
  var shBddpeople = shBdd.getSheetByName("people");
  var lr = shBdd.getLastRow();
  var lc = shBdd.getLastColumn()-1;
  var requestPosition = Number();
  var namesPosition = Number();
  var namesList = shBdd.getRange(getcolumn(0) + "1" +":" + getcolumn(lc) + "1").getValues();
  namesList = namesList[0];
  
  for(var i in namesList) {
    var currentheader = namesList[i];
    if(namesList[i]==request) {
      requestPosition = i;
    }
    if(namesList[i]=="prenom") {
      namesPosition = i;
    }
  }
  
  var namesPosition = Number();
  var names = shBdd.getRange(getcolumn(namesPosition) + "2" +":" + getcolumn(namesPosition) + lr).getValues();
  
  for(var i in names) {
    var currentName = names[i][0];
    if(names[i][0]==name) {
      namesPosition = i;
    }
  }
  
  var bddarray = shBdd.getRange(getcolumn(0) + "2" +":" + getcolumn(lc) + lr).getValues();
  
  var email = bddarray[namesPosition][requestPosition];
  Logger.log("requestPosition = " + requestPosition + " et namePosition = " + namesPosition);
}

// Fonction principale qui explore la BDD Analytics pour récupérer tous les IDs pour lesquels nous faisons des reportings.
// Version 1.0, Publiée le 12/06/2017
function testGetAnalyticsIds(detail, ownerName) {
  var detail = "seo";
  var detailarray = ["global","seo"];
  var detailindex = detailarray.indexOf(detail);
  var shBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/");
  var shBddanalytics = shBdd.getSheetByName("analytics");
  var lr = shBddanalytics.getLastRow();
  var lc = shBddanalytics.getLastColumn()-1;
  var clientName = shBddanalytics.getRange("A1:" + getcolumn(lc) + lr).getValues();
  var clients = [];
  var j = Number(0);
  
  for(var i  in clientName) {
    if(clientName[i][(4+detailindex)] == "Oui") {
      clients.push([]);
      clients[j].push(clientName[i][0]);
      clients[j].push(clientName[i][2]);
      clients[j].push(clientName[i][3].split(","));
      j++; 
    }
  }
  
  Logger.log(clients[2]);
  return clients; 
}

// Fonction qui explore la bdd des membres de MindFruits afin de faire correspondre les emails par rapport aux suivis de chacun
// Version 1.1, Publiée le 03/05/2017
function getEmailsBddOld(type,email) {
  var shBddpeople = shBdd.getSheetByName("people");
  var lr = shBdd.getLastRow();
  var lc = shBdd.getLastColumn()-1;
  var globalPosition = Number();
  var namesPosition = Number();
  var emailPosition = Number();

  var headers = shBddpeople.getRange(getcolumn(0) + "1" +":" + getcolumn(lc) + "1").getValues();
  headers = headers[0];
  
  for(var i in headers) {
    var currentheader = headers[i];
    if(headers[i]==type) {
      globalPosition = i;
    }
    if(headers[i]=="prenom") {
      namesPosition = i;
    }
    if(headers[i]==email) {
      emailPosition = i
    }
  }
  
  var namepos = Number();
  var names = shBddpeople.getRange(getcolumn(namesPosition) + "2" +":" + getcolumn(namesPosition) + lr).getValues();
  var emails = shBddpeople.getRange(getcolumn(emailPosition) + "2" +":" + getcolumn(emailPosition) + lr).getValues();
  var globals = shBddpeople.getRange(getcolumn(globalPosition) + "2" +":" + getcolumn(globalPosition) + lr).getValues();
  var contactsarray = [];
  var globalcounter = Number();
  
  for(var i in globals) {
    var currentglobal = globals[i][0];
    if(globals[i][0]=="Oui") {
      contactsarray.push([]);
      contactsarray[globalcounter].push(names[i][0]);
      contactsarray[globalcounter].push(emails[i][0]);
      globalcounter++;
    }
  }
  
  return(contactsarray);
}

// Fonction qui explore la bdd des membres de MindFruits et récupère uniquement les emails au format Array.
// Version 1.1, Publiée le 03/05/2017
function extractemails(type,email) {  
  var contactsarray = getemailsbdd(type,email);
  var emailarr = [];
  
  for (var i in contactsarray) {
    emailarr.push(contactsarray[i][1]);
  }
  
  return emailarr;
}

// Fonction qui explore la bdd des membres de MindFruits et récupère uniquement les emails au format String.
// Version 1.0, Publiée le 03/05/2017
function extractemailString(type,email) {  
  var contactsarray = getemailsbdd(type,email);
  var emailsString = String();
  
  for (var i in contactsarray) {
    emailsString = emailsString + contactsarray[i][1] + ",";
  }
  
  emailsString = emailsString.slice(0,(emailsString.length-1));
    
  return emailsString;
}