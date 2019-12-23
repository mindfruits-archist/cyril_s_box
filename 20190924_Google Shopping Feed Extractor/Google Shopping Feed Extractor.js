//============================================================================================================================================================//
//============================================================================================================================================================//
//======================| Google Shopping Feed Extractor  V0.1 | 25/09/2018 | Créé par Arnaud Guissani & Cyrille Achi pour Mindfruits SARL |==================//
//============================================================================================================================================================//
//============================================================================================================================================================//

// Documentation Content API : https://developers.google.com/shopping-content/v2/reference/v2.1/products/list

// Définition des variables globales
var spreadsheetBdd = SpreadsheetApp.getActiveSpreadsheet();
var sheetBdd = spreadsheetBdd.getSheetByName("Feed");
var exclude_from_products = [0, 2, 4, 9, 11, 12, 13, 14]

function extractProductFromMerchantCenter () {

  // Flux Accessoires Asus :
 var merchantId = "10840734";
 var dataFeedId = "110483257";  
  
  var optArgs = {
    "maxResults" : "250"
 };
  
  var pageToken = "start";
  var productArray = [];
  var productArrayIterator = 0;
  var feedTitles = []
  
  // Boucle pour extraire tous les produits en parcourant les différentes pages comme chaque appel limite les résultats à 250 produits
  while(pageToken) {
    // List all the products for a given merchant.
    var products = ShoppingContent.Products.list(merchantId,optArgs);
    if(!tmp) {
      // Récupération de l'array qui contient les entêtes de de la base de données
      var tmp = Object.keys(products.resources[0])
      for(a in tmp){
        a = parseInt(a)
        if(exclude_from_products.indexOf(a) == -1){
          feedTitles.push(tmp[a])
        }
      }
      
      // Collage des entêtes
      sheetBdd.getRange(1,1,1,feedTitles.length).setValues([feedTitles]);
    }
      
    // Récupération du token de la page suivante
    pageToken = products.nextPageToken;
    
    
    // Stockage des produits issus de l'API
    var productObjects = products.resources;
    
    // Ajout des produits dans un array pour coller ensuite dans la BDD
    for(var product in productObjects) {
      if(productObjects[product].targetCountry=="FR") {
        productArray.push([]);
        for(var header in feedTitles) {
          productArray[productArrayIterator].push(productObjects[product][feedTitles[header]]);
        }
        productArrayIterator++;
      }
    }
    
    Logger.log("Il y a eu " + productArrayIterator + " produits récupérés.");
    
    //var pageToken = undefined;
    
    var optArgs = {
      "maxResults" : "250",
      "pageToken" : pageToken
    };
  }
  //sheetBdd.getRange(2,1,productArray.length,productArray[0].length).setValues(productArray);
  //Logger.log(productArray);
}