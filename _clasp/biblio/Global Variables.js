var shBdd = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BXXPAHb6qlyKj_zUyhtZAaVuUppI8nffxB9E5OW0Iss/");
var shBddTest = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1qpAUucrAGTnVK8P2FwxHZJGtmvpBncoa71ptqi4hxg8/");
var shBddAnalytics = shBdd.getSheetByName("analytics");
var shBddGlobal = shBdd.getSheetByName("global");
var shBddTemplate = shBdd.getSheetByName("Email")