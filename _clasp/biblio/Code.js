// Fonction qui trouve le nom de la colonne en fonction du chiffre.
function getcolumn(a) {
 var b = 26
 var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

 var column = String();
 
 if (a<26) {
   column = alphabet[a]
 } else {
   column = alphabet[((a-(a%b))/b)-1]
   column = column + alphabet[(a%b)]
 }
  
 return column
}

// Fonction qui enlève toutes les balises html dans du texte
function cleanhtmlcode(val) {
  
  while(val.indexOf("<")>(-1)) {
    var starta = 0
    var enda = val.indexOf("<",starta)
    var startb = val.indexOf(">",(enda+1))+1
    var endb = val.length
    
    val = val.slice(starta,enda) + val.slice(startb,endb)
  }

  return val
}


//Function to round with 2 figures after comma
function round(conversion) {
  var conv = conversion
  if (conv.indexOf(".")>0) {
    var round = parseFloat(conv)*100
    round = Math.round(round)/100
  }
  conv = round 
  return conv
}

// Fonction qui ajoute un "0" dans le cas où un chiffre de date ou heure est inférieur à 10
// Exemple, transforme 10h2 en 10h02
function completedate(time) {
  var times = String();
  
  if(time<10) {
    times = "0" + String(time)
    return times
  } else {
    return time
  }
  
}


