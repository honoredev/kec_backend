@echo off
cd /d "C:\Users\Mr. BitBeast\Videos\KEC_BACKEND"
npx prisma migrate dev --name add_fun_financial_features
npx prisma generate
pause