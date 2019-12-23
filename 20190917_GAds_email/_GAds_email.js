//INITIALISATION DES VARIABLES EXTRAITES: {spBdd, sheetPeople, sheetGlobal, sheetEmail}
var spBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/edit#gid=0");
var sheetPeople = spBdd.getSheetByName("people");
var sheetGlobal = spBdd.getSheetByName("global");
var sheetEmail = spBdd.getSheetByName("Email");



/**
//FONCTION POUR RECUPERER LES 2 INTERVALLES lundi-dimanche DE LA SEMAINE D'AVANT ET DE LA SEMAINE D'AVANT...LA SEMAINE  D'AVANT
* @return JSON{prev: {debut: val, fin: val}, prevprev: {debut: val, fin: val}}
**/
function dates_for_stats() {
  var a = new Date()
  while(a.getDay()!=1)a = new Date(a.getFullYear(),a.getMonth(),a.getDate()-1)
  b = new Date(a.getFullYear(),a.getMonth(),a.getDate()-1)
  d = new Date(a.getFullYear(),a.getMonth(),a.getDate()-(1+7))
  a = new Date(a.getFullYear(),a.getMonth(),a.getDate()-7)
  c = new Date(a.getFullYear(),a.getMonth(),a.getDate()-7)
  return {prev: {debut: a, fin: b}, prevprev: {debut: c, fin: d}}
}
/**
//RETOURNE LA DATE POUR GAds (AU FORMAT ANGLAIS: YYYYMMJJ) 
* @return string(YYYYMMJJ)
**/
function get_date(x) {
  return x.getFullYear()+""+
          ((x.getMonth()+"").length===1?'0'+(x.getMonth() + 1):x.getMonth())+""+
          ((x.getDate()+"").length===1?'0'+x.getDate():x.getDate())
}
/**
//RETOURNE LA DATE POUR AFFICHER 5AU FORMAT FRANCAIS: JJ/MM/YYYY
* @return string(JJ/MM/YYYY)
**/
function get_dateFR(x) {
  return  ((x.getDate()+"").length===1?'0'+x.getDate():x.getDate())+"/"+
          ((x.getMonth()+"").length===1?'0'+(x.getMonth() + 1):x.getMonth())+"/"+x.getFullYear()
}
/**
//FONCTION principale main: 
* @return null
* @call function::email
**/
function main() {
  //INITIALISATION DE VARIABLES
  var tmp = me = others = ""
  var global = []
  //RECUPERER L'OBJET ASSOCIANT LES MANAGERS A L'ID DE LEURS DIFFERENTS PROJETS GAds
  //ET LES DUPLIQUER POUR EVITER LES EFFETS DE BORD
  var everybody = getEverybody()
  var everybody_prev = d_o(everybody)
  var everybody_prevprev = d_o(everybody)
  //RECUPERER LES 2 DATES lundi-dimanche DES DEUX SEMAINES D'AVNT DE LA SEMAINE COURANT D'aUJOURD'HUI
  var stat_dates = dates_for_stats()
  //RECUPERATION DES FRAGMENTS DU TEMPLATES POUR LES EMAILS mindfruits
  var tab_email_tpl = sheetEmail.getRange("C4:C7").getValues();
  var EMAIL_header = tab_email_tpl[0]
  var EMAIL_footer = tab_email_tpl[1]
  var EMAIL_footerinterne = tab_email_tpl[2]

                                                                                                                /**
                                                                                                                IL FAUDRAIT RECUPERER LES INFOS POUR TOUS LES GAdsId
                                                                                                                ET SEULEMENT ENSUITE
                                                                                                                BOUCLER everybody POUR REMPLACER CHAQUE GAdsId PAR LES INFOS SOUHAITEES
                                                                                                                 <== certainement moins gourmand en ressources
                                                                                                                **/
  //RECUPERER LES OBJETS DE COMPTES GAds ASSOCIES UN ARRAY D'ID GAds
  //everybody_prev EST UNE COPIE DE everybody <== POUR EVITER LES EFFETS DE BORD
  for(manager in everybody){
    //2 PAIRES D'OBJETS SEMBLABLES SONT CREES POUR CHAQUE MANAGER,
    //CHAQUE PAIRES CONTIENT: 1-les comptes associés au manager
    //                        2-les autres comptes (gérés par d'autres managers)
    var managedAccountsMe = AdsManagerApp.accounts()
      .withIds(everybody_prev[manager].me)
      .get();
    var managedAccountsOthers = AdsManagerApp.accounts()
      .withIds(everybody_prev[manager].others)
      .get();
    var managedAccountsMe_ = AdsManagerApp.accounts()
      .withIds(everybody_prev[manager].me)
      .get();
    var managedAccountsOthers_ = AdsManagerApp.accounts()
      .withIds(everybody_prev[manager].others)
      .get();
    //REMPLACER DANS everybody_prev LES ARRAYS D'ID GAds, PAR LEUR ARRAY D'OBJETS GAds ASSOCIE.
    //CHAQUE NUMERO D'ID EST REMPLACE PAR L'OBJET ASSOCIE A CETTE ID
    everybody_prev[manager].me = get_infos([managedAccountsMe, managedAccountsMe_], stat_dates)
    everybody_prev[manager].others = get_infos([managedAccountsOthers, managedAccountsOthers_], stat_dates)
  }
  
  //DUPLIQUE everybody_prev POUR EVITER LES EFFETS DE BORD
  var everybody_prev_copy = d_o(everybody_prev)
  
  //*** everybody_prevprev_copy DOIT ETRE COMPARE AVEC everybody_prev AFIN DE RENDRE LA LA DERNIERE VALEUR DES CASES DANS L'EMAIL (l'évolution de stat) ***//
  var everybody_prevprev_copy = d_o(everybody_prevprev)
  //*** everybody_prevprev_copy DOIT ETRE COMPARE AVEC everybody_prev AFIN DE RENDRE LA LA DERNIERE VALEUR DES CASES DANS L'EMAIL (l'évolution de stat) ***//
  
  
  //REMPLACER CHAQUE CLE CONTENANT UN OBJET GAds PAR SON RENDU HTML grace a la fonction renderPreviewSendHtml
  for(manager in everybody_prev_copy){
    for(a in everybody_prev_copy[manager].me){
      everybody_prev_copy[manager].me[a] = renderPreviewSendHtml(everybody_prev_copy[manager].me[a])
    }
    for(a in everybody_prev_copy[manager].others){
      everybody_prev_copy[manager].others[a] = renderPreviewSendHtml(everybody_prev_copy[manager].others[a])
    }
  }

  //INITIALISATION DE VARIABLES A VIDE POUR RENDRE L'EMAIL{tmp, final, i}
  var tmp=""
  var final=""
  var i = 0
  // CREATION DE STRING REPRESENTANT LES DATES AU FORMAT FRANCAIS POUR LES DATES DES lundi-dimanche DES 2 SEMAINES PRECEDENTES.
  var d = stat_dates.prev
  var dprev = stat_dates.prevprev
  var d_ = get_dateFR(d.fin)
  var dprev_ = get_dateFR(dprev.fin)
  d = get_dateFR(d.debut)
  dprev = get_dateFR(dprev.debut)

  //POUR CHAQUE MANAGER DANS everybody_prev_copy, COMPILER LE HTML
  for(a in everybody_prev_copy){
    tmp = "<div><p>Bonjour "+a+",</p><p>Vous trouverez ci-après le reporting Google Ads de la semaine dernière.</p><p>Les statistiques de vos clients : </p><p style='font-style:italic;font-size:10px;'>Période : Lundi "+d+" au dimanche "+d_+" VS Lundi "+dprev+" au dimanche "+dprev_+").</p></div>"
    for(b in everybody_prev_copy[a].me)
      tmp += everybody_prev_copy[a].me[b]
    tmp += "<hr/><div style='margin-top:3rem'>...et les autres clients que nous gérons:</div>"
    for(c in everybody_prev_copy[a].others)
      tmp += everybody_prev_copy[a].others[c]
    everybody_prev_copy[a] = tmp
  }
  //for(a in everybody_prev_copy){
    final = EMAIL_header + everybody_prev_copy["Arnaud"] + EMAIL_footerinterne + EMAIL_footer
    email('hi.cyril@gmail.com', final)
  //}
}




