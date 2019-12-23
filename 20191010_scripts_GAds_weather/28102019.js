// Copyright 2015, Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @name Bid By Weather
 *
 * @overview The Bid By Weather script adjusts campaign bids by weather
 *     conditions of their associated locations. See
 *     https://developers.google.com/google-ads/scripts/docs/solutions/weather-based-campaign-management#bid-by-weather
 *     for more details.
 *
 * @author Google Ads Scripts Team [adwords-scripts@googlegroups.com]
 *
 * @version 1.2.2
 *
 * @changelog
 * - version 1.2.2
 *   - Add support for video and shopping campaigns.
 * - version 1.2.1
 *   - Added validation for external spreadsheet setup.
 * - version 1.2
 *   - Added proximity based targeting.  Targeting flag allows location
 *     targeting, proximity targeting or both.
 * - version 1.1
 *   - Added flag allowing bid adjustments on all locations targeted by
 *     a campaign rather than only those that match the campaign rule
 * - version 1.0
 *   - Released initial version.
 */

// Register for an API key at http://openweathermap.org/appid
// and enter the key below.
var OPEN_WEATHER_MAP_API_KEY = '4b2c32e40644783f3c0ccd3becb8e27d';

// Create a copy of https://goo.gl/A59Uuc and enter the URL below.
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/12Wyu3BaQqUxgQL5-CWzl1QFF5GB54nTTQmyIabkUxWA/edit#gid=0';

// A cache to store the weather for locations already lookedup earlier.
var WEATHER_LOOKUP_CACHE = {};
// A cache to store the weather for around's locations already lookedup earlier.
var WEATHER_LOOKUP_CACHE_AROUND = {};

// Flag to pick which kind of targeting "LOCATION", "PROXIMITY", or "ALL".
var TARGETING = 'ALL';


/**
 * The code to execute when running the script.
 */
