// DOCUMENTATION : https://developers.facebook.com/docs/marketing-api/insights
// METRICS & PARAMETRES : https://developers.facebook.com/docs/marketing-api/insights/parameters
// Process pour étendre la validité du jeton d'accès. Ouvrir API Graph (https://developers.facebook.com/tools/explorer/) et faire une requête simple sur un compte publicitaire. Ensuite, récupérer le Jeton d'accès généré et l'ouvrir avec l'outil de débogage des jetons (https://developers.facebook.com/tools/debug/accesstoken/). Lancer le débogage du jeton puis cliquer le bouton en bas "Etendre la durée du Jeton" et le tour est joué !

var spreadsheet = "";
var sheet = "";
var actionsHeaders = ["comment","like","offsite_conversion.fb_pixel_add_to_cart","offsite_conversion.fb_pixel_purchase","offsite_conversion.fb_pixel_search","offsite_conversion.fb_pixel_view_content","post","landing_page_view","commerce_event","link_click","offsite_conversion","page_engagement","post_engagement","post_reaction","video_view"];
var action_ValueHeaders = ["offsite_conversion.fb_pixel_initiate_checkout", "offsite_conversion.fb_pixel_purchase", "offsite_conversion.fb_pixel_add_payment_info", "offsite_conversion.fb_pixel_add_to_cart", "offsite_conversion.fb_pixel_view_content", "omni_initiated_checkout", "omni_purchase", "add_payment_info", "omni_add_to_cart", "omni_view_content", "omni_search"];

var offset = 0;

function getAdsStats(spUrl,accountId,offsetMax) {
  spreadsheet = SpreadsheetApp.openByUrl(spUrl);
  sheet = spreadsheet.getSheetByName("Database");
  var token = getFbAdsToken();
  var adAccountId = accountId;
  var metrics = "inline_post_engagement, impressions,clicks,action_values,frequency,spend,reach,actions,campaign_name";
  // var metrics = "impressions,clicks,total_action_value,frequency,cpc,cpm,cpp,spend,reach,actions,call_to_action_clicks,outbound_clicks,social_clicks,social_impressions,social_spend,total_actions,total_unique_actions,unique_actions,unique_clicks,unique_inline_link_clicks,unique_link_clicks_ctr,unique_outbound_clicks,unique_social_clicks,website_purchase_roas";
  // nwsfeed_avg_position,news_feed_clicks,newsfeed_impressions,unique_impressions,

  var dataArray = [];
  var dataRow = [];
  var dataArrayOffset = 0;

  // Boucle afin de faire des appels par mois pour éviter un appel trop volumineux
  for(offset = offsetMax; offset > -1; offset--) {

    var dateStart = "";
    var dateStop = "";
    var time_ranges = offset > 0 ? getDateRange("YYYY-MM-DD") : getDateRange("YYYY-MM-DD", 'now')
    var time_range = encodeURIComponent("{'since':'" + time_ranges[0] + "','until':'" + time_ranges[1] + "'}")
    var nextStatus = true;

    var query = "https://graph.facebook.com/v4.0/act_" + adAccountId + "/insights?time_range=" + time_range + "&time_increment=monthly&period=month&level=campaign&breakdowns=region&limit=500&fields=" + metrics + "&access_token=" + token;
    Logger.log("Query = " + query);
    Logger.log("time_ranges: " + time_ranges)

    var response = getUrl(query);

    // Boucle pour assembler toutes les pages de la requête
    while(nextStatus) {
      // Gestion des erreurs si problème dans la requête
      if(response[0]) {
        Logger.log("//===================================================//");
        Logger.log("//== ERREUR LORS DE LA TENTATIVE DE REQUÊTE VERS L'API INSIGHTS ==//");
        Logger.log("//== "+ response[0] + " ==//");
        Logger.log("//===================================================//");
      } else {

        var resJSON = JSON.parse(response[1]);
        if(resJSON.error) {
          Logger.log("//===================================================//")
          Logger.log("//== ERREUR LORS DE LA REQUÊTE VERS L'API INSIGHTS ==//")
          Logger.log("//== Message :"+ resJSON.error.message + " ==//")
          Logger.log("//== Type :"+ resJSON.error.type + " ==//")
          Logger.log("//===================================================//")
          Browser.msgBox(resJSON.error.message, resJSON.error.type, Browser.Buttons.YES_NO);
        } else {

          // Extraction et remise en forme des données :
          var data = resJSON.data;
          var dataLen = data.length;

          // Itération dans les données quotidiennes pour transformer en array
          for(var dailyData = 1; dailyData < (dataLen); dailyData++) {

            // Extraction des headers hors actions
            var headers = cleanHeaders(Object.keys(data[0]));
            dataArray.push([])
            dataRow = data[dailyData];

            // Itération dans l'objet qui contient les données pour le jour actuel
            for(var object in headers) {
              var currentHeader= headers[object];
              var currentHeaderValue= dataRow[headers[object]];
              var posInDataArray = dailyData-1+dataArrayOffset;

              if(dataRow[headers[object]] == undefined) {
                dataArray[dailyData-1+dataArrayOffset].push("");
              } else {
                dataArray[dailyData-1+dataArrayOffset].push(dataRow[headers[object]].toString().replace(".",","));
              }
            }

            // Ajout des données liées aux actions dans l'array
            if(metrics.indexOf("actions")>(-1)) {
              var actions = getActions(dataRow,"actions",actionsHeaders);
              for(var action in actions) {
                dataArray[dailyData-1+dataArrayOffset].push(actions[action]);
              }
            }

            // Ajout des données liées aux action_values dans l'array
            if(metrics.indexOf("action_values")>(-1)) {
              var actions = getActions(dataRow,"action_values",action_ValueHeaders);
              for(var action in actions) {
                dataArray[dailyData-1+dataArrayOffset].push(actions[action]);
              }
            }
          }

          // Ajout des headers d'actions si existant
          if(actionsHeaders.length > 0) {
            for(var header in actionsHeaders) {
              headers.push(actionsHeaders[header]);
            }
          }

          // Ajout des headers d'actions si existant
          if(action_ValueHeaders.length > 0) {
            for(var header in action_ValueHeaders) {
              headers.push(action_ValueHeaders[header] + ".value");
            }
          }

          // Incrémentation du dataArrayOffset pour prendre en compte le décalage des jours dû à la limite de 500 résultats par requête
          dataArrayOffset = dataArrayOffset + dailyData-1;

          //sheet.getRange(1,sheet.getLastColumn(),2,actions[0].length).setValues(actions);
        }

        // Boucle pour continuer l'extraction des données si la requête contient une page suivante.
        if(resJSON.paging.next) {
          nextStatus = true;
          var response = getUrl(resJSON.paging.next);
        } else {
          nextStatus = false;
        }
      }
    }

    // Nettoyage de la feuille
    sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).setValue("");

    // Ajout des headers dans la feuille
    sheet.getRange(1,1,1,headers.length).setValues([headers]);

  }

  // Ajout des données
  sheet.getRange(2,1,dataArray.length,dataArray[0].length).setValues(dataArray);
}

