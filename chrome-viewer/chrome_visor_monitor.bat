@echo off
taskkill /F /IM chrome.exe /T >nul 2>&1

@echo off
:CHECK_SERVICE
:: Intenta consultar el puerto local (ejemplo: 3000)
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto CHECK_SERVICE
)

start chrome.exe --app="http://localhost:8090/visor.html" --start-fullscreen --window-position=-10,0 --window-size=5760,1080 --user-data-dir="C:\temp\chrome_multi" --force-device-scale-factor=1