/**
//RETOURNE LE TEMPLATE HTML ASSOCIE A UN COMPTE GADs
*@return string(template HTML)
**/
function renderPreviewSendHtml(GAds_row, account) {
  //CREATION DE 2 TEMPLATES: LE WRAPPER(wrapper) ET SON CONTENU(blocks)
  var wrapper = '<div style="padding-top:1em"><p style="{{text_gris}}">{{getName}}</p><div style="{{fondgris}} {{container}}">{{blocks}}</div></div>'
  var blocks = '<div style="{{stats}}"> <span style="{{stats_spanORdiv}} {{stats_span_first_of_type}}">{{INTERPOLATION_label}}</span> <span style="{{stats_spanORdiv}} {{stats_span_last_of_type}}"> {{INTERPOLATION_chiffre}} </span><div style="{{stats_spanORdiv}} {{stats_div}} {{INTERPOLATION_positive_ou_negative_style}}"> <b style="font-size:2rem;">{{INTERPOLATION_positive_ou_negative_unicode}}</b> <span>{{INTERPOLATION_taux}}</span></div></div>'
  
  //CREATION DE REGLES CSS POUR LES INSERER DANS LES DEUX TEMPLATE wrapper et blocks
  var w100 = "width:100%;"
  var w75 = "width:75%;"
  var w50 = "width:50%;"
  var fondgris = "background:rgba(71,71,71,.5);"
  var container = "margin: 1em;padding-top:3em"
  var text_gris = "color:#666666;font-size:22px;"
  
  var stats = "width:calc(100% / 3);height:6rem;font-size:1rem;background:#434343;margin:10px;float:left;padding:.5em;border-radius:5px;"
  var stats_spanORdiv = "color:white;position:absolute;display:block;margin:0;"
  var stats_span_first_of_type = "height:30%;font-size:1rem;"
  var stats_span_last_of_type = "text-align:center;font-size:1.5rem;"
  var stats_div_span = "float:left;"
  var stats_div = ""
  
  //APPLIQUER LE CSS AUX 2 TEMPLATES
  //(.....METTRE EN COMMENTAIRE UNE LIGNE POUR NE PAS APPLIQUER LE CSS)
  wrapper = wrapper.replace(/{{w100}}/g, w100)
  //wrapper = wrapper.replace(/{{fondgris}}/g, fondgris)
  wrapper = wrapper.replace(/{{container}}/g, container)
  wrapper = wrapper.replace(/{{text_gris}}/g, text_gris)
  blocks = blocks.replace(/{{stats}}/g, stats)
  blocks = blocks.replace(/{{stats_spanORdiv}}/g, stats_spanORdiv)
  blocks = blocks.replace(/{{stats_span_first_of_type}}/g, stats_span_first_of_type)
  blocks = blocks.replace(/{{stats_span_last_of_type}}/g, stats_span_last_of_type)
  blocks = blocks.replace(/{{stats_div_span}}/g, stats_div_span)
  blocks = blocks.replace(/{{stats_div}}/g, stats_div)
  
  
  var tmp = ""
  var tmp_ = ""
  var style=""
  //debugKPIs SERT A DEBUGGER LE RENDU HTML DES LIGNES GAds 
  //METTRE debugKPIs A true POUR ACTIVER LE MODE DEBUG
  var debugKPIs= false
  //LES CONTENU COMMENCANT(stats semaine d'avant) OU SE TERMINANT(delta) PAR "_" SONT DES DONNEES A NE PAS PRENDRE EN COMPTE
  for(z in GAds_row)if(z.substr(-1) != "_" && z.substr(0,1) != "_"){
    var delta = GAds_row[z+"_"]
    var delta_ = typeof delta == "number" ? delta.toFixed(2) : delta
    var prev = GAds_row["_"+z]

    //TRAITER POUR SAVOIR LA TENDANCE DU delta (POSITIVE:vert OU NEGATIVE:rouge, OU ENCORE FAIBLE:orange, OU ENCORE ERREUR:blanc)
    if(z !== "CPC" && z!== "Coûts" && z !== "CPConv."){
      style = (delta === undefined || delta === null || delta === 0) ? "color:white;" : delta < -2 ? "color:#e15a59;" : (delta < 5 && delta > -2) ? "color:#e8b20e;" : "color:#5ca966;"
      //Logger.log(z + " !== CPC et etc: "+style)
    }else {
      style = (delta === undefined || delta === null || delta === 0) ? "color:white;" : delta < -2 ? "color:#5ca966;" : (delta < 5 && delta > -2) ? "color:#e8b20e;" : "color:#e15a59;"
      //Logger.log("===CPC et etc: "+style)
    }
    //APPLIQUER DES MODIFICATIONS AU TEMPLATE blocks
    tmp = blocks
    tmp = tmp.replace(/{{INTERPOLATION_label}}/g, capitalizeText(z))
    tmp = tmp.replace(/{{INTERPOLATION_chiffre}}/g, formatStat(GAds_row[z], z))
    tmp = tmp.replace(/{{INTERPOLATION_taux}}/g, (delta === null ? 0 : delta_ ) + "% <b style='background: black;display: block;border: solid red;"+((!debugKPIs && (delta !== undefined || delta !== null || delta !== 0)) ? "display:none" :"")+"'>- delta="+delta+" <br/>- cette semaine: "+GAds_row[z]+" <br/>- semaine prevprev:"+prev+"</b>")
    tmp = tmp.replace(/{{INTERPOLATION_positive_ou_negative_style}}/g, style)
    tmp = tmp.replace(/{{INTERPOLATION_positive_ou_negative_unicode}}/g, (delta === undefined || delta === null || delta === 0) ? "---" : delta > 0 ? "⇑" : "⇓")
    GAds_row[z] = tmp
  }
  
  //POUR AFFICHER LE RENDU HTML SUR 2 LIGNE (grâce à la propiété css flex)
  var i = 0
  tmp = tmp_ = "<div style='width:100%;display:flex;justify-content: space-between;'>"
  for(z in GAds_row)if(z.substr(-1) != "_" && z.substr(0,1) != "_"){
    ++i
    //LA CONDITION QUI PERMET L'AFFICHAGE SUR 2 LIGNE
    if(i<=3)tmp += GAds_row[z]
    else tmp_ += GAds_row[z]
  }
  tmp+="</div>"
  tmp_+="</div>"
  blocks = tmp + tmp_
  
  //RECUPERER LE NOM DE L'ENTREPRISE POUR L'AFFICHER EN EN-TËTE DE CHAQUE RENDU GAds
  var getname = GAds_row["_name"]
  //APPLIQUER LA LIGNE DE RENDU DE LA LIGNE GAds AU TEMPLATE wrapper
  wrapper = wrapper.replace(/{{blocks}}/g, blocks)
  wrapper = wrapper.replace(/{{getName}}/g, getname)



  return wrapper+"<hr/>"
}




