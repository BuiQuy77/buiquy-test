@echo off
title Day Code MathMate Len GitHub (BuiQuy77)
cd /d "%~dp0"
chcp 65001 >nul
echo ===================================================================
echo     DANG DAY CODE MATHMATE LEN GITHUB (BuiQuy77/buiquy-test)
echo ===================================================================
echo.
echo * LUU Y QUAN TRONG KHI CUA SO HOI DANG NHAP:
echo   - Username: Nhap "BuiQuy77" roi bam Enter
echo   - Password: Dan ma Token (Personal Access Token dang ghp_...)
echo     (Luu y: Khi dan ma vao cua so, chu se an di de bao mat,
echo      Thay cu dan bang chuot phai hoac Ctrl+V roi bam Enter nhe!)
echo.
echo * Windows da duoc cai tu dong nho mat khau (wincred),
echo   nen Thay chi can nhap dung 1 lan nay la tu sau se khong bao gio hoi lai nua!
echo ===================================================================
echo.

git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Thu lai voi che do ghi de (--force)...
    git push -u origin main --force
)
echo.
if %errorlevel% equ 0 (
    echo ===================================================================
    echo   [THANH CONG RUC RO!] TOAN BO CODE DA DUOC DAY LEN GITHUB!
    echo   Link kho: https://github.com/BuiQuy77/buiquy-test
    echo   Vercel va Netlify se tu dong cap nhat ban moi sau 1 phut!
    echo ===================================================================
) else (
    echo [CHUA XONG] Ma Token chua dung hoac het han. Vui long kiem tra lai!
)
echo.
pause
