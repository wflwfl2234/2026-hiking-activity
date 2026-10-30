const SPREADSHEET_NAME = '2026_登山活動';
const SHEET_NAME = '報名資料';
const HEADERS = ['時間戳記', '姓名', 'Email', '單位', '電話', '職稱'];
const SPREADSHEET_ID_PROPERTY = 'REGISTRATION_SPREADSHEET_ID';

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('請先從目標 Google 試算表開啟 Apps Script，再執行 setupSheet。');
  }

  spreadsheet.rename(SPREADSHEET_NAME);
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    const existingHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
    if (HEADERS.some((header, index) => existingHeaders[index] !== header)) {
      throw new Error('工作表已有資料但標題列不符；為避免覆蓋資料，請先確認工作表內容。');
    }
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#e4f2dc');
  sheet.getRange('E:E').setNumberFormat('@');
  PropertiesService.getScriptProperties()
    .setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  return '工作表已完成設定，電話欄為純文字格式。';
}

function doPost(event) {
  if (!event || !event.parameter) {
    throw new Error('未收到報名表單資料。');
  }

  const values = event.parameter;
  const requestId = cleanRequestId(values.requestId);
  if (values.website) {
    return resultPage(false, '無法送出報名資料。', requestId);
  }

  const name = cleanValue(values.name, 100);
  const email = cleanValue(values.email, 254);
  const organization = cleanValue(values.organization, 150);
  const phone = cleanValue(values.phone, 30);
  const title = cleanValue(values.title, 100);

  if (!name || !email || !phone) {
    return resultPage(false, '請填寫姓名、Email 和電話。', requestId);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return resultPage(false, 'Email 格式不正確。', requestId);
  }

  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty(SPREADSHEET_ID_PROPERTY);
  if (!spreadsheetId) {
    return resultPage(false, '報名系統尚未完成設定，請聯絡主辦單位。', requestId);
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    return resultPage(false, '找不到報名工作表，請聯絡主辦單位。', requestId);
  }

  const row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
    new Date(),
    name,
    email,
    organization,
    '',
    title
  ]]);
  sheet.getRange(row, 5).setNumberFormat('@').setValue(phone);

  return resultPage(true, '報名資料已儲存。', requestId);
}

function cleanValue(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function cleanRequestId(value) {
  const requestId = String(value || '');
  return /^[a-zA-Z0-9-]{1,80}$/.test(requestId) ? requestId : '';
}

function resultPage(ok, message, requestId) {
  const payload = JSON.stringify({
    type: 'registration-result',
    requestId: requestId,
    ok: ok,
    message: message
  }).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><script>' +
    'window.parent.postMessage(' + payload + ',"*");' +
    '</script>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
