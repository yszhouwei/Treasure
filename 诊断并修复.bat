@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════╗
echo ║         问题诊断与修复工具                    ║
echo ╚════════════════════════════════════════════════╝
echo.

echo [步骤1] 检查Node.js...
node -v
if errorlevel 1 (
    echo ❌ Node.js未安装！
    echo 请访问 https://nodejs.org/ 安装Node.js
    pause
    exit /b 1
)
echo ✓ Node.js已安装
echo.

echo [步骤2] 检查pnpm...
pnpm -v >nul 2>&1
if errorlevel 1 (
    echo ❌ pnpm未安装，正在安装...
    npm install -g pnpm
    if errorlevel 1 (
        echo ❌ pnpm安装失败！
        echo 请手动运行: npm install -g pnpm
        pause
        exit /b 1
    )
    echo ✓ pnpm安装成功
) else (
    echo ✓ pnpm已安装
)
echo.

echo [步骤3] 进入项目目录...
cd client-h5
if errorlevel 1 (
    echo ❌ 找不到client-h5目录！
    pause
    exit /b 1
)
echo ✓ 目录正确
echo.

echo [步骤4] 清理旧文件...
if exist node_modules (
    echo 删除旧的node_modules...
    rd /s /q node_modules
)
if exist pnpm-lock.yaml (
    echo 删除pnpm-lock.yaml...
    del /f /q pnpm-lock.yaml
)
if exist package-lock.json (
    echo 删除package-lock.json...
    del /f /q package-lock.json
)
echo ✓ 清理完成
echo.

echo [步骤5] 安装依赖（这可能需要几分钟）...
echo 正在安装...
pnpm install
if errorlevel 1 (
    echo.
    echo ❌ 依赖安装失败！
    echo.
    echo 尝试方案：
    echo 1. 检查网络连接
    echo 2. 尝试使用npm: npm install
    echo 3. 更换npm源: npm config set registry https://registry.npmmirror.com
    echo.
    pause
    exit /b 1
)
echo ✓ 依赖安装成功
echo.

echo ════════════════════════════════════════════════
echo ✅ 所有检查通过！正在启动项目...
echo ════════════════════════════════════════════════
echo.
echo 浏览器将自动打开 http://localhost:5173
echo 按 Ctrl+C 停止服务器
echo.

pnpm dev

pause

