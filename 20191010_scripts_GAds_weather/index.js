var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  console.log(sansAccent("ô"));
  console.log(`
      Que fait ce script node ?:\n
      - Il ajoute aux deux json {demographie, departements}, les geocodes associés (dans le json google_BDD)\n
      - Puis les affiches sur le localhost dans une page html classique\n
      - Il ne reste plus qu'a faire un copié-collé pour récupérer le nouveau json...
  `);
  res.writeHead(200, {'Content-Type': 'text/html'});
  let html5 = fs.readFileSync(__dirname + '/html5.html', 'utf8');
  const demographie_ = JSON.parse(demographie = fs.readFileSync(__dirname + '/demographie.json', 'utf8'));
  const departements_ = JSON.parse(departements = fs.readFileSync(__dirname + '/departements.json', 'utf8'));
  const google_BDD_ = JSON.parse(google_BDD = fs.readFileSync(__dirname + '/GoogleAdsGeoCode_BDD.json', 'utf8'));

  demographie_[0].push("geoCode")
  for(a in demographie_)if(a != 0){
    for(aa in google_BDD_)if(aa != 0){
      //console.log(demographie_[a][1] + " == " + google_BDD_[aa][1]);
      if(demographie_[a][1] == google_BDD_[aa][1] && google_BDD_[aa].length == 3)
        demographie_[a].push(google_BDD_[aa][0])
    }
    if(demographie_[a].length == 5)
      demographie_[a].push("???")
  }

  departements_[0][2] = "geoCode"
  for(a in departements_)if(a != 0){
    for(aa in google_BDD_)if(aa != 0 && google_BDD_[aa][4] && google_BDD_[aa][4] == "Department"){
      //console.log(demographie_[a][1] + " == " + google_BDD_[aa][1]);
      if(sansAccent(departements_[a][1]) == google_BDD_[aa][1])
        departements_[a][2] = google_BDD_[aa][0]
    }
    if(isNaN(parseInt(departements_[a][2])))
      departements_[a][2] = "???"
  }
//MANQUE LA BOUCLE SUR LES REGIONS

  html5 = html5.replace('{{demographie}}', JSON.stringify(demographie_))
  html5 = html5.replace('{{departements}}', JSON.stringify(departements_))

  res.write(html5)
  res.end()
}).listen(8080);

var sansAccent = function(x){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    var str = x;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}
