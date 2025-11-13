@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════╗
echo ║     使用 npm 安装并启动（备用方案）           ║
echo ╚════════════════════════════════════════════════╝
echo.

cd client-h5

echo [1] 清理旧文件...
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
if exist pnpm-lock.yaml del /f /q pnpm-lock.yaml
echo.

echo [2] 使用npm安装依赖...
npm install
if errorlevel 1 (
    echo.
    echo ❌ 安装失败！尝试更换npm源...
    npm config set registry https://registry.npmmirror.com
    npm install
)
echo.

echo [3] 启动项目...
echo ════════════════════════════════════════════════
echo 浏览器将自动打开 http://localhost:5173
echo ════════════════════════════════════════════════
echo.

npm run dev

pause

