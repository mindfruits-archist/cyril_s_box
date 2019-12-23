//============================================================================================================================================================//
//============================================================================================================================================================//
//=================================| BDD Websites Checker V1.0 | 21/03/2019 | Créé par Thomas Levard pour Mindfruits SARL |===================================//
//============================================================================================================================================================//
//=> Changelog : =============================================================================================================================================//
// - V1.O : Version en production. ===========================================================================================================================//
//============================================================================================================================================================//

var sp = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/18CwKDC4ecDaE3FOMX4f0UnbigY0qy_MBOJfp_dqI7qY/edit#gid=639844457')
var shFollowUp = sp.getSheetByName("FollowUp")
var erreur = false;
var thedate = new Date(new Date().setHours(new Date().getHours() + 9))

function getTemplate() {
  var template = htmlMfEmailTemplate();
  var header = template[0];
  var footerIntern = template[2];
  var button = template[3];
  return [header, footerIntern,button];
}
/*
function main() {
  var listAdsIds = updateUrlList()
  Logger.log(listAdsIds[0])
  miseEnVeilleAdsCamp(listAdsIds[0])
}
*/
/*
function main() {
  getListUrlAdsCamp('192-216-6200')
}
*/
function easyCheck() {

}
function mainnnnnn() {
  Logger.log("C1: %s", shFollowUp.getRange("C1").getValue())
  Logger.log("C2: %s", shFollowUp.getRange("C2").getValue())
  // Mise à jour de la liste des URL à vérifier.
  //ET, RECUPERE LA LISTE DES IDs Adwords
  var urlarray_AdsIds = updateUrlList();

  // Récupération des dernières données pour savoir s'il faut s'exécuter.
  var startValues = canStartV2();
  Logger.log("startValues: %s", startValues)
  //startValues[0]=true;startValues[1]=false/*0MINITES*/
  startValues[0]=true;startValues[1]=false/*5MINUTES(freshCheck)*/
  //startValues[0]=false;startValues[1]=true/*30MINUTES(reCheck)*/



/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var adsUrlArray
    var adsUrlResultArray
    var arrayAds = []
    var c1 = shFollowUp.getRange("C1").getValue()
    if(startValues[1]){
      if(c1 != "") c1 = JSON.parse(c1)
      for(a in c1){
        adsUrlArray = c1[a].array_url
        c1.array_checks.push(checkUrl(adsUrlArray))
      }
    }
    if(startValues[0]){

    }
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


  //SI LA CRON A ETE DECLENCHE IL Y A MOINS DE 5 MINUTES OU IL Y A PLUS DE 28 MINUTES
  if(startValues[0] || startValues[1]) {
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
PARTIE1------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
    var startRow = Number(8);
    var colUrl = Number(1);
    var lr = shFollowUp.getLastRow();
    var urlarray = shFollowUp.getRange("B" + startRow +":B"+ lr).getValues();
    //Logger.log(urlarray.length+" ___ "+urlarray_AdsIds.length)
    var responseArray = checkUrls(urlarray)
    Logger.log(urlarray)
/*
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
PARTIE2-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

    var date = thedate.getDate()+"/"+completedate((thedate.getMonth()+1))+"/"+thedate.getFullYear()
    var time = thedate.getHours()+ "h" + completedate(thedate.getMinutes())

    var arrayAds = []

    var formatarray = []
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------PARTIE2-BOUCLE SUR LES SITEWEB--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Logger.log("--START BOUCLE FOR %s ITEMS\n\n\n\n\n", responseArray.length)
    // Mise en forme des cellules en fonction des résultats
    for(var i in responseArray) {
      formatarray.push([])
      var r = responseArray[i][0];
      var slicedvalue = String(r).slice(0,1);
      //slicedvalue="5"//ERREUR 500 OU 400 REPEREE
      //slicedvalue="3"//REDIRECTION 300 REPEREE
      //slicedvalue="2"//SUCCESS RESPONSE 200 REPEREE



/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
      //200 REPONSE CORRECTE
      if (slicedvalue == "2") {
        formatarray[i].push("#93c47d");
        //CETTE PARTIE N'EST PAS ENCORE A FAIRE,
        // cad: VERIFIER SI LES CAMPAGNES SONT INACTIVES, ET LES REACTIVER
        //checkEnableableAdsCamp(urlarray_AdsIds[i])
      }
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
      //ERREUR 500 OU 400 REPEREE
      if (slicedvalue == "5" || slicedvalue =="4") {
        if (slicedvalue == "5" || slicedvalue =="4")formatarray[i].push("red");

        //ON APPLIQUE UNE MODIFICATION DE "mise en veille"(.pause()) AUX CAMPAGNES ADS
        Logger.log("\n\n\n\n\nDEBUT_______________________RECUPERATION URL FROM GADS_______________________")
        Logger.log("---DEBUT------------check first------------")
        var objAdCampaign = getListUrlAdsCamp(urlarray_AdsIds[i], urlarray[i])
        var arrayAdCampaign_5_Urls = objAdCampaign["array_url"]
        Logger.log(arrayAdCampaign_5_Urls)
        arrayAds[i] = objAdCampaign
        Logger.log("\n\n\n\n\nFIN_______________________RECUPERATION URL FROM GADS_______________________")
      }
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
      if (slicedvalue == "3") {
        //CETTE PARTIE N'EST PAS ENCORE A FAIRE,
        // cad: ENVOYER UN EMAIL AU CLIENT
        formatarray[i].push("orange");
      }
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/



    }
    Logger.log("--END BOUCLE OF %s ITEMS\n\n\n\n", responseArray.length)
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*---------PARTIE2-FIN BOUCLE SUR LES SITEWEB------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*
    var Ccolonne = shFollowUp.getRange("C" + startRow + ":C" + lr).getValues()
    Logger.log("formatarray: %s", formatarray)
    Logger.log("Ccolonne: %s", Ccolonne)
    Logger.log("responseArray: %s", responseArray)
    Logger.log("Ccolonne.length: %s; Ccolonne[0].length: %s; responseArray.length: %s; responseArray[0].length: %s", Ccolonne.length, Ccolonne[0].length, responseArray.length, responseArray[0].length)
    */

/*PARTIE3-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    //INSERTION DE LA COLONNE EN PLAGE C
    shFollowUp.insertColumnBefore(3);
    shFollowUp.getRange("C" + 7).setValue("Réponse du serveur à " + time + " le " + date);
    shFollowUp.getRange("C" + startRow + ":C" + lr).setValues(responseArray)
      .setBackgrounds(formatarray).setFontColor("white").setHorizontalAlignment("center");
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/



/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Logger.log("---DEBUT------------firstCheck::check urls adwords----------------------")
    if(firstCheck){
      var resultCheck = []
      var listWebsiteError = []
      for(var i in arrayAds){
        resultCheck.push(checkUrls(arrayAds[i].array_url, true, ["WebSite url: "+arrayAds[i].urlFromSheet, "Client: "+arrayAds[i].accountName, "N°AdwordsId:"+arrayAds[i].adsId]))
        listWebsiteError.push(arrayAds[i].urlFromSheet)
        /*
        Logger.log("i: %s", i)
        Logger.log("arrayAds[i].array_url: %s", arrayAds[i].array_url)
        */
      }
      Logger.log("resultCheck: %s", resultCheck)
      Logger.log("---FIN------------firstCheck::check urls adwords----------------------")

      shFollowUp.getRange("C1").setValue(JSON.stringify(resultCheck))
      shFollowUp.getRange("C2").setValue(JSON.stringify(listWebsiteError))
      shFollowUp.getRange("C3").setValue(JSON.stringify(arrayAds))
    }
    if(lastCheck){
      var resultCheck = []
      var listWebsiteError = []
      Logger.log("---DEBUT------------lastCheck::check urls adwords----------------------")
      for(var i in arrayAds){
        resultCheck.push(checkUrls(arrayAds[i].array_url, true, ["WebSite url: "+arrayAds[i].urlFromSheet, "Client: "+arrayAds[i].accountName, "N°AdwordsId:"+arrayAds[i].adsId]))
        listWebsiteError.push(arrayAds[i].urlFromSheet)
        /*
        Logger.log("i: %s", i)
        Logger.log("arrayAds[i].array_url: %s", arrayAds[i].array_url)
        */
      }
      Logger.log("---FIN------------lastCheck::check urls adwords----------------------")
      /*
      Logger.log("lastCheck: %s", lastCheck)
      Logger.log("resultCheck: %s", resultCheck)
      */

      var accountWithErrorDetected = []
      var accountWithErrorDetectedCOUNTER = 0
      var objUrlFromSheet = {}
      Logger.log("urlFromSheet: %s", urlFromSheet)
      for(var i in resultCheck){
        objUrlFromSheet.website = resultCheck[i].pop()
        var index = accountWithErrorDetected.push([])
        accountWithErrorDetected[index].push(objUrlFromSheet.website)
        Logger.log(resultCheck[i])
        for(var j in resultCheck[i]){
          Logger.log(resultCheck[i][j])
          if(String(resultCheck[i][j]).slice(0,1) == "5" || String(resultCheck[i][j]).slice(0,1) == "4"){
            accountWithErrorDetectedCOUNTER++
          }
        }
        objUrlFromSheet.errorDetectedCOUNTER = accountWithErrorDetectedCOUNTER
        accountWithErrorDetected[index].push(accountWithErrorDetectedCOUNTER)
        Logger.log("(resultCheck.length/2)+1: %s", ((resultCheck.length/2)+1))
        if(accountWithErrorDetectedCOUNTER > (resultCheck.length/2)+1)accountWithErrorDetected[index].push(false)
        else accountWithErrorDetected[index].push({accountName: arrayAds_FromGSheet[i].accountName, accountAdsId: arrayAds_FromGSheet[i].adsId, issue: arrayAds_FromGSheet[i].checkerIssue})
      }
      Logger.log("accountWithErrorDetectedCOUNTER: %s", accountWithErrorDetectedCOUNTER)
      Logger.log("accountWithErrorDetected: %s", accountWithErrorDetected)
      Logger.log("objUrlFromSheet: %s", objUrlFromSheet)
    }