// Extrait toutes la data liée aux actions
function getActions(data,actionName, actionsHeaders) {
  //if(actionName=="action_values")Logger.log("__________________________________oook"+actionName)
  var allActions = data[actionName];
  var actionRow = {};
  var actionsArray = [];
  var actionsHeaders = actionsHeaders;

  // Création de l'array pour les Headers si inexistant
  if(actionsHeaders.length == 0) {
    for(var action in allActions) {
      actionsHeaders.push(allActions[action].action_type);
    }
  }
  //if(actionName=="action_values")           Logger.log(actionsHeaders)

  // Transformation de l'array "Actions" en Objet
  for(var action in allActions) {
    actionRow[allActions[action].action_type] = parseFloat(allActions[action].value);
  }
  //if(actionName=="action_values")          Logger.log(allActions)

  for(var action in actionsHeaders) {
    if(actionRow[actionsHeaders[action]] == undefined) {
      actionsArray.push("");
    } else {
      actionsArray.push(actionRow[actionsHeaders[action]]);
    }
  }

  //if(actionName=="action_values")Logger.log("kkko__________________________________")
  return actionsArray;
}

// Fonction pour effectuer une requête GET
function getUrl(url) {

  var options = {
    muteHttpExceptions:true,
  }

 try {
  var response = UrlFetchApp.fetch(
    url,
    options);
  }

  catch(err) {
    return ["Erreur lors de la requête " + url];
  }

  var rText = response.getContentText("UTF-8");

  return ["",rText];
}

function cleanHeaders(headers) {
  var index = headers.indexOf("actions");
  if (index > -1) {
    headers.splice(index, 1);
  }
  var index = headers.indexOf("action_values");
  if (index > -1) {
    headers.splice(index, 1);
  }
  return headers;
}