function main() {
  Logger.log("IL FAUT QUE DANS applyRulesForCampaign:: LES REGLES NE S'APPLIQUENT SUR TOUT UN DEPARTEMENT QUE SI ET SEULEMENT SI IL EXISTE UN NOMBRE SURFFISEMENT GRAND DE VILLES A FORTE DEMOGRAPHIE")
  Logger.log("PAR EXEMPLE, DANS LE Marne, IL N'EXISTE QU'UNE SEULE VILLE A FORTE DEMOGRAPHIE. DU COUP, SI CETTE VILLE VALIDE LES CONDITION, ALORS LA CONDITION SERA APPLIQUEE SUR TOUT LE DEPARTEMENT, ALORS QUE CE N'EST PAS CE QUI EST RECHERCHE.")
  validateApiKey();
  // Load data from spreadsheet.

  var spreadsheet = validateAndGetSpreadsheet(SPREADSHEET_URL);
  var campaignRuleData_ = spreadsheet.getSheets()[1];
  var weatherConditionData_ = spreadsheet.getSheets()[2];
  var geoMappingData_ = spreadsheet.getSheets()[3];
  var bigCitiesData = getSheetData(spreadsheet, 4);
  var departementsData = getSheetData(spreadsheet, 5);
  var argumentsData = spreadsheet.getSheets()[6]
  argumentsData = argumentsData.getRange(2, 1, argumentsData.getLastRow() - 1, argumentsData.getLastColumn()).getValues();
  Logger.log(argumentsData)

  var cities = []
  var Camps = []
  var citiesCamp = []
  var citiesCond = []
  var citiesBid = []
  var citiesApply = []
  var citiesEnable = []
  var citiesGeocodeDep = []
  var citiesDep = []
  for(var row in argumentsData){
    var argCamp = argumentsData[row][0]
    var argDepORRegion = argumentsData[row][1]
    var argGeoCode = 0
    var argCond = argumentsData[row][2]
    var argBid = argumentsData[row][3]

    //RECHERCHE SI L'ARGUMENT CONCERNE A UN DEPATEMENT
    for(a in departementsData)
      if(argDepORRegion == departementsData[a][1])
        argGeoCode = departementsData[a][2]
    //RECHERCHE SI L'ARGUMENT CONCERNE A UN REGION
    if(argGeoCode === 0)
      for(a in bigCitiesData){
        if(argDepORRegion === bigCitiesData[a][3])
          argGeoCode = bigCitiesData[a][6]
      }
    //RECHERCHE SI L'ARGUMENT CONCERNE A UNE VILLE
    if(argGeoCode === 0)
      for(a in bigCitiesData){
        if(argDepORRegion === bigCitiesData[a][1])
          argGeoCode = bigCitiesData[a][5]
      }
//CI-DESSOUS, LA LISTE DES HEADER DE LA FEUILLE "Campaigns"
//Campaign Name,	Weather, Location,	Weather Condition,	Bid Modifier,	Apply Modifier To,	Enabled,	regionGeoCode,	region
    //Logger.log("argCamp: %s, argDepORRegion: %s, argCond: %s, argBid: %s, argGeoCode: %s", argCamp, argDepORRegion, argCond, argBid, argGeoCode)
    for(a in bigCitiesData)
      if(argDepORRegion === bigCitiesData[a][1] || argDepORRegion === bigCitiesData[a][2] || argDepORRegion === bigCitiesData[a][3])
        if(bigCitiesData[a][5] != "???" && bigCitiesData[a][5] != ""){
          cities.push([bigCitiesData[a][1], bigCitiesData[a][5]])
          Camps.push([argCamp])
          citiesCamp.push([bigCitiesData[a][1]])
          citiesCond.push([argCond])
          citiesBid.push([argBid])
          citiesApply.push(["Matching Geo Targets"])
          citiesEnable.push(["Yes"])
          citiesGeocodeDep.push([argGeoCode])
          citiesDep.push([argDepORRegion])
        }
  }

  Logger.log("---- cities: %s", cities)

  geoMappingData_.getRange(2, 1, cities.length, cities[0].length).setValues(cities)

  campaignRuleData_.getRange(2, 1, cities.length, 1).setValues(Camps)
  campaignRuleData_.getRange(2, 2, cities.length, 1).setValues(citiesCamp)
  campaignRuleData_.getRange(2, 3, cities.length, 1).setValues(citiesCond)
  campaignRuleData_.getRange(2, 4, cities.length, 1).setValues(citiesBid)
  campaignRuleData_.getRange(2, 5, cities.length, 1).setValues(citiesApply)
  campaignRuleData_.getRange(2, 6, cities.length, 1).setValues(citiesEnable)
  campaignRuleData_.getRange(2, 7, cities.length, 1).setValues(citiesGeocodeDep)
  campaignRuleData_.getRange(2, 8, cities.length, 1).setValues(citiesDep)



  var campaignRuleData = getSheetData(spreadsheet, 1);
  var weatherConditionData = getSheetData(spreadsheet, 2);
  var geoMappingData = getSheetData(spreadsheet, 3);
  // Convert the data into dictionaries for convenient usage.
  var campaignMapping = buildCampaignRulesMapping(campaignRuleData);
  var weatherConditionMapping =
      buildWeatherConditionMapping(weatherConditionData);

  var locationMapping = buildLocationMapping(geoMappingData);

  // Apply the rules.
  Logger.log("campaignMapping: %s", campaignMapping)
  Logger.log("locationMapping: %s", locationMapping)

  for (var campaignName in campaignMapping) {
    applyRulesForCampaign(campaignName, campaignMapping[campaignName],
                          locationMapping, weatherConditionMapping);
  }
}

/**
 * Retrieves the data for a worksheet.
 *
 * @param {Object} spreadsheet The spreadsheet.
 * @param {number} sheetIndex The sheet index.
 * @return {Array} The data as a two dimensional array.
 */
function getSheetData(spreadsheet, sheetIndex) {
  var sheet = spreadsheet.getSheets()[sheetIndex];
  var range =
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  return range.getValues();
}
function getSheetData_(spreadsheet, sheetIndex) {
  var sheet = spreadsheet.getSheets()[sheetIndex];
  var range =
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  return range
}

/**
 * Builds a mapping between the list of campaigns and the rules
 * being applied to them.
 *
 * @param {Array} campaignRulesData The campaign rules data, from the
 *     spreadsheet.
 * @return {Object.<string, Array.<Object>> } A map, with key as campaign name,
 *     and value as an array of rules that apply to this campaign.
 */