/*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


    // ERREUR 500/400, OU "NO TAG", OU "Non-Indexable"
    if(startValues[1]) {
      //sendEmailAlertsV2(urlarray, responseArray, thedate);
      Logger.log("ALERTE DONC ENVOI EMAIL");
    }

    // Ajout de la date de dernière exécution
    if(startValues[0]) {
      addTimestampV2();
    }

    var lastColumn = shFollowUp.getLastColumn();

    if(lastColumn>199) {
      shFollowUp.deleteColumn(200);
    }

  } else {
    Logger.log("Not the right time to start: %s", startValues[2]);
  }
}
function checkUrls(urlarray, isAdCheck, infos){
  if(isAdCheck)infos = Array.isArray(infos) ? infos.join(';') : "variable 'infos' n'est pas un array => couldn't convert it"
  var responseArray = [];
  if(typeof from == "undefined")from="source"
  Logger.log(from)
  Logger.log(urlarray)

  // Démarre le script si cela fait 30 minutes qu'il a été exécuté ou qu'il a besoin de faire une vérification.

  var options= {muteHttpExceptions:true}
  var urlFetchedList = ""
  for(var i in urlarray) {
    erreur = false;

    var urlFetched = urlarray[i][0];
    urlFetchedList += urlFetched +";"

    try {
      var response = UrlFetchApp.fetch(
        urlFetched,
        options);
    }

    catch(err) {
      var erreur = true;
    }

    responseArray.push([])

    var pageState = "";

    if(erreur) {
      responseArray[i].push("500 | NO TAG | Non-indexable");
    } else {
      var pageSourceCode = response.getContentText('UTF-8');

      if(pageSourceCode.indexOf("?id=GTM-")>(-1)) {
        pageState = response.getResponseCode() + " | GTM OK";
      } else {
        if(pageSourceCode.indexOf("'UA-")>(-1) || pageSourceCode.indexOf('"UA-')>(-1)) {
          pageState = response.getResponseCode() +  " | GA OK";
        } else {
          pageState = response.getResponseCode() + " | NO TAG";
        }
      }

      if(pageSourceCode.indexOf('content="noindex"')>(-1)) {
        pageState += " | Non-Indexable";
      } else {
        pageState += " | Indexable";
      }
      if(isAdCheck)pageState += " | " + infos + " | " + urlFetchedList
      responseArray[i].push(pageState);
    }
    //responseArray[i].push(urlarray[i]);
  }
  return responseArray
}

//====================================================================| Script pause campagne |===================================================================//
/*
1) ON RECUPERE TOUS LES COMPTES ASSOCIES A L'ID EN ARGUMENT, PUIS ON ITERE DANS CETTE LISTE DE COMPTES(ASSOCIE A L'ID)
2) ON SE CONNECTE A CE COMPTE EN LE SELECTIONNANT
3) ON FAIT UNE ITERATION DANS TOUTES LES ANNONCES -ASSOCIEES AU COMPTE ASSOCIE A L'ID-
4) ON VERIFIE SI L'ANNONCE EST ACTIVE
5) SI ELLE EST ACTIVE, ON RECUPERE LA CAMPAGNE ASSOCIEE A CETTE ANNONCE, PUIS ON VERIFIE SI CETTE CAMPAGNE EST ACTIVE
6) SI CETTE CAMPAGNE EST ACTIVE, ON RECUPERE L'URL ASSOCIEE A L'ANNONCE
7) LORSQUE ON A RECUPERE 5 URL DANS L'ITERATION AU SEIN DES ANNONCES, ON STOP L'ITERATION, ET ON RETOURNE LE RESULTAT
*/
function getListUrlAdsCamp(id, url){
  /*-------------------------------------------------------*/
  /*----------------------1) ON RECUPERE TOUS LES COMPTES ASSOCIES A L'ID EN ARGUMENT, PUIS ON ITERE DANS CETTE LISTE DE COMPTES(ASSOCIE A L'ID)---------------------------------*/
  var accounts = AdsManagerApp
     .accounts().withIds([id]).get()
  /*
  var accountLabelIterator = AdsManagerApp
     .accountLabels().get()
  Logger.log("START??List of accountLabel??START")
  while (accountLabelIterator.hasNext()) {
    var accountLabel = accountLabelIterator.next();
    Logger.log(accountLabel.getName())
  }
  Logger.log("END--??List of accountLabel??--END")
  */
  var objAccounts = {}
  objAccounts["adsId"] = id
  objAccounts["urlFromSheet"] = url
  objAccounts["array_url_"+id] = []
  objAccounts["array_url"] = []
  objAccounts["array_checks"] = []
  objAccounts["array_adId_"+id] = []
  var i = j = 0
  while (accounts.hasNext()) {
    var arrayAccount = []
    Logger.log("i: %s", i++)
    var account = accounts.next()
    objAccounts.accountName = account.getName()
    Logger.log("account.getName(): %s", account.getName())
  /*----------------------2) ON SE CONNECTE A CE COMPTE EN LE SELECTIONNANT---------------------------------*/
    AdsManagerApp.select(account);

    /*
    var campaignSelector = AdsApp
    .campaigns()
    var campaignIterator = campaignSelector.get();
    while (campaignIterator.hasNext()) {
      Logger.log("j: %s", j++)
      var campaign = campaignIterator.next();
      Logger.log(campaign.getName())
    }
    */

  /*----------------------3) ON FAIT UNE ITERATION DANS TOUTES LES ANNONCES -ASSOCIEES AU COMPTE ASSOCIE A L'ID----------------------------------*/
    var boolAd = true
    var adSelector = AdsApp
      .ads()
    var adIterator = adSelector.get();
    while(adIterator.hasNext() && boolAd) {
      var objAd = {}
//      Logger.log("j: %s", j++)
      var ad = adIterator.next();
//      Logger.log("ad.isEnabled: %s", ad.isEnabled())
  /*----------------------4) ON VERIFIE SI L'ANNONCE EST ACTIVE---------------------------------*/
      if(ad.isEnabled()){
  /*----------------------5) SI ELLE EST ACTIVE, ON RECUPERE LA CAMPAGNE ASSOCIEE A CETTE ANNONCE, PUIS ON VERIFIE SI CETTE CAMPAGNE EST ACTIVE---------------------------------*/
        var adCampaign = ad.getCampaign()
//        Logger.log("adCampaign.isEnabled: %s", adCampaign.isEnabled())
        if(adCampaign.isEnabled()){
//          Logger.log("-------------------"+ad.urls().getFinalUrl()+"-------------------")
          if(objAccounts["array_url_"+id].indexOf(ad.urls().getFinalUrl()) == -1){
  /*----------------------6) SI CETTE CAMPAGNE EST ACTIVE, ON RECUPERE L'URL ASSOCIEE A L'ANNONCE---------------------------------*/
            objAccounts["array_url"].push([ad.urls().getFinalUrl()])
            objAccounts["array_url_"+id].push(ad.urls().getFinalUrl())
            objAccounts["array_adId_"+id].push(""+ad.getId())

            Logger.log(ad.urls().getFinalUrl())
            objAd.id = ad.getId()
            objAd.url = ad.urls().getFinalUrl()
            objAd.getDisplayUrl = ad.getDisplayUrl()
            objAd.getHeadline = ad.getHeadline()
            objAd.getEntityType = ad.getEntityType()
            objAd.getType = ad.getType()
            objAd.getFinalUrlSuffix = ad.urls().getFinalUrlSuffix()
            arrayAccount.push(objAd)
          }else{
/*            Logger.log("adCampaign.isEnabled(): %s", adCampaign.isEnabled())
            Logger.log("URL déjà parsé: %s", ad.urls().getFinalUrl())
            Logger.log(objAccounts["array_url_"+id])
            Logger.log("_______")*/
          }
        }
      }
//      Logger.log("objAd: %s", objAd)
      if(arrayAccount.length == 5){
        boolAd = false
        Logger.log('QUOTAT ATTEINT !!!!!! arrayAccount.length == 5')
      }
    }
    objAccounts["id_"+id] = arrayAccount
  }
  if(boolAd)Logger.log("-------------------Toutes les annonces ont été itérées-------------------")
  else Logger.log("-------------------5 urls ont été récupérés-------------------")
  Logger.log("objAccounts: %s", objAccounts)
  Logger.log("--------")
  return objAccounts
}
//====================================================================| Script check campagne status|===================================================================//
function checkEnableableAdsCamp(){

}
function compareIssues(array){
  var issues = JSON.parse(shFollowUp.getRange("C2").getValue())
  var issuesBIS = []
  for(var i in array)
    if(issues[i]){
      if(array[i].checkerIssue)issuesBIS[i] = true
      else issuesBIS[i] = false
    }
  shFollowUp.getRange("C2").setValue(JSON.stringify(issuesBIS))
  if(issuesBIS.length == issues.length)
    shFollowUp.getRange("C3").setValue(true)
  else shFollowUp.getRange("C3").setValue(false)

  return shFollowUp.getRange("C3").getValue()
}
//====================================================================| Script envoi d'emails |===================================================================//

