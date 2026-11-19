# 歷史偵探室

國中歷史探究網站，包含三個單元、作答前史料教材、史料證據標記、補強活動、作答修正與獨立挑戰。

## 下載後直接開啟

1. 在 GitHub 開啟 `History-Detectives.html`，按 **Download raw file** 下載。也可以從 **Code → Download ZIP** 下載整個專案。
2. 若下載的是 ZIP，請先解壓縮。
3. 用 Chrome、Edge、Firefox 或 Safari 開啟 `History-Detectives.html`。程式、樣式與圖片已包在檔案內，可離線使用。學習進度由瀏覽器儲存。

## 開發與重新產生離線版

使用 Node.js 22.12 以上版本。

```sh
npm ci
npm run dev
npm run build:offline
```

`npm run build:offline` 會重新產生根目錄的 `History-Detectives.html`。