function buildCampaignRulesMapping(campaignRulesData) {
  var campaignMapping = {};
  for (var i = 0; i < campaignRulesData.length; i++) {
    // Skip rule if not enabled.
    if (campaignRulesData[i][5].toLowerCase() == 'yes') {
      var campaignName = campaignRulesData[i][0];
      var campaignRules = campaignMapping[campaignName] || [];
      campaignRules.push({
          'name': campaignName,

          // location for which this rule applies.
          'location': campaignRulesData[i][1],

          // the weather condition (e.g. Sunny).
          'condition': campaignRulesData[i][2],

          // bid modifier to be applied.
          'bidModifier': campaignRulesData[i][3],

          // whether bid adjustments should by applied only to geo codes
          // matching the location of the rule or to all geo codes that
          // the campaign targets.
          'targetedOnly': campaignRulesData[i][4].toLowerCase() ==
                          'matching geo targets',

          'dep': campaignRulesData[i][6],
          'depName': campaignRulesData[i][7]
      });
      campaignMapping[campaignName] = campaignRules;
    }
  }

  return campaignMapping;
}

/**
 * Builds a mapping between a weather condition name (e.g. Sunny) and the rules
 * that correspond to that weather condition.
 *
 * @param {Array} weatherConditionData The weather condition data from the
 *      spreadsheet.
 * @return {Object.<string, Array.<Object>>} A map, with key as a weather
 *     condition name, and value as the set of rules corresponding to that
 *     weather condition.
 */
function buildWeatherConditionMapping(weatherConditionData) {
  var weatherConditionMapping = {};

  for (var i = 0; i < weatherConditionData.length; i++) {
    var weatherConditionName = weatherConditionData[i][0];
    weatherConditionMapping[weatherConditionName] = {
      // Condition name (e.g. Sunny)
      'condition': weatherConditionName,

      // Temperature (e.g. 50 to 70)
      'temperature': weatherConditionData[i][1],

      // Precipitation (e.g. below 70)
      'precipitation': weatherConditionData[i][2],

      // Wind speed (e.g. above 5)
      'wind': weatherConditionData[i][3]
    };
  }

  return weatherConditionMapping;
}

/**
 * Builds a mapping between a location name (as understood by OpenWeatherMap
 * API) and a list of geo codes as identified by Google Ads scripts.
 *
 * @param {Array} geoTargetData The geo target data from the spreadsheet.
 * @return {Object.<string, Array.<Object>>} A map, with key as a locaton name,
 *     and value as an array of geo codes that correspond to that location
 *     name.
 */
function buildLocationMapping(geoTargetData) {
  var locationMapping = {};
  for (var i = 0; i < geoTargetData.length; i++) {
    var locationName = geoTargetData[i][0];
    var locationDetails = locationMapping[locationName] || {
      'geoCodes': []/*, 'lonLat': []*/     // List of geo codes understood by Google Ads scripts.
    };

    //Logger.log("____: %s", geoTargetData[i][1])
    locationDetails.geoCodes.push(geoTargetData[i][1]);

    if(geoTargetData[i][1] != "???" && geoTargetData[i][1] != "")
      locationMapping[locationName] = locationDetails;
  }

  return locationMapping;
}

/**
 * Applies rules to a campaign.
 *
 * @param {string} campaignName The name of the campaign.
 * @param {Object} campaignRules The details of the campaign. See
 *     buildCampaignMapping for details.
 * @param {Object} locationMapping Mapping between a location name (as
 *     understood by OpenWeatherMap API) and a list of geo codes as
 *     identified by Google Ads scripts. See buildLocationMapping for details.
 * @param {Object} weatherConditionMapping Mapping between a weather condition
 *     name (e.g. Sunny) and the rules that correspond to that weather
 *     condition. See buildWeatherConditionMapping for details.
 */