/**
//Envoie basique d'un email (avec en-tête)
* @call function::MailApp.sendEmail
**/
function email(emailAddress, body){
  MailApp.sendEmail({
    to: emailAddress, 
    subject: 'Reporting Hebdo Google Ads - Semaine du ' + get_dateFR(new Date()),
    htmlBody: body
  });
}




/**
//CAPITALISER UN MOT, RENDRE LA PREMIERE LETTRE DE CE MOT EN MAJUSCULE (et le reste en minuscule)
* @return string
* @param x: string
**/
function capitalizeText(x) {
    return x.charAt(0).toUpperCase() + x.slice(1);
}
/**
//FORMATER UN CHIFFRE POUR L'AFFICHER DANS LES STATISTQIUE DE RENDU GAds
//
* @return CHIFFRE
* @param 
*       chiffre: int ou double, 
*       format: string (utilisé par me switch pour savoir comment transformer chiffre)
**/
function formatStat(chiffre, format){
  if(chiffre === null)chiffre = 0
  var ch = chiffre + ""
  var ch_ = ch.length
  tmp = ""
  i = 0
  switch(format){
    case"Clics":case"reduire":
      if(ch_>6){tmp = " M";chiffre /= 1000000} 
      else if(ch_>3){tmp = " k";chiffre /= 1000}
      if(tmp != "")chiffre = chiffre.toFixed(1)
      chiffre += tmp
      break;
    case"euros":case"CPC":case"CPConv.":tmp = " €"
      chiffre = chiffre.toFixed(2)
      chiffre += tmp
      break;
    case"Coûts": case"reduire+euros":
      if(ch_>6){tmp = " M";chiffre /= 1000000} 
      else if(ch_>3){tmp = " k";chiffre /= 1000}
      if(tmp != "")chiffre = chiffre.toFixed(1)
      tmp += " €"
      chiffre += tmp
      break;
    case"Impr.":case"lisible":
      while(ch_ - 3 > 0){
        ch_ -= 3
        ch = ch.substring(0,ch_) + " " + ch.substring(ch_);
      }
      tmp = ch
      chiffre = tmp
      break;
    case"CTR":case"pourcentage":
      tmp = " %"
      chiffre = (100 * chiffre).toFixed(2)
      chiffre += tmp
      break;
    default:break;
  }
  return chiffre
}  
  
  
  
  
  