function sendEmailAlertsV2(urlarray, responsearray, thedate) {

  var errors = String();
  var errcount = Number(0);
  var date = thedate.getDate() + "/" + completedate((thedate.getMonth()+1)) + "/" + thedate.getFullYear();

  var time = thedate.getHours() + "h" + completedate(thedate.getMinutes());

  var startRow = Number(8);
  var lr = shFollowUp.getLastRow();
  var suspendDate = shFollowUp.getRange("A" + startRow +":A"+ lr).getValues();


  var template = getTemplate();
  var header = template[0];
  var footer = template[1];
  var button = template[2];

  if((thedate.getHours()>7) && thedate.getHours()<21) {

    for(var i in responsearray) {
      var slicedvalue = String(responsearray[i][0]).slice(0,1);

      if(i==responsearray.length-1) {
        Logger.log("Dernier élément");
      }


      if(suspendDate[i][0] < thedate) {

        if (slicedvalue == "5" || slicedvalue =="4") {
          errors+= '<h2 style="text-align:center;font-size:20px">' + getDomain(urlarray[i][0]) + '</h2><p style="text-align:center;">Une erreur <b style="color:red;">' + responsearray[i][0].slice(0,3) + '</b> a été détectée depuis 5 minutes sur le site <b>' + urlarray[i][0] + '</b> à  <b>' + time + '</b> le <b>' + date + '</b>. <br><br><a ' + button + ' href= ' + urlarray[i][0] + '> Accéder au site </a><br></p><hr>';
          errcount++;
        } else if(responsearray[i][0].indexOf("NO TAG")>-1 && responsearray[i][0].indexOf("Non-Indexable")>-1) {
          errors+= '<h2 style="text-align:center;font-size:20px">' + getDomain(urlarray[i][0]) + '</h2><p style="text-align:center;">Une erreur de <b>tag et de no-index</b> a été détectée depuis 5 minutes sur le site <b>' + urlarray[i][0] + "</b> à  <b>" + time + "</b> le <b>" + date + '</b>. <br><br> <a ' + button + ' href= ' + urlarray[i][0] + ' > Accéder au site </a><br></p><hr>';
          errcount++;
        } else if(responsearray[i][0].indexOf("NO TAG")>-1) {
          errors+= '<h2 style="text-align:center;font-size:20px">' + getDomain(urlarray[i][0]) + '</h2><p style="text-align:center;">Une erreur de <b>tag GTM/GA</b> a été détectée depuis 5 minutes sur le site <b>' + urlarray[i][0] + "</b> à  <b>" + time + "</b> le <b>" + date + '</b>. <br><br> <a ' + button + ' href= ' + urlarray[i][0] + ' > Accéder au site </a><br></p><hr>';
          errcount++;
        } else if(responsearray[i][0].indexOf("Non-Indexable")>-1) {
          errors+= '<h2 style="text-align:center;font-size:20px">' + getDomain(urlarray[i][0]) + '</h2><p style="text-align:center;">Une erreur de <b>balise no-index</b> a été détectée depuis 5 minutes sur le site <b>' + urlarray[i][0] + "</b> à  <b>" + time + "</b> le <b>" + date + '</b>. <br><br> <a ' + button + ' href= ' + urlarray[i][0] + ' > Accéder au site </a><br></p><hr>';
          errcount++;
        }
      }
    }
  }

  if(errcount==0) {
    var errors = String("ALL GOOD");
  }

  var contacts = getEmailsBdd("global","email");
  //var contacts = [["Arnaud","arnaud@mindfruits.biz"]] // Contact test

  for(var b in contacts) {
    if(errors!="ALL GOOD" && errcount==1) {
      var body = header + '<p>Bonjour ' + contacts[b][0] + ',</p><b>1 erreur</b> rencontrée lors du crawl des sites que nous gérons, vous trouverez le rapport ci-dessous :</p><hr><p>' + errors + '</p><p style="text-align:center;">Veillez à corriger ces erreurs rapidement.</p>' + footer;
      Logger.log(body);
      MailApp.sendEmail({
        to:contacts[b][1],
        subject: "[SCRIPT] Erreur sur le site d'un client | " + time + " le " + date,
        htmlBody: body
      });
    }

    if(errors!="ALL GOOD" && errcount>1) {
      var body = header + '<p>Bonjour ' + contacts[b][0] + ',</p><b>' + errcount + ' erreurs</b> rencontrées lors du crawl des sites que nous gérons, vous trouverez le rapport ci-dessous :</p><hr><p>' + errors + '</p><p style="text-align:center;">Veillez à corriger ces erreurs rapidement.</p>' + footer;
      MailApp.sendEmail({
        to:contacts[b][1],
        subject: "[SCRIPT] Erreur sur plusieurs sites de clients | " + time + " le " + date,
        htmlBody: body
      });
    }
  }
}