function applyRulesForCampaign(campaignName, campaignRules, locationMapping,
                               weatherConditionMapping, depGeoCode_Name) {
  var doafter = {}
  var departements = {}
  for (var i = 0; i < campaignRules.length; i++) {
    if(typeof departements[campaignRules[i].dep] == "undefined")
      departements[campaignRules[i].dep] = 0
    departements[campaignRules[i].dep]++

    var bidModifier = 1;
    var campaignRule = campaignRules[i];
    //Logger.log("-- campaignRule: %s", campaignRule)

    // Get the weather for the required location.
    var locationDetails = locationMapping[campaignRule.location];
    var weather = getWeather(campaignRule.location);

    // Get the weather rules to be checked.
    var weatherConditionName = campaignRule.condition;
    var weatherConditionRules = weatherConditionMapping[weatherConditionName];



    // Evaluate the weather rules.
    var evalWeather = evaluateWeatherRules(weatherConditionRules, weather)

    //Logger.log("campaignRule: %s", campaignRule)
    //Logger.log("campaignRule.location: %s, campaignRule.condition: %s, evalWeather: %s", campaignRule.location, campaignRule.condition, evalWeather)



    if (evalWeather) {
      bidModifier = campaignRule.bidModifier;
      /*
      Logger.log('applyRulesForCampaign::__Matching Rule found: Campaign Name = %s, location = %s, ' +
          'weatherName = %s,weatherRules = %s, noticed weather = %s.',
          campaignRule.name, campaignRule.location,
          weatherConditionName, weatherConditionRules, weather);
      Logger.log("applyRulesForCampaign::bidModifier: %s, for location: %s", bidModifier, campaignRule.location)
      */

      if (TARGETING == 'LOCATION' || TARGETING == 'ALL') {
        //Logger.log('applyRulesForCampaign::__un')
        // Get the geo codes that should have their bids adjusted.
        var geoCodes = campaignRule.targetedOnly ?
          locationDetails.geoCodes : null;
        if(typeof doafter[campaignRules[i].dep] == "undefined")
          doafter[campaignRules[i].dep] = []
        doafter[campaignRules[i].dep].push([campaignName, geoCodes, bidModifier, campaignRule.location, campaignRules[i].depName])
      }
      /*//adjustProximityBids NE FAIT RIEN. POURQUOI ? JE NEN SAIS RIEN
      if (TARGETING == 'PROXIMITY' || TARGETING == 'ALL') {
        Logger.log('applyRulesForCampaign::__deux')
        var location = campaignRule.targetedOnly ? campaignRule.location : null;
        adjustProximityBids(campaignName, location, bidModifier);
      }
      */

    }
  }

  /*
  Logger.log(" --- ok: %s, length: %s", doafter, Object.keys(doafter).length)
  Logger.log(" --- dep.length: %s", Object.keys(departements).length)
  Logger.log(" --- departements: %s", departements)
  */
  for(dep in doafter)
    if(doafter[dep].length > departements[dep]/2){
      //ON APPLIQUE LE bidmodifier SUR TOUT LE DEPARTEMENT
      //SUR CE MODEL: adjustBids(campaignName, geoCodes, bidModifier);
      Logger.log("adjustBids(%s, %s, %s)", doafter[dep][0][0], [dep], doafter[dep][0][2])
      adjustBids(doafter[dep][0][0], [parseInt(dep)], doafter[dep][0][2])
      Logger.log("\n\n\nCAMPAGNE LANCEE SUR TOUT: %s!", doafter[dep][0][4])
      Logger.log("NOMBRE DE VILLES CONCERNES PAR LA CAMPAGNE: %s\nNOMBRE DE VILLE TOTAL: %s\n\n\n", doafter[dep].length, departements[dep])
    }else{
      //ON APPLIQUE LE bidmodifier SEULEMENT SUR LES VILLES DU DEPARTEMENT SATISFASANT LES "weather's conditions"
      //SUR CE MODEL: adjustBids(campaignName, geoCodes, bidModifier);
      var cpt = ""
      for(var row in doafter[dep]){
        cpt += doafter[dep][row][3] + ", "
        Logger.log("adjustBids(%s, %s, %s)", doafter[dep][row][0], doafter[dep][row][1], doafter[dep][row][2])
        adjustBids(doafter[dep][row][0], doafter[dep][row][1], doafter[dep][row][2])
        Logger.log("CAMPAGNE LANCEE SUR LES VILLES SUIVANTES: %s (%s).\n\n\n", cpt, doafter[dep][row][4])
        Logger.log("NOMBRE DE VILLES CONCERNES PAR LA CAMPAGNE: %s\nNOMBRE DE VILLE TOTAL: %s\n\n\n", doafter[dep].length, departements[dep])
      }
    }

  return;
}

/**
 * Converts a temperature value from kelvin to fahrenheit.
 *
 * @param {number} kelvin The temperature in Kelvin scale.
 * @return {number} The temperature in Fahrenheit scale.
 */
