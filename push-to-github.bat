@echo off
chcp 65001 >nul
echo ========================================
echo 推送代码到 GitHub
echo ========================================
echo.

echo [1] 检查当前状态
echo ----------------------------------------
git status
echo.

echo [2] 添加文件到暂存区 (遵循 .gitignore 规则)
echo ----------------------------------------
echo 说明: 以下文件将被自动排除:
echo   - node_modules/
echo   - dist/, build/
echo   - .env, .env.local
echo   - IDE 配置文件 (.vscode/, .idea/)
echo   - 系统文件 (.DS_Store, Thumbs.db)
echo   - 日志文件 (*.log)
echo.
pause
echo.
echo 正在添加文件...
git add .
echo.

echo [3] 查看将要提交的文件
echo ----------------------------------------
git status --short
echo.

set /p CONFIRM="确认要提交这些文件吗? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo.
    echo 已取消提交
    pause
    exit /b
)
echo.

echo [4] 输入提交信息
echo ----------------------------------------
echo 提交信息格式建议:
echo   feat: 新增功能
echo   fix: 修复问题
echo   docs: 更新文档
echo   style: 样式调整
echo   refactor: 代码重构
echo   perf: 性能优化
echo   test: 测试相关
echo.
set /p COMMIT_MSG="请输入提交信息: "

if "%COMMIT_MSG%"=="" (
    echo.
    echo 错误: 提交信息不能为空!
    pause
    exit /b
)
echo.

echo [5] 创建提交
echo ----------------------------------------
git commit -m "%COMMIT_MSG%"
echo.

echo [6] 推送到 GitHub
echo ----------------------------------------
git push -u origin master
echo.

if errorlevel 1 (
    echo.
    echo ❌ 推送失败! 请检查网络连接或权限
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 代码已成功推送到 GitHub!
echo ========================================
echo.
echo 提交信息: %COMMIT_MSG%
echo 远程分支: origin/master
echo.

pause

