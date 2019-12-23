function testGaAnalytics() {
  var detail = '133283344';
  getAnalyticsIds(detail);
}

function testexplorebdd() {
  var name = "Arnaud"
  var request = "email"
  var test = exploreglobalbdd(name,request)
}

function testgetemailsbdd() {
  var type = "adwords";
  var email = "gmail";
  Logger.log(getemailsbdd(type,email))
}

function testextractemails() {
  var type = "adwords";
  var email = "email";
  Logger.log(extractemails(type,email))

}


function testextractemailString() {
  var type = "adwords";
  var email = "email";
  Logger.log(extractemailString(type,email))

}

function testperson() {
  var person = [];
  person.push([]);
  person[0]["firstName"] = "John";
  person[0]["lastName"] = "Doe";
  person[0]["age"] = 46;
  person.push([]);
  person[1]["firstName"] = "Bryan";
  person[1]["lastName"] = "Dolle";
  person[1]["age"] = 47; 
  Logger.log(person)
}

function testarrayNE() {
  var arrayNE = getarrayne() // MAJ V3.3 du script
  var nbmail = countmail(arrayNE)
  
  for (var countmail = 0; countmail <arrayNE.length ; countmail++) {
    Logger.log("email = " + countmail)
  }
      
}