// Fonction qui explore la bdd des membres de MindFruits afin de faire correspondre les emails par rapport aux suivis de chacun
// Version 1.1, Publiée le 03/05/2017
function getEmailsBdd(type,email) {
  var shBddpeople = shBdd.getSheetByName("people")
  var lr = shBdd.getLastRow();
  var lc = shBdd.getLastColumn()-1;
  var globalpos = Number();
  var namespos = Number();
  var emailpos = Number();

  var headers = shBddpeople.getRange(getcolumn(0) + "1" +":" + getcolumn(lc) + "1").getValues();
  headers = headers[0]
  
  for(var i in headers) {
    var currentheader = headers[i]
    if(headers[i]==type) {
      globalpos = i
    }
    if(headers[i]=="prenom") {
      namespos = i
    }
    
    if(headers[i]==email) {
      emailpos = i
    }
  }
  
  var namepos = Number();
  var names = shBddpeople.getRange(getcolumn(namespos) + "2" +":" + getcolumn(namespos) + lr).getValues();
  var emails = shBddpeople.getRange(getcolumn(emailpos) + "2" +":" + getcolumn(emailpos) + lr).getValues();
  var globals = shBddpeople.getRange(getcolumn(globalpos) + "2" +":" + getcolumn(globalpos) + lr).getValues();
  var contactsarray = []
  var globalcounter = Number();
  
  for(var i in globals) {
    var currentglobal = globals[i][0]
    if(globals[i][0]=="Oui") {
      contactsarray.push([])
      contactsarray[globalcounter].push(names[i][0]);
      contactsarray[globalcounter].push(emails[i][0]);
      globalcounter++
    }
  }
  
  return(contactsarray);
}



// Fonction principale qui explore la BDD AdWords pour récupérer tous les IDs pour lesquels nous faisons des reportings.
function getAdWordsIds() {
  var shBddadwords = shBdd.getSheetByName("adwords")
  var lr = shBddadwords.getLastRow();
  var lc = shBddadwords.getLastColumn()-1;
  var adwordsdata = shBddadwords.getRange("A1:" + getcolumn(lc) + lr).getValues();
  var adwordsids = []
  
  for(var i  in adwordsdata) {
    if(adwordsdata[i][2] == "Oui") {
      adwordsids.push(adwordsdata[i][1])
    }
  }
  
  Logger.log(adwordsids)
  
}

// Fonction principale qui explore la BDD Global pour récupérer toutes les URL des sites des clients.
function getWebsitesUrl() {
  var lr = shBddGlobal.getLastRow();
  var lc = shBddGlobal.getLastColumn()-1;
  var analyticsData = shBddGlobal.getRange("A2:" + getcolumn(lc) + lr).getValues();
  var analyticsUrl = [];
  
  for(var i  in analyticsData) {
    if(analyticsData[i][4] == "Oui") {
      analyticsUrl.push(analyticsData[i][1]);
    }
  }
  
  Logger.log(analyticsUrl);
  return analyticsUrl;
}

// Fonction principale qui explore la BDD Analytics pour récupérer tous les IDs pour lesquels nous faisons des reportings.
// Version 1.0, Publiée le 12/06/2017
function getAnalyticsIds(detail) {
  //var detail = "global";
  var detailarray = ["global","seo"];
  var detailindex = detailarray.indexOf(detail);
  var shBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/");
  var lr = shBddAnalytics.getLastRow();
  var lc = shBddAnalytics.getLastColumn()-1;
  var analyticsdata = shBddAnalytics.getRange("A1:" + getcolumn(lc) + lr).getValues();
  var analyticsids = []
  var j = Number(0);
  
  for(var i  in analyticsdata) {
    if(analyticsdata[i][(4+detailindex)] == "Oui") {
      analyticsids.push([])
      analyticsids[j].push(analyticsdata[i][0])
      analyticsids[j].push(analyticsdata[i][2])
      j++
    }
  }
  
  Logger.log(analyticsids)
  return analyticsids
  
}

function testforAdWords() {
  Logger.log(extractemailString("adwords","email"));
}


// Fonction qui explore la bdd des membres de MindFruits et récupère uniquement les emails au format Array.
// Version 1.1, Publiée le 03/05/2017
function extractemails(type,email) {  
  var contactsarray = getemailsbdd(type,email)
  var emailarr = []
  
  for (var i in contactsarray) {
    emailarr.push(contactsarray[i][1])
  }
  
  return emailarr
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