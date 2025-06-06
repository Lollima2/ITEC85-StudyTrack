@echo off
echo Checking for processes using port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Found process: %%a
    echo Attempting to kill process %%a...
    taskkill /F /PID %%a
    echo Process killed.
)
echo Checking for processes using port 5174...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174') do (
    echo Found process: %%a
    echo Attempting to kill process %%a...
    taskkill /F /PID %%a
    echo Process killed.
)
echo Done checking ports.
pause