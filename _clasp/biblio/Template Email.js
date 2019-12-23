function htmlMfEmailTemplate() {
  var eMailTemplate = shBddTemplate.getRange("C4:C7").getValues();
  var header = eMailTemplate[0][0];
  var footer = eMailTemplate[1][0];
  var footerIntern = eMailTemplate[2][0];
  var button = eMailTemplate[3][0];
  return [header,footer,footerIntern,button];
}

function renderHtmlMfEmailTemplate() {
  var htmlBody = "<p>Salut</p><p>C'est un test</p><p>Cordialement</p>";  
  var template = htmlMfEmailTemplate();
  
  if(htmlBody) {
    var previewTemplate = HtmlService.createHtmlOutput(template[0] + htmlBody + template[1]).setWidth(1200).setHeight(2000);
    SpreadsheetApp.getUi().showModalDialog(previewTemplate, "Ci-après la preview de la template :")
  }
}

// Ajoute un menu pour lancer le script
function addTemplatePreviewMenu() {
  var menu = SpreadsheetApp.getUi();
  
  menu.createMenu("Scripts")
  .addItem("Test template", 'renderHtmlMfEmailTemplate')
  .addToUi();

}
