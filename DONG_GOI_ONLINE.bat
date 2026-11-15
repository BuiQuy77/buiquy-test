@echo off
title MathMate - Dong Goi & Day Len Web Online
cd /d "%~dp0"
echo ===================================================================
echo   DONG GOI DU LIEU WEB MATHMATE DE DUA LEN INTERNET (DEPLOY ONLINE)
echo ===================================================================
echo.
echo 1. Dang kiem tra va bien dich ma nguon sang thu muc dist...
echo.
node.exe .\node_modules\vite\bin\vite.js build
if %errorlevel% neq 0 (
    echo [LOI] Qua trinh bien dich gap su co! Vui long kiem tra lai.
    pause
    exit /b %errorlevel%
)
echo.
echo ===================================================================
echo [THANH CONG] Toan bo website da san sang trong thu muc "dist"!
echo.
echo Huong dan nhanh de co link web online mien phi:
echo   1. Trinh duyet se tu dong mo trang Netlify Drop (app.netlify.com/drop).
echo   2. Cua so thu muc "dist" se duoc mo ra tren man hinh.
echo   3. Thay chi can keo ca thu muc "dist" tha vao trang web Netlify.
echo   4. Trang web se cap ngay 1 duong link online (co HTTPS) de dung ngay!
echo ===================================================================
echo.
pause
start explorer.exe "%~dp0"
start https://app.netlify.com/drop