function toFahrenheit(kelvin) {
  return (kelvin - 273.15) * 1.8 + 32;
}

/**
 * Converts a temperature value from kelvin to fahrenheit.
 *
 * @param {number} kelvin The temperature in Kelvin scale.
 * @return {number} The temperature in Fahrenheit scale.
 */
function toCelcius(kelvin) {
  return (kelvin - 273.15)
}

/**
 * Evaluates the weather rules.
 *
 * @param {Object} weatherRules The weather rules to be evaluated.
 * @param {Object.<string, string>} weather The actual weather.
 * @return {boolean} True if the rule matches current weather conditions,
 *     False otherwise.
 */
function evaluateWeatherRules(weatherRules, weather) {
  // See http://bugs.openweathermap.org/projects/api/wiki/Weather_Data
  // for values returned by OpenWeatherMap API.
  var precipitation = 0;
  if (weather.rain && weather.rain['3h']) {
    precipitation = weather.rain['3h'];
  }
  var temperature = toCelcius(weather.main.temp);
  var windspeed = weather.wind.speed;


  return evaluateMatchRules(weatherRules.temperature, temperature) &&
      evaluateMatchRules(weatherRules.precipitation, precipitation) &&
      evaluateMatchRules(weatherRules.wind, windspeed);
}
/**
 * Evaluates the weather rules.
 *
 * @param {Object} weatherRules The weather rules to be evaluated.
 * @param {Object.<string, string>} weather The actual weather.
 * @return {boolean} True if the rule matches current weather conditions,
 *     False otherwise.
 */
function evaluateWeatherRulesAround(weatherRules, weatherAround) {

  var list =weatherAround.list
  var bool = true
  var boolbis = true
  var tmp = {}
  var tmpbis = [[0,0,0], [0,0,0]]
  for(el in list){
    boolbis = true
    tmp = list[el]
    tmpbis[0][0] += tmp.main != null ? tmp.main.temp : 0
    if(tmp.main != null) tmpbis[1][0]++
    tmpbis[0][1] += tmp.rain != null ? tmp.rain['3h']||tmp.rain['1h'] : 0

    if(tmp.rain != null) tmpbis[1][1]++
    tmpbis[0][2] += tmp.wind != null ? tmp.wind.speed : 0
    if(tmp.wind != null) tmpbis[1][2]++

  }

  tmpbis[0][0] /= tmpbis[1][0] == 0 ? 1 : tmpbis[1][0]
  tmpbis[0][1] /= tmpbis[1][1] == 0 ? 1 : tmpbis[1][1]
  tmpbis[0][2] /= tmpbis[1][2] == 0 ? 1 : tmpbis[1][2]

  var weather = {main: {temp: tmpbis[0][0]}, rain: {'3h': tmpbis[0][1]}, wind: {speed: tmpbis[1][2]}}
  var evaluateWeatherRulesResult = evaluateWeatherRules(weatherRules, weather)


  return evaluateWeatherRulesResult

  return evaluateMatchRules(weatherRules.temperature, tmpbis[0][0]) &&
      evaluateMatchRules(weatherRules.precipitation, tmpbis[0][1]) &&
      evaluateMatchRules(weatherRules.wind, tmpbis[0][2]);
}

/**
 * Evaluates a condition for a value against a set of known evaluation rules.
 *
 * @param {string} condition The condition to be checked.
 * @param {Object} value The value to be checked.
 * @return {boolean} True if an evaluation rule matches, false otherwise.
 */
function evaluateMatchRules(condition, value) {
  // No condition to evaluate, rule passes.
  if (condition == '') {
    return true;
  }
  var rules = [matchesBelow, matchesAbove, matchesRange];

  for (var i = 0; i < rules.length; i++) {
    if (rules[i](condition, value)) {
      return true;
    }
  }
  return false;
}

/**
 * Evaluates whether a value is below a threshold value.
 *
 * @param {string} condition The condition to be checked. (e.g. below 50).
 * @param {number} value The value to be checked.
 * @return {boolean} True if the value is less than what is specified in
 * condition, false otherwise.
 */
function matchesBelow(condition, value) {
  conditionParts = condition.split(' ');

  if (conditionParts.length != 2) {
    return false;
  }

  if (conditionParts[0] != 'below') {
    return false;
  }


  if (value < conditionParts[1]) {
    return true;
  }
  return false;
}

