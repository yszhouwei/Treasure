import React from 'react';
import { useTranslation } from 'react-i18next';
import './ApplicationSuccessPage.css';

interface ApplicationSuccessPageProps {
  application: {
    groupType: string;
    productName?: string;
    applicationNo?: string;
  };
  onBack: () => void;
  onViewStatus?: () => void;
}

const ApplicationSuccessPage: React.FC<ApplicationSuccessPageProps> = ({ 
  application, 
  onBack, 
  onViewStatus 
}) => {
  const { t } = useTranslation();

  return (
    <div className="application-success-page">
      <div className="success-content">
        {/* 成功图标 */}
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
        </div>

        {/* 标题 */}
        <h1 className="success-title">{t('applicationSuccess.title') || '申请已提交'}</h1>
        <p className="success-subtitle">{t('applicationSuccess.subtitle') || '您的团长申请已成功提交，请等待审核'}</p>

        {/* 申请信息卡片 */}
        <div className="application-info-card">
          <div className="info-card-header">
            <span className="info-label">{t('applicationSuccess.applicationType') || '申请类型'}</span>
            <span className="info-value">{application.groupType}</span>
          </div>
          
          {application.applicationNo && (
            <>
              <div className="info-divider" />
              <div className="info-card-header">
                <span className="info-label">{t('applicationSuccess.applicationNo') || '申请编号'}</span>
                <span className="info-value">{application.applicationNo}</span>
              </div>
            </>
          )}

          {application.productName && (
            <>
              <div className="info-divider" />
              <div className="info-card-header">
                <span className="info-label">{t('applicationSuccess.productName') || '申请商品'}</span>
                <span className="info-value">{application.productName}</span>
              </div>
            </>
          )}
        </div>

        {/* 审核流程说明 */}
        <div className="review-process-card">
          <h3>{t('applicationSuccess.processTitle') || '审核流程'}</h3>
          <div className="process-timeline">
            <div className="timeline-item active">
              <div className="timeline-marker">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="timeline-content">
                <h4>{t('applicationSuccess.step1Title') || '提交申请'}</h4>
                <p>{t('applicationSuccess.step1Desc') || '申请信息已提交'}</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot" />
              </div>
              <div className="timeline-content">
                <h4>{t('applicationSuccess.step2Title') || '平台审核'}</h4>
                <p>{t('applicationSuccess.step2Desc') || '1-3个工作日内完成审核'}</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-dot" />
              </div>
              <div className="timeline-content">
                <h4>{t('applicationSuccess.step3Title') || '审核结果'}</h4>
                <p>{t('applicationSuccess.step3Desc') || '审核通过后即可发起团购'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="tips-card">
          <h4>{t('applicationSuccess.tipsTitle') || '温馨提示'}</h4>
          <ul>
            <li>{t('applicationSuccess.tip1') || '审核结果将通过站内消息通知您'}</li>
            <li>{t('applicationSuccess.tip2') || '您可以在"我的团购"中查看审核状态'}</li>
            <li>{t('applicationSuccess.tip3') || '审核通过后，您即可发起对应规模的团购活动'}</li>
          </ul>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="success-footer">
        {onViewStatus && (
          <button className="view-status-btn" onClick={onViewStatus}>
            {t('applicationSuccess.viewStatus') || '查看状态'}
          </button>
        )}
        <button className="back-home-btn" onClick={onBack}>
          {t('applicationSuccess.backHome') || '返回首页'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationSuccessPage;

