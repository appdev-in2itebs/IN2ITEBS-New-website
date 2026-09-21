@echo off
setlocal enabledelayedexpansion
title In2IT EBS Website + public link

set "ROOT=%~dp0"
set "TOOLS=%ROOT%tools"
set "NGROK=%TOOLS%\ngrok.exe"
set "NGCFG=%TOOLS%\ngrok.yml"
set "PORT=3107"
set "INSPECT=127.0.0.1:4141"

echo ===================================================
echo   In2IT EBS website  -  local server + public link
echo ===================================================
echo.

REM An agent left over from a previous run holds port 4141 and the reserved domain, so a second
REM one cannot bind and the link never appears. This script owns that agent, so clear it first.
taskkill /f /im ngrok.exe >nul 2>&1

cd /d "%ROOT%web"

if not exist node_modules (
    echo [1/5] Installing dependencies ^(first run only^)...
    call npm install
) else (
    echo [1/5] Dependencies present.
)

REM ---------------------------------------------------------------- local site
REM The site is served as a PRODUCTION BUILD, not `next dev`. Every page is then prebuilt HTML, so
REM a visitor over the tunnel gets it immediately instead of waiting for that route to compile, and
REM there is no dev-server websocket to fail across the internet.
REM
REM The port is freed first, always. An older server holding 3107 and a rebuilt .next are a bad
REM pair: the running process keeps serving HTML that points at asset hashes the build has just
REM replaced, every /_next/static request 400s, and the page dies with "Application error: a
REM client-side exception". Reusing whatever happened to be on the port is what caused exactly that.
echo [2/5] Freeing port %PORT% ...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -Expand OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }" >nul 2>&1
powershell -NoProfile -Command "Start-Sleep -Milliseconds 1500" >nul

echo [3/5] Building the site ^(about a minute; picks up every change you have made^)...
set "SITE_ENV=preview"
call npm run build
if errorlevel 1 (
    echo.
    echo [X] The build failed. The errors are above - fix them and run this again.
    echo     Nothing was published, so the public link is unchanged and still offline.
    echo.
    pause
    exit /b 1
)

echo [4/5] Starting the site on http://127.0.0.1:%PORT% ...
start "In2IT EBS server" cmd /c "set SITE_ENV=preview&& npm start"

echo       Waiting for it to answer...
set "UP="
for /l %%i in (1,1,60) do (
    if not defined UP (
        powershell -NoProfile -Command "try{(Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 'http://127.0.0.1:%PORT%/api/health/')|Out-Null;exit 0}catch{exit 1}" >nul 2>&1
        if !errorlevel! equ 0 set "UP=1"
        if not defined UP powershell -NoProfile -Command "Start-Sleep -Milliseconds 1000" >nul
    )
)
if not defined UP (
    echo.
    echo [X] The site did not come up on port %PORT%.
    echo     Check the "In2IT EBS server" window for the error, then run this again.
    echo.
    pause
    exit /b 1
)
echo       Site is up.

REM ---------------------------------------------------------------- the tunnel
if not exist "%NGROK%" (
    echo       Downloading the ngrok agent ^(first run only^)...
    if not exist "%TOOLS%" mkdir "%TOOLS%"
    powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile '%TOOLS%\ngrok.zip'; Expand-Archive -Force '%TOOLS%\ngrok.zip' '%TOOLS%'; Remove-Item '%TOOLS%\ngrok.zip'"
)
if not exist "%NGROK%" (
    echo.
    echo [X] Could not get the ngrok agent. Check your internet connection.
    echo.
    pause
    exit /b 1
)

if not exist "%NGCFG%" (
    echo.
    echo [X] Missing %NGCFG%
    echo     Create it with your ngrok authtoken, like this:
    echo.
    echo         version: "3"
    echo         agent:
    echo           authtoken: YOUR_TOKEN_HERE
    echo           web_addr: 127.0.0.1:4141
    echo.
    pause
    exit /b 1
)

REM A reserved domain keeps the same link every time. Put just the hostname (no https://) in
REM tools\ngrok-domain.txt - e.g. in2it-ebs.ngrok-free.app - and it is used automatically.
set "DOMAIN="
if exist "%TOOLS%\ngrok-domain.txt" set /p DOMAIN=<"%TOOLS%\ngrok-domain.txt"

echo [5/5] Opening the public link...
if defined DOMAIN (
    start "In2IT EBS tunnel" "%NGROK%" http %PORT% --config "%NGCFG%" --url "%DOMAIN%"
) else (
    start "In2IT EBS tunnel" "%NGROK%" http %PORT% --config "%NGCFG%"
)

set "PUBLIC="
for /l %%i in (1,1,30) do (
    if not defined PUBLIC (
        REM No pipes in here: inside a for /f backtick block cmd leaves the ^ in place, so
        REM PowerShell would receive a literal "^|" and fail to parse the command.
        for /f "usebackq delims=" %%u in (`powershell -NoProfile -Command "try{$t=@((Invoke-RestMethod -TimeoutSec 2 'http://%INSPECT%/api/tunnels').tunnels);foreach($x in $t){if($x.proto -eq 'https'){$x.public_url;break}}}catch{}"`) do set "PUBLIC=%%u"
        if not defined PUBLIC powershell -NoProfile -Command "Start-Sleep -Milliseconds 1000" >nul
    )
)

echo.
if not defined PUBLIC (
    echo [X] The tunnel did not report a link.
    echo     Look at the "In2IT EBS tunnel" window - the usual cause is a bad or expired
    echo     authtoken in %NGCFG%, or another ngrok already running on this machine.
    echo.
    pause
    exit /b 1
)

REM Put it on the clipboard so it can be pasted straight into a chat or an email.
powershell -NoProfile -Command "Set-Clipboard -Value '%PUBLIC%'" >nul 2>&1

echo ===================================================
echo.
echo   PUBLIC LINK  (share this - anyone can open it)
echo.
echo      %PUBLIC%
echo.
echo   Copied to your clipboard.
echo   On your own machine:  http://127.0.0.1:%PORT%
echo.
echo ===================================================
echo.
echo   Visitors see an ngrok warning page first and click
echo   "Visit Site" - that is normal on the free plan.
echo.
echo   This account has a static ngrok domain, so the link
echo   above is the SAME every time - safe to save or send
echo   in advance. It only WORKS while these two windows
echo   stay open; closing them, or this machine sleeping,
echo   takes the site offline until you run this again.
echo.
echo   Anyone with the link can read the whole site, so
echo   only send it to people who should see it.
echo.
echo ===================================================

start "" "%PUBLIC%"

echo.
echo Press any key to STOP the public link and the site...
pause >nul

echo.
echo Stopping...
taskkill /f /im ngrok.exe >nul 2>&1
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -Expand OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }" >nul 2>&1
echo Done.
endlocal
