function onEditInstallableTrigger(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const instance =
    PropertiesService.getUserProperties().getProperty("INSTANCE");
  const token = PropertiesService.getUserProperties().getProperty("USER_TOKEN");
  const datasetRid =
    PropertiesService.getUserProperties().getProperty("DATASET_RID");

  if (!instance || !token || !datasetRid) {
    _showSidebar();
    return;
  }

  // Get the range that was edited
  var range = e.range;

  // Get the sheet where the edit took place
  var sheet = range.getSheet();

  // Get the row number of the edited cell
  const rowNumber = range.getRow();
  const lastRowNumber = range.getLastRow();

  for (let i = rowNumber; i <= lastRowNumber; i++) {
    sendRowToFoundry(sheet, i, instance, datasetRid, token);
  }
}

function sendRowToFoundry(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  rowNumber: number,
  instance: string,
  datasetRid: string,
  token: string
) {
  // Get the entire row range
  var rowRange = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn());

  // Get all values in the row as an array
  var rowValues = rowRange.getValues();

  // Convert the row values to a JSON object
  // Assuming the first row contains headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = {};
  headers.forEach(function (header, index) {
    rowData[header] = rowValues[0][index];
  });

  const row = {
    row_number: rowNumber - 1,
    value: JSON.stringify(rowData),
    isDeleted: false,
    timestamp: Date.now(),
  };

  // Send that row to Foundry!
  const url = `${instance}/stream-proxy/api/streams/${datasetRid}/branches/master/jsonRecord`;

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },
    payload: JSON.stringify(row),
  });
}

function onOpenInstallableTrigger() {
  SpreadsheetApp.getUi()
    .createMenu("Foundry")
    .addItem("Configure connection", "_showSidebar")
    .addToUi();
}

function _showSidebar() {
  const template = HtmlService.createTemplateFromFile("UserSettings.html");
  template.instance =
    PropertiesService.getUserProperties().getProperty("INSTANCE") ?? "";
  template.datasetRid =
    PropertiesService.getUserProperties().getProperty("DATASET_RID") ?? "";
  template.token = !PropertiesService.getUserProperties().getProperty(
    "USER_TOKEN"
  )
    ? ""
    : "********";

  SpreadsheetApp.getUi().showSidebar(
    template.evaluate().setTitle("Foundry configuration")
  );
}

function _saveToken(token: string) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("USER_TOKEN", token);
}

function _saveInstance(instance: string) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("INSTANCE", instance);
}

function _saveDatasetRid(datasetRid: string) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("DATASET_RID", datasetRid);
}