/**
 * Evaluates whether a value is above a threshold value.
 *
 * @param {string} condition The condition to be checked. (e.g. above 50).
 * @param {number} value The value to be checked.
 * @return {boolean} True if the value is greater than what is specified in
 *     condition, false otherwise.
 */
function matchesAbove(condition, value) {
  conditionParts = condition.split(' ');

  if (conditionParts.length != 2) {
    return false;
  }

  if (conditionParts[0] != 'above') {
    return false;
  }


  if (value > conditionParts[1]) {
    return true;
  }
  return false;
}

/**
 * Evaluates whether a value is within a range of values.
 *
 * @param {string} condition The condition to be checked (e.g. 5 to 18).
 * @param {number} value The value to be checked.
 * @return {boolean} True if the value is in the desired range, false otherwise.
 */
function matchesRange(condition, value) {
  conditionParts = condition.replace('\w+', ' ').split(' ');

  if (conditionParts.length != 3) {
    return false;
  }

  if (conditionParts[1] != 'to') {
    return false;
  }

  if (conditionParts[0] <= value && value <= conditionParts[2]) {
    return true;
  }
  return false;
}

/**
 * Retrieves the weather for a given location, using the OpenWeatherMap API.
 *
 * @param {string} location The location to get the weather for.
 * @return {Object.<string, string>} The weather attributes and values, as
 *     defined in the API.
 */
function getWeather(location) {
  if (location in WEATHER_LOOKUP_CACHE) {

    return WEATHER_LOOKUP_CACHE[location];
  }

  var url = Utilities.formatString(
      'http://api.openweathermap.org/data/2.5/weather?APPID=%s&q=%s',
      encodeURIComponent(OPEN_WEATHER_MAP_API_KEY),
      encodeURIComponent(location));

  Logger.log("url: %s", url)
  var response = UrlFetchApp.fetch(url);
  if (response.getResponseCode() != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s, Location searched: %s.',
        response.getContentText(), location);
  }

  var result = JSON.parse(response.getContentText());

  // OpenWeatherMap's way of returning errors.
  if (result.cod != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s,  Location searched: %s.',
        response.getContentText(), location);
  }

  WEATHER_LOOKUP_CACHE[location] = result;
  return result;
}
function getAroundWeather(location, coord) {
  if (location in WEATHER_LOOKUP_CACHE_AROUND) {

    return WEATHER_LOOKUP_CACHE_AROUND[location];
  }

  var url = Utilities.formatString(
      'https://api.openweathermap.org/data/2.5/find?%s&cnt=10&appid=%s',
      coord,
      encodeURIComponent(OPEN_WEATHER_MAP_API_KEY));


  var response = UrlFetchApp.fetch(url);
  if (response.getResponseCode() != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s, Location searched: %s.',
        response.getContentText(), location);
  }

  var result = JSON.parse(response.getContentText());

  // OpenWeatherMap's way of returning errors.
  if (result.cod != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s,  Location searched: %s.',
        response.getContentText(), location);
  }

  WEATHER_LOOKUP_CACHE_AROUND[location] = result;
  return result;
}

/**
 * Adjusts the bidModifier for a list of geo codes for a campaign.
 *
 * @param {string} campaignName The name of the campaign.
 * @param {Array} geoCodes The list of geo codes for which bids should be
 *     adjusted.  If null, all geo codes on the campaign are adjusted.
 * @param {number} bidModifier The bid modifier to use.
 */
