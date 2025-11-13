@echo off
chcp 65001 >nul
echo ========================================
echo 正在安装依赖...
echo ========================================
echo.

cd client-h5

echo [1] 删除旧的依赖文件...
if exist "node_modules" rd /s /q node_modules
if exist "pnpm-lock.yaml" del /f /q pnpm-lock.yaml
echo.

echo [2] 安装所有依赖（包括i18next）...
pnpm install
echo.

echo ========================================
echo 依赖安装完成！
echo.
echo 现在可以运行: pnpm dev
echo ========================================
echo.

pause

