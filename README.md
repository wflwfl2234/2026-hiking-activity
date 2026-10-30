# 2026_登山活動

2026 鐵砧山登山活動報名網站。活動日期：2026/11/20；集合地點：鐵砧山登山口。

## 網站

GitHub Pages 網址：https://wflwfl2234.github.io/2026-hiking-activity/

GitHub Repo 使用網址可相容的英文名稱 `2026-hiking-activity`；Google 試算表名稱仍為 `2026_登山活動`。

- [Google 試算表](https://docs.google.com/spreadsheets/d/1h1ND2jOF2rzFd3kf9rtcM59PHI5o4RlULSXPqcC498E/edit)
- [Apps Script 專案](https://script.google.com/home/projects/1v-60wIxUCTmY3suhlDzV56LLdFDtPzqPOSn3AbiiHlF-cp13QTjX807c/edit)
- [Apps Script 報名端點](https://script.google.com/macros/s/AKfycbxg5SJHdgafnoPf7b_w5FtkWob039vT_a4bBTAXUZytHgWhkRYrWRaoCHcSIFZuDJUF/exec)

## 建立報名試算表與 Apps Script

1. 在上方 Google 試算表建立空白試算表，並在上方 Apps Script 專案使用本專案的 `Code.gs` 程式。
2. 在編輯器選取並執行 `setupSheet`，完成 Google 授權。程式會設定此試算表名稱為 `2026_登山活動`、建立標題列，並將「電話」欄設為純文字。
4. 選擇「部署 → 新增部署作業 → 網頁應用程式」，設定「執行身分」為自己，存取權設為「任何人」，完成授權並部署。
此專案目前已完成 Apps Script 部署並接上網站表單。若未來重新建立部署，請將新的網頁應用程式網址填入 `index.html` 的 `APPS_SCRIPT_URL` 常數，然後重新發布網站。

`doPost` 會將每筆報名資料寫入「報名資料」工作表。請勿在網站原始碼中放入任何 Google 帳號憑證或試算表私密資料。

## 本機預覽

直接以瀏覽器開啟 `index.html`。Apps Script 網址尚未設定前，表單會提示報名系統尚未完成設定。

## 排版

頁面由上而下分成三列：活動標題、活動海報、活動內容與報名表單。小螢幕會將第三列的兩個區塊改為上下排列。
