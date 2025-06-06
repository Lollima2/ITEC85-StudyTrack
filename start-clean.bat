@echo off
echo Cleaning up ports and starting StudyTrack application...

echo Killing any processes using ports 5173 and 5174...
call kill-port.bat

echo Starting backend server...
start cmd /k "cd server && npm start"

echo Starting frontend development server...
timeout /t 5
start cmd /k "npm run dev"

echo StudyTrack application started!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5174