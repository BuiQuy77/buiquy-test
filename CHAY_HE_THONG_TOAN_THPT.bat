@echo off
chcp 65001 > nul
title MATHVERSE 12 - HE THONG TOAN HOC THPT
color 0B
cls
echo ======================================================================
echo        MATHVERSE 12 - HE THONG TRUC QUAN HOA & RAG TOAN THPT
echo             Dự Án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT)
echo ======================================================================
echo.
echo  [1/2] Dang khoi dong Web Dev Server & Backend API...
start "MathVerse Python Server" /min cmd /c "python main.py"
start "MathVerse Web Vite" /min cmd /c "npm run dev"

timeout /t 2 > nul
echo  [2/2] Dang mo trinh duyet...
start http://localhost:5173

echo.
echo ======================================================================
echo  [+] Web App:     http://localhost:5173
echo  [+] Backend API: http://localhost:5000
echo ======================================================================
echo.
echo  He thong dang chay ngam on dinh. Nhan phim bat ky de thoat cua so nay.
pause > nul