function adjustBids(campaignName, geoCodes, bidModifier, lonLat) {
  // Get the campaign.
  var campaign = getCampaign(campaignName);

  if (!campaign) return null;


  // Get the targeted locations.
  var locations = campaign.targeting().targetedLocations().get();
  var locs = campaign.targeting().targetedLocations().get();

  //POUR RAJOUTER DE NOUVELLES LOCALISATIONS UNIQUEMENT SI N'EXISTENT PAS
  var bool = true
  var cpt = []
  while (locs.hasNext()) {
    var loc= locs.next();
    cpt.push(loc.getId())
    //Logger.log(geoCodes)
    if(geoCodes.indexOf(loc.getId()) != -1)
      bool = false
  }

  var i = 0
  while (locations.hasNext()) {
    Logger.log("adjustBids::i: %s", i++)
    var location = locations.next();
    var currentBidModifier = location.getBidModifier().toFixed(2);



    if (bool) {
      Logger.log("adjustBids::__Adding targeting for : %s, typeof GeoCode: %s", geoCodes, typeof geoCodes[0])
      campaign.addLocation({
        id: geoCodes[0],
        bidModifier: bidModifier
      });
    }
    // Apply the bid modifier only if the campaign has a custom targeting
    // for this geo location or if all locations are to be modified.
    if (!geoCodes || (geoCodes.indexOf(location.getId()) != -1 &&
      currentBidModifier != bidModifier)) {
        Logger.log('adjustBids::__Setting bidModifier = %s for campaign name = %s, ' +
            'geoCode = %s. Old bid modifier is %s.', bidModifier,
            campaignName, location.getId(), currentBidModifier);
        location.setBidModifier(bidModifier);
    }
  }
}

/**
 * Adjusts the bidModifier for campaigns targeting by proximity location
 * for a given weather location.
 *
 * @param {string} campaignName The name of the campaign.
 * @param {string} weatherLocation The weather location for which bids should be
 *     adjusted.  If null, all proximity locations on the campaign are adjusted.
 * @param {number} bidModifier The bid modifier to use.
 */
function adjustProximityBids(campaignName, weatherLocation, bidModifier) {
  // Get the campaign.
  var campaign = getCampaign(campaignName);
  //Logger.log("adjustProximityBids::campaign: %s", campaign)
  if(campaign === null) return;

  // Get the proximity locations.
  var proximities = campaign.targeting().targetedProximities().get();
  Logger.log('-------------------------------')
  Logger.log('proximities: %s,', proximities)
  Logger.log('proximities.hasNext(): %s,', proximities.hasNext())
  while (proximities.hasNext()) {
    var proximity = proximities.next();
    var currentBidModifier = proximity.getBidModifier().toFixed(2);

    Logger.log("___weatherNearProximity(proximity, weatherLocation): %s",
               weatherNearProximity(proximity, weatherLocation)
    )
    Logger.log("___currentBidModifier != bidModifier: %s",
               currentBidModifier != bidModifier
    )
    Logger.log("___(weatherNearProximity(proximity, weatherLocation) && currentBidModifier != bidModifier): %s",
               (weatherNearProximity(proximity, weatherLocation) && currentBidModifier != bidModifier)
    )
    // Apply the bid modifier only if the campaign has a custom targeting
    // for this geo location or if all locations are to be modified.
    if (!weatherLocation ||
        (weatherNearProximity(proximity, weatherLocation) &&
      currentBidModifier != bidModifier)) {
        Logger.log('Setting bidModifier = %s for campaign name = %s, with ' +
            'weatherLocation = %s in proximity area. Old bid modifier is %s.',
            bidModifier, campaignName, weatherLocation, currentBidModifier);
        proximity.setBidModifier(bidModifier);
      }
  }
}

/**
 * Checks if weather location is within the radius of the proximity location.
 *
 * @param {Object} proximity The targeted proximity of campaign.
 * @param {string} weatherLocation Name of weather location to check within
 * radius.
 * @return {boolean} Returns true if weather location is within radius.
 */
function weatherNearProximity(proximity, weatherLocation) {
  // See https://en.wikipedia.org/wiki/Haversine_formula for details on how
  // to compute spherical distance.
  var earthRadiusInMiles = 3960.0;
  var degreesToRadians = Math.PI / 180.0;
  var radiansToDegrees = 180.0 / Math.PI;
  var kmToMiles = 0.621371;

  var radiusInMiles = proximity.getRadiusUnits() == 'MILES' ?
    proximity.getRadius() : proximity.getRadius() * kmToMiles;

  // Compute the change in latitude degrees for the radius.
  var deltaLat = (radiusInMiles / earthRadiusInMiles) * radiansToDegrees;
  // Find the radius of a circle around the earth at given latitude.
  var r = earthRadiusInMiles * Math.cos(proximity.getLatitude() *
      degreesToRadians);
  // Compute the change in longitude degrees for the radius.
  var deltaLon = (radiusInMiles / r) * radiansToDegrees;

  // Retrieve weather location for lat/lon coordinates.
  var weather = getWeather(weatherLocation);
  Logger.log("weatherNearProximity::weather: %s", weather)
  // Check if weather condition is within the proximity boundaries.
  return (weather.coord.lat >= proximity.getLatitude() - deltaLat &&
          weather.coord.lat <= proximity.getLatitude() + deltaLat &&
          weather.coord.lon >= proximity.getLongitude() - deltaLon &&
          weather.coord.lon <= proximity.getLongitude() + deltaLon);
}

