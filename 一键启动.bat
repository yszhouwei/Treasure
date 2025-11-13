@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════╗
echo ║     TreasureX H5 - 一键安装并启动             ║
echo ╚════════════════════════════════════════════════╝
echo.

cd client-h5

echo [检查依赖]
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    echo.
    
    echo [1/3] 清理旧文件...
    if exist "pnpm-lock.yaml" del /f /q pnpm-lock.yaml
    
    echo [2/3] 安装依赖（包括i18next）...
    call pnpm install
    
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        echo.
        echo 请检查：
        echo 1. 是否安装了 pnpm？运行: npm install -g pnpm
        echo 2. 网络连接是否正常？
        echo.
        pause
        exit /b 1
    )
    
    echo [3/3] 依赖安装完成！
    echo.
) else (
    echo ✓ 依赖已安装
    echo.
)

echo ════════════════════════════════════════════════
echo 正在启动开发服务器...
echo ════════════════════════════════════════════════
echo.
echo 浏览器将自动打开 http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo ════════════════════════════════════════════════
echo.

call pnpm dev

pause

