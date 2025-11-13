@echo off
chcp 65001 >nul
echo ========================================
echo GitHub 配置检查工具
echo ========================================
echo.

echo [1] 检查 Git 配置
echo ----------------------------------------
git config user.name
git config user.email
echo.

echo [2] 检查远程仓库
echo ----------------------------------------
git remote -v
echo.

echo [3] 检查当前分支
echo ----------------------------------------
git branch
echo.

echo [4] 查看文件状态
echo ----------------------------------------
git status
echo.

echo ========================================
echo GitHub 配置已完成!
echo.
echo 远程仓库: https://github.com/yszhouwei/Treasure.git
echo 用户名称: Treasure Developer
echo 用户邮箱: developer@treasure.com
echo ========================================
echo.

pause

