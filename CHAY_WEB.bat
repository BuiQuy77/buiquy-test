@echo off
title MathMate - He Thong Hoc Lieu So THPT
cd /d "%~dp0"
echo ===================================================================
echo   DANG KHOI CHAY UNG DUNG MATHMATE - HE THONG HOC LIEU & KHAO THI
echo ===================================================================
echo Web dang khoi dong va se tu dong mo trinh duyet...
echo.
node.exe .\node_modules\vite\bin\vite.js preview --open --port 3000
pause
