@echo off
echo ====================================
echo   Meeting Translator - Local Server
echo ====================================
echo.
echo   http://localhost:8081
echo.
echo   首次使用請到瀏覽器設定加入麥克風白名單:
echo   Chrome: chrome://settings/content/microphone
echo   Edge:   edge://settings/content/microphone
echo   新增 http://localhost:8081 到「允許」清單
echo.
echo   按 Ctrl+C 可停止伺服器
echo ====================================
echo.
npx http-server -p 8081 -c-1 --cors -o index.html
