@echo off
:: Cerramos procesos previos
taskkill /F /IM chrome.exe /T >nul 2>&1
ping -n 4 127.0.0.1 >nul

:: Monitor 1: Sin barra de título (Kiosk mode)
start "" chrome.exe --kiosk "http://127.0.0.1:8090/visor.html" --window-position=0,0 --user-data-dir="C:\temp\chrome_mon1" --force-device-scale-factor=1

:: Monitor 2: Sin barra de título (Kiosk mode)
start "" chrome.exe --kiosk "http://127.0.0.1:8090/visor2.html" --window-position=1920,0 --user-data-dir="C:\temp\chrome_mon2" --force-device-scale-factor=1

:: Monitor 3: Sin barra de título (Kiosk mode)
start "" chrome.exe --kiosk "http://127.0.0.1:8090/visor3.html" --window-position=3840,0 --user-data-dir="C:\temp\chrome_mon3" --force-device-scale-factor=1

:: 3. Esperamos a que las ventanas carguen (ajusta el tiempo si es necesario)
ping -n 6 127.0.0.1 >nul

:: 4. Reinicio del Explorer para forzar el refresco de la barra de tareas
taskkill /f /im explorer.exe
start explorer.exe