@echo off
chcp 65001 >nul
echo ========================================
echo 启动 TreasureX H5 客户端
echo ========================================
echo.

cd client-h5

echo [1] 检查依赖...
if not exist "node_modules\" (
    echo 未检测到依赖，正在安装...
    call pnpm install
    echo.
) else (
    echo ✓ 依赖已安装
    echo.
)

echo [2] 启动开发服务器...
echo.
echo ========================================
echo 服务器启动中...
echo 浏览器将自动打开 http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

pnpm dev

pause