// Mise à jour des URL en suivant les données de la BDD Globale
function updateUrlList() {
  var bddAnalyticsURl = getAllInBdd('global','URL','Site Check');
  var bddAnalyticsGAdsID = bddAnalyticsURl.pop()
  var followUpLastRow = shFollowUp.getLastRow();
  var currentUrls = shFollowUp.getRange(8,2,followUpLastRow -7,1).getValues();

  // Boucle dans les Urls actuelles pour supprimer les Urls qui ont été enlevés dans la BDD
  for (var iteCurrentUrls in currentUrls) {
    var currentRow = parseFloat(8) + parseFloat(iteCurrentUrls);
    var positionOfUrl = bddAnalyticsURl.indexOf(currentUrls[iteCurrentUrls][0]);

    if(positionOfUrl == -1) {
      shFollowUp.deleteRow(currentRow);
    }
  }

  // Array qui contient les nouvelles Urls à ajouter dans les Urls actuelles
  var followUpLastRow = shFollowUp.getLastRow();
  var currentUrls = to1dArray(shFollowUp.getRange(8,2,followUpLastRow -7,1).getValues());
  var newUrls = [];

  // Boucle dans la BDD pour ajouter dans un Array les nouvelles Urls
  for (var iteBddUrls in bddAnalyticsURl) {
    var bddRow = parseFloat(8) + parseFloat(iteBddUrls);
    var positionOfBddsUrl = currentUrls.indexOf(bddAnalyticsURl[iteBddUrls]);

    if(positionOfBddsUrl == -1) {
      newUrls.push([bddAnalyticsURl[iteBddUrls]]);
    }
  }
  if(newUrls.length>0) {
    shFollowUp.getRange(followUpLastRow +1,2,newUrls.length,newUrls[0].length).setValues(newUrls).setBorder(true, true, true, true, true, true);
  }


  return bddAnalyticsGAdsID
}