// Fonction qui converti les caractères du format HTML vers un format lisible
function converthtml(toconvert) {
  toconvert = toconvert.replace(/&nbsp;/g," ")
  toconvert = toconvert.replace(/&amp;/g,"&")
  toconvert = toconvert.replace(/&euro;/g,"€")
  toconvert = toconvert.replace(/&pound;/g,"£")
  toconvert = toconvert.replace(/&yen;/g,"¥")
  toconvert = toconvert.replace(/&quot;/g,'"')
  toconvert = toconvert.replace(/&copy;/g,"©")
  toconvert = toconvert.replace(/&ccedil;/g,"ç")
  toconvert = toconvert.replace(/&reg;/g,"®")
  toconvert = toconvert.replace(/&larr;/g,"← →")
  toconvert = toconvert.replace(/&uarr;/g,"↑ ↓")
  toconvert = toconvert.replace(/&sect;/g,"§")
  toconvert = toconvert.replace(/&para;/g,"¶")
  toconvert = toconvert.replace(/&iquest;/g,"¿")
  toconvert = toconvert.replace(/&raquo;/g,"»")
  toconvert = toconvert.replace(/&laquo;/g,"«")
  toconvert = toconvert.replace(/&micro;/g,"µ")
  toconvert = toconvert.replace(/&brvbar;/g,"¦")
  toconvert = toconvert.replace(/&spades;/g,"♠")
  toconvert = toconvert.replace(/&clubs;/g,"♣")
  toconvert = toconvert.replace(/&hearts;/g,"♥")
  toconvert = toconvert.replace(/&diams;/g,"♦")
  toconvert = toconvert.replace(/&alpha;/g,"α")
  toconvert = toconvert.replace(/&beta;/g,"β")
  toconvert = toconvert.replace(/&chi;/g,"χ")
  toconvert = toconvert.replace(/&gamma;/g,"γ")
  toconvert = toconvert.replace(/&omega;/g,"ω")
  toconvert = toconvert.replace(/&Omega;/g,"Ω")
  toconvert = toconvert.replace(/&Phi;/g,"Φ")
  toconvert = toconvert.replace(/&Delta;/g,"Δ")
  toconvert = toconvert.replace(/&Gamma;/g,"Γ")
  toconvert = toconvert.replace(/&Theta;/g,"Θ")
  toconvert = toconvert.replace(/&Lambda;/g,"Λ")
  toconvert = toconvert.replace(/&Sigma;/g,"Σ")
  toconvert = toconvert.replace(/&epsi;/g,"ε")
  toconvert = toconvert.replace(/&zeta;/g,"ζ")
  toconvert = toconvert.replace(/&eta;/g,"η")
  toconvert = toconvert.replace(/&iota;/g,"ι")
  toconvert = toconvert.replace(/&kappa;/g,"κ")
  toconvert = toconvert.replace(/&lambda;/g,"λ")
  toconvert = toconvert.replace(/&mu;/g,"μ")
  toconvert = toconvert.replace(/&nu;/g,"ν")
  toconvert = toconvert.replace(/&xi;/g,"ξ")
  toconvert = toconvert.replace(/&pi;/g,"π")
  toconvert = toconvert.replace(/&rho;/g,"ρ")
  toconvert = toconvert.replace(/&chi;/g,"χ")
  toconvert = toconvert.replace(/&upsi;/g,"υ")
  toconvert = toconvert.replace(/&sigmav;/g,"ς")
  toconvert = toconvert.replace(/&Aacute;/g,"Á")
  toconvert = toconvert.replace(/&aacute;/g,"á")
  toconvert = toconvert.replace(/&Acirc;/g,"Â")
  toconvert = toconvert.replace(/&acirc;/g,"â")
  toconvert = toconvert.replace(/&agrave;/g,"à")
  toconvert = toconvert.replace(/&aring;/g,"å")
  toconvert = toconvert.replace(/&aelig/g,"æ")
  toconvert = toconvert.replace(/&eacute;/g,"é")
  toconvert = toconvert.replace(/&ecirc;/g,"ê")
  toconvert = toconvert.replace(/&egrave;/g,"è")
  toconvert = toconvert.replace(/&euml;/g,"ë")
  toconvert = toconvert.replace(/&icirc;/g,"î")
  toconvert = toconvert.replace(/&iuml;/g,"ï")
  toconvert = toconvert.replace(/&iacute;/g,"í")
  toconvert = toconvert.replace(/&igrave;/g,"ì")
  toconvert = toconvert.replace(/&ocirc;/g,"ô")
  toconvert = toconvert.replace(/&ouml;/g,"ö")
  toconvert = toconvert.replace(/&otilde;/g,"õ")
  toconvert = toconvert.replace(/&oslash;/g,"Ø")
  toconvert = toconvert.replace(/&œ/g,"œ")
  toconvert = toconvert.replace(/&ucirc;/g,"û")
  toconvert = toconvert.replace(/&ugrave;/g,"ù")
  toconvert = toconvert.replace(/&uacute;/g,"ú")
  toconvert = toconvert.replace(/&uuml;/g,"ü")
  toconvert = toconvert.replace(/&yacute;/g,"ý")
  toconvert = toconvert.replace(/&yuml;/g,"ÿ")
  toconvert = toconvert.replace(/&deg;/g,"°")
  toconvert = toconvert.replace(/&permil;/g,"‰")
  toconvert = toconvert.replace(/&prime;/g,"′")
  toconvert = toconvert.replace(/&Prime;/g,"″")
  toconvert = toconvert.replace(/&infin;/g,"∞")
  toconvert = toconvert.replace(/&plusmn;/g,"±")
  toconvert = toconvert.replace(/&times;/g,"×")
  toconvert = toconvert.replace(/&divide;/g,"÷")
  toconvert = toconvert.replace(/&lt;/g,"<")
  toconvert = toconvert.replace(/&gt;/g,">")
  toconvert = toconvert.replace(/&frac14;/g,"¼")
  toconvert = toconvert.replace(/&frac12;/g,"½")
  toconvert = toconvert.replace(/&frac34;/g,"¾")
  toconvert = toconvert.replace(/&sup1;/g,"¹")
  toconvert = toconvert.replace(/&sup2;/g,"²")
  toconvert = toconvert.replace(/&sup3;/g,"³")
  
  return toconvert
}

function testconver() {
  var toconvert = "Je mange des &larr; souris &Aacute; Paris"
  Logger.log(converthtml(toconvert))

}