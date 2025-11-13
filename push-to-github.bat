@echo off
chcp 65001 >nul
echo ========================================
echo 推送代码到 GitHub
echo ========================================
echo.

echo [1] 添加所有文件到暂存区
echo ----------------------------------------
git add .
echo.

echo [2] 创建提交
echo ----------------------------------------
git commit -m "feat: 完成H5客户端基础架构搭建 - 包含React+Vite+TypeScript+TailwindCSS配置 - 实现基础组件(Button, Input) - 创建MainLayout主布局 - 完成Home主页"
echo.

echo [3] 推送到 GitHub
echo ----------------------------------------
git push -u origin master
echo.

echo ========================================
echo 代码已成功推送到 GitHub!
echo ========================================
echo.

pause