// Transforme un array 2D avec une colonne en array 1D
function to1dArray(currentUrls) {
  var array1dCurrentUrls = [];
  for (var iteCurrentUrls in currentUrls) {
    array1dCurrentUrls.push(currentUrls[iteCurrentUrls][0]);
  }
  return array1dCurrentUrls;
}

//Fonction qui va extraire le nom du site dans l'url
function getDomain(fullUrl) {
  //var fullUrl = urlarray[i][0];
  if(fullUrl.indexOf("ttp")>(-1)) {
    var host = fullUrl.slice((fullUrl.indexOf("//")+2),(fullUrl.indexOf("/",8))).replace("www.","").toLowerCase();
  } else {
    var host = fullUrl.slice(0,(fullUrl.indexOf("/",8))).replace("www.","").toLowerCase();
  }
  var siteName = host.slice(0,(host.indexOf(".",8))).replace("www.","").toUpperCase();
  siteName = siteName.replace(/-/g," ");
  siteName = siteName.replace(/_/g," ");

  return siteName;
}

// Fonction qui va déterminer si le script peut se lancer et s'il nécessaire de faire une seconde vérification
function canStartV2() {
  var timeDiff = getTimeDiffV2();
  var reCheck = false;
  var freshCheck = false;
  var lastCheckResults = shFollowUp.getRange("B8:C" + shFollowUp.getLastRow()).getValues();

  if(timeDiff<8) {
    for(var result in lastCheckResults) {
      var currentUrl = String(lastCheckResults[result][0]);
      if(result==lastCheckResults.length-1) {
        Logger.log("Dernier élément");
      }
      if((String(lastCheckResults[result][1]).indexOf("50")>-1) || (lastCheckResults[result][1].indexOf("40")>-1) || (lastCheckResults[result][1].indexOf("NO TAG")>-1) || (lastCheckResults[result][1].indexOf("Non-Indexable")>-1)) {
        reCheck = true;
      }
    }
  } else if(timeDiff > 28) {
    freshCheck = true;
  }

  return [freshCheck, reCheck, timeDiff];
}

function getTimeDiffV2() {
  var lastExeTime = shFollowUp.getRange("A6").getValue();
  var timeNow = new Date();

  var timeDiff = (timeNow - lastExeTime)/60000;
  return (timeDiff);
}

// Ajoute le timestamp
function addTimestampV2() {
  shFollowUp.getRange("A6").setValue(new Date());
}