function get_infos(ArrManagedAccounts, stat_dates){

  var cpt
  var tmp = {Clics: 0, /*"Impr.": 0,*/ CTR: 0, CPC: 0, Coûts: 0, "Conv.": 0, "CPConv.": 0}
  var global = []
  
    
  var a_debut = get_date(stat_dates.prev.debut)
  var a_fin = get_date(stat_dates.prev.fin)
  var a_debut_ = get_date(stat_dates.prevprev.debut)
  var a_fin_ = get_date(stat_dates.prevprev.fin)
  var managedAccounts = ArrManagedAccounts[0]
  var managedAccounts_ = ArrManagedAccounts[1]
  
  while (managedAccounts.hasNext()) {
    var tab_line = d_o(tmp)
    var account = managedAccounts.next();
    var account_ = managedAccounts_.next();

    var stats = account.getStatsFor(a_debut, a_fin);
    tab_line.Clics = parseInt(stats.getClicks())
    //tab_line["Impr."] = parseInt(stats.getImpressions())
    tab_line.CTR = parseFloat(stats.getCtr())
    tab_line["Coûts"] = parseInt(stats.getCost())
    tab_line.CPC = parseFloat(stats.getAverageCpc())
    tab_line["Conv."] = parseInt(stats.getConversions())
    tab_line["CPConv."] = parseFloat(stats.getCost() / stats.getConversions())
    var stats_ = account.getStatsFor(a_debut_, a_fin_);
    cpt=parseInt(stats_.getClicks())
    tab_line.Clics_ = ((tab_line.Clics - cpt)/cpt)*100;
    tab_line._Clics = cpt
    //cpt=parseInt(stats_.getImpressions())
    //tab_line["Impr._"] = ((tab_line["Impr."] - cpt)/cpt)*100;
    //tab_line["_Impr."] = cpt
    cpt=parseFloat(stats_.getCtr())
    tab_line.CTR_ = ((tab_line.CTR - cpt)/cpt)*100;
    tab_line._CTR = cpt
    cpt=parseInt(stats_.getCost())
    tab_line["Coûts_"] = ((tab_line["Coûts"] - cpt)/cpt)*100;
    tab_line["_Coûts"] = cpt
    cpt=parseFloat(stats_.getAverageCpc())
    tab_line.CPC_ = ((tab_line.CPC - cpt)/cpt)*100;
    tab_line._CPC = cpt
    cpt=parseInt(stats_.getConversions())
    tab_line["Conv._"] = ((tab_line["Conv."] - cpt)/cpt)*100;
    tab_line["_Conv."] = cpt
    cpt=parseFloat(stats_.getCost() / stats_.getConversions())
    tab_line["CPConv._"] = ((tab_line["CPConv."] - cpt)/cpt)*100;
    tab_line["_CPConv."] = cpt
    
    tab_line._name = account.getName()
    
    global.push(tab_line)
  }
  return global
}