/**
 * Finds a campaign by name, whether it is a regular, video, or shopping
 * campaign, by trying all in sequence until it finds one.
 *
 * @param {string} campaignName The campaign name to find.
 * @return {Object} The campaign found, or null if none was found.
 */
function getCampaign(campaignName) {
  var selectors = [AdsApp.campaigns(), AdsApp.videoCampaigns(),
      AdsApp.shoppingCampaigns()];
  //Logger.log("selectors: %s", selectors)
  for(var i = 0; i < selectors.length; i++) {
    //Logger.log("i: %s, campaignName: %s", i, campaignName)
    var campaignIter = selectors[i].
        withCondition('CampaignName = "' + campaignName + '"').
        get();
    if (campaignIter.hasNext()) {
      return campaignIter.next();
    }
  }
  return null;
}

/**
 * DO NOT EDIT ANYTHING BELOW THIS LINE.
 * Please modify your spreadsheet URL and API key at the top of the file only.
 */

/**
 * Validates the provided spreadsheet URL to make sure that it's set up
 * properly. Throws a descriptive error message if validation fails.
 *
 * @param {string} spreadsheeturl The URL of the spreadsheet to open.
 * @return {Spreadsheet} The spreadsheet object itself, fetched from the URL.
 * @throws {Error} If the spreadsheet URL hasn't been set
 */
function validateAndGetSpreadsheet(spreadsheeturl) {
  if (spreadsheeturl == 'INSERT_SPREADSHEET_URL_HERE') {
    throw new Error('Please specify a valid Spreadsheet URL. You can find' +
        ' a link to a template in the associated guide for this script.');
  }
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheeturl);
  return spreadsheet;
}

/**
 * Validates the provided API key to make sure that it's not the default. Throws
 * a descriptive error message if validation fails.
 *
 * @throws {Error} If the configured API key hasn't been set.
 */
function validateApiKey() {
  if (OPEN_WEATHER_MAP_API_KEY == 'INSERT_OPEN_WEATHER_MAP_API_KEY_HERE') {
    throw new Error('Please specify a valid API key for OpenWeatherMap. You ' +
        'can acquire one here: http://openweathermap.org/appid');
  }
}
function lostScripts0(x){
  Logger.log("demographie")
  Logger.log("ouvrir la page html: 'C:\Users\MindFruits\Desktop\cyril's_box\20191010_scripts_GAds_weather/liste_demographie.html'")
  Logger.log("récuperer le json retourné par le script en bas de page")
  Logger.log("insérer dans la page 4 de ce script bidmodifierWeather de google (présent script), à l'emplacement A1")
  Logger.log("puis lancer cette fonction")
  var spreadsheet = validateAndGetSpreadsheet(SPREADSHEET_URL);
  var listes = spreadsheet.getSheets()[4];
  var listes_ = listes.getRange('A1').getValues()
      listes_ = JSON.parse(listes_[0][0])
  Logger.log(listes_)
  listes.getRange(1, 1, listes_.length, listes_[0].length).setValues(listes_)
}
function lostScripts1(x){
  Logger.log("departements")
  Logger.log("ouvrir la page html: 'C:\Users\MindFruits\Desktop\cyril's_box\20191010_scripts_GAds_weather/liste_departements.html'")
  Logger.log("récuperer le json retourné par le script en bas de page")
  Logger.log("insérer dans la page 5 de ce script bidmodifierWeather de google (présent script), à l'emplacement A1")
  Logger.log("puis lancer cette fonction")
  var spreadsheet = validateAndGetSpreadsheet(SPREADSHEET_URL);
  var listes = spreadsheet.getSheets()[5];
  var listes_ = listes.getRange('A1').getValues()
      listes_ = JSON.parse(listes_[0][0])
  Logger.log(listes_)
  listes.getRange(1, 1, listes_.length, listes_[0].length).setValues(listes_)
}
