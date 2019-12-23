// Fonction qui explore une BDD pour en sortir la colonne désirée.
function getAllInBdd(bddChosenName, chosenData, filter) {
  var firstRowOffset = 1;
  var shChosen = shBdd.getSheetByName(bddChosenName);
  
  var LastRow = shChosen.getLastRow();
  var LastColumn = shChosen.getLastColumn();
  


  var globalData = shChosen.getRange(1+firstRowOffset, 1, LastRow-firstRowOffset ,LastColumn).getValues();
  var headers = globalData[0];  
  var chosenDataArray = [];
  
  var chosenDataPos = headers.indexOf(chosenData);
  var filterPos = headers.indexOf(filter);
  
  for(var i  in globalData) {
    if(globalData[i][filterPos] == "Oui") {
      chosenDataArray.push(globalData[i][chosenDataPos]);
    }
  }
  
  Logger.log(chosenDataArray);
  return chosenDataArray;
}

function testGetAllInBdd() {
  var chosenData = "URL";
  var filter = "Reporting Analytics";
  var bddChosenName = "global";
  getAllInBdd(bddChosenName, chosenData, filter);
}