/**
//ALIAS DE function:duplicate_object
**/
function d_o(x){return duplicate_object(x)}
/**
//DUPLIQUE UN Object
* @return Object{}
* @param x: Object{}
**/
function duplicate_object(x){
  if(typeof x == "object")
    return JSON.parse(JSON.stringify(x))
}




/**
//RECUPERER DES DONNEES DU TABLEAU SHEETS AT: https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/edit#gid=0
//AFIN DE CREER UN OBJECT SPECIFIQUE AUX MANAGERS CONTENANT LES INFORMATIONS IMPORTANTES CONCERNANT LES COMPTES GAds GERES SUIVIS.
* @return Object{}
**/
function getEverybody() {
//var ok={ok:"okok"}
//RECUPERER LES FEUILLES people ET global DE https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/edit#gid=0
//QUE L'ON PLACE DANS tab_people ET tab_global
  var tab_people = sheetPeople.getRange(1,1,sheetPeople.getLastRow(),sheetPeople.getLastColumn()).getValues();
  var tab_global = sheetGlobal.getRange(2,1,sheetGlobal.getLastRow(),sheetGlobal.getLastColumn()).getValues();
//INITIALISER DEUX ARRAY AFIN DE COMPILER LES NOMS DES MANAGERS (people) ET LES COMPTES GAds (adwords)
  var people = [];
  var adwords = [];
  
//var _ = [];
//RECUPERER LES TITRE DE CHAQUE UPLET DANS LES FEUILLES people ET global
//(AFIN DE CONSTITUER L'OBJET FINAL)
  people.push(tab_people.shift());
  adwords.push(tab_global.shift());
//LOCALISER DYNAMIQUEMENT LES BONS UPLETS "Reporting GAds" ET "Manager"
//ET LES SAUVEGARDER (DANS tab_global_Gads ET tab_global_Manager)
  var tab_global_Gads = 0;
  var tab_global_Manager = 0;
  for(a in adwords[0])if(adwords[0][a] == "Reporting GAds")tab_global_Gads=a;
  for(a in adwords[0])if(adwords[0][a] == "Manager")tab_global_Manager=a;
  
  //REPERER LA LISTE DES EMPLOYEURS mindfruits QUI SONT MANAGERS (de comptes GAds)
  //ET LES  COMPILER people
  for(a in tab_people){
    if(tab_people[a][6] == "Oui")
      people.push(tab_people[a])
  }
  //RECUPERE LA LISTE DES MANAGERS (LES EMPLOYERS QUI RECOIVENT UN REPORTING HEBDOMADAIRE CONCERNANT LES COMPTE GAds GERES PAR Mindfruits)
  //ET LES COMPILE DANS adwords
  for(a in tab_global){
    if(tab_global[a][tab_global_Gads] == "Oui")
      adwords.push(tab_global[a]);
  }
  
  
  var managers = {};
  //DUPLICATION DE people ET adwords POUR EVITER LES EFFETS DE BORD
  //SUPPRESSION DE LA PREMIERE LIGNE (DE TITRES)
  var people_ = people.slice();
  people_.shift();
  for(a in people_)managers[people_[a][1]]=[];
  var adwords_ = adwords.slice();
  adwords_.shift();
  //TRIER LE ARRAY LIGNE PAR LIGNE POUR CHAQUE MANAGER
  for(a in adwords_)
    if(adwords_[a][tab_global_Gads] == "Oui"){
      switch(true){
        case /Cyrille.?/.test(adwords_[a][tab_global_Manager]):
          if(!managers['Cyrille'])
            managers['Cyrille']=[]
          managers['Cyrille'].push(adwords_[a])
        break;
        case /Arnaud.?/.test(adwords_[a][tab_global_Manager]):
          if(!managers['Arnaud'])
            managers['Arnaud']=[]
          managers['Arnaud'].push(adwords_[a])
        break;
        case /Gaelle.?/.test(adwords_[a][tab_global_Manager]):
        case /Ga\xeblle.?/.test(adwords_[a][tab_global_Manager]):
          if(!managers['Ga\xeblle'])
            managers['Ga\xeblle']=[]
          managers['Ga\xeblle'].push(adwords_[a])
        break;
        case /Kevin.?/.test(adwords_[a][tab_global_Manager]):
        case /K\xe9vin.?/.test(adwords_[a][tab_global_Manager]):
          if(!managers['K\xe9vin'])
            managers['K\xe9vin']=[]
          managers['K\xe9vin'].push(adwords_[a])
        break;
        default:break;
      }
    }
    
  //POUR CHAQUE MANAGER, TRIER EN 2 COLONNES LES CONTRATS QUI LUI APPARTIENNE(Object.me) ET LES AUTRE(Object.others)
  var each_managers = {}
  for(a in managers)
    each_managers[a]={me: [], others: []}
  for(a in managers){
    for(b in managers[a]){
      each_managers[a].me.push(managers[a][b][7])
      for(c in each_managers)
        if(c != a)
          each_managers[c].others.push(managers[a][b][7])
    }
  }
  return each_managers;
}