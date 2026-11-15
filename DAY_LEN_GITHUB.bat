@echo off
title Day Code MathMate Len GitHub (BuiQuy77)
cd /d "%~dp0"
echo ===================================================================
echo     DANG DAY CODE MATHMATE LEN GITHUB (BuiQuy77/buiquy-test)
echo ===================================================================
echo.
echo Neu trinh duyet hien cua so dang nhap GitHub:
echo Thay chi can bam nut xanh "Sign in with your browser" hoac nhap mat khau la xong!
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Thu lai voi che do ghi de kho moi (--force)...
    git push -u origin main --force
)
echo.
if %errorlevel% equ 0 (
    echo ===================================================================
    echo   [THANH CONG RUC RO!] TOAN BO CODE DA DUOC DAY LEN GITHUB!
    echo   Link kho: https://github.com/BuiQuy77/buiquy-test
    echo ===================================================================
) else (
    echo [CHUA XONG] Vui long kiem tra lai dang nhap GitHub tren may!
)
echo.
pause
