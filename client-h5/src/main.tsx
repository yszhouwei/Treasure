import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

// 检测微信浏览器并隐藏导航栏
function hideWeChatNavbar() {
  const ua = navigator.userAgent.toLowerCase();
  const isWeChat = /micromessenger/.test(ua);
  
  if (isWeChat) {
    // 立即隐藏已存在的导航栏
    const hideNavbar = () => {
      // 隐藏微信导航栏iframe
      const navbars = [
        document.getElementById('wx_navbar'),
        document.getElementById('wx_navbar_iframe'),
        ...Array.from(document.querySelectorAll('iframe[id*="wx_navbar"]')),
        ...Array.from(document.querySelectorAll('iframe[name*="wx_navbar"]')),
        ...Array.from(document.querySelectorAll('.wx_navbar')),
        ...Array.from(document.querySelectorAll('.wx_navbar_iframe')),
      ];
      
      navbars.forEach((el) => {
        if (el) {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.height = '0';
          (el as HTMLElement).style.width = '0';
          (el as HTMLElement).style.opacity = '0';
        }
      });
      
      // 隐藏可能包含导航栏的容器
      const containers = document.querySelectorAll('body > div:first-child');
      containers.forEach((container) => {
        const html = container.innerHTML || '';
        if (html.includes('wx_navbar') || html.includes('client-h5')) {
          const style = (container as HTMLElement).style;
          if (style.position === 'fixed' && style.top === '0px') {
            (container as HTMLElement).style.display = 'none';
          }
        }
      });
    };
    
    // 立即执行一次
    hideNavbar();
    
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
      hideNavbar();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // 延迟执行，确保捕获动态插入的元素
    setTimeout(hideNavbar, 100);
    setTimeout(hideNavbar, 500);
    setTimeout(hideNavbar, 1000);
  }
}

// 在DOM加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideWeChatNavbar);
} else {
  hideWeChatNavbar();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
