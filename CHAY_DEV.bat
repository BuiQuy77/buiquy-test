@echo off
title MathMate - Che do Chinh Sua Live (Dev Mode)
cd /d "%~dp0"
echo ===================================================================
echo   KHOI DONG CHE DO PHAT TRIEN & CHINH SUA TRUC TIEP (DEV MODE)
echo ===================================================================
node.exe .\node_modules\vite\bin\vite.js --open --port 3000
pause
