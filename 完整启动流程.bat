@echo off
title TreasureX H5 启动
color 0A
cls

echo.
echo  ============================================
echo   TreasureX H5 - 启动程序
echo  ============================================
echo.

cd client-h5

echo  [1/2] 检查依赖...
if not exist "node_modules" (
    echo  依赖未安装，开始安装...
    echo.
    pnpm install
    if errorlevel 1 (
        echo.
        echo  安装失败，尝试使用npm...
        npm install
    )
)

echo.
echo  [2/2] 启动开发服务器...
echo  ============================================
echo   服务器地址: http://localhost:5173
echo   按 Ctrl+C 可停止服务器
echo  ============================================
echo.

pnpm dev

if errorlevel 1 (
    echo.
    echo  pnpm启动失败，尝试使用npm...
    npm run dev
)

pause

