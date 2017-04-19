@echo off
chdir "%CD%"
for /f "delims=" %%D in ('dir /a:d /b') do IF EXIST "%%~fD/deployment/run" rmdir  /s /q "%%~fD/deployment/run" 
for /f "delims=" %%D in ('dir /a:d /b') do IF EXIST "%%~fD/deployment/model" rmdir  /s /q "%%~fD/deployment/model"
for /f "delims=" %%D in ('dir /a:d /b') do IF EXIST "%%~fD/deployment/web" rmdir  /s /q "%%~fD/deployment/web"
for /f "delims=" %%D in ('dir /a:d /b') do IF EXIST "%%~fD/deployment/log" rmdir  /s /q "%%~fD/deployment/log"
for /f "delims=" %%D in ('dir /a:d /b') do IF EXIST "%%~fD/deployment/felix-cache" rmdir  /s /q "%%~fD/deployment/felix-cache"

   