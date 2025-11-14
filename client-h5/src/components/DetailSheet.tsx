import React, { useEffect } from 'react';
import './DetailSheet.css';

interface DetailSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
  closeLabel?: string;
}

const DetailSheet: React.FC<DetailSheetProps> = ({ open, title, onClose, children, ctaLabel, onCta, closeLabel }) => {
  useEffect(() => {
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
    return undefined;
  }, [open]);

  const handleCta = () => {
    if (onCta) {
      onCta();
    }
  };

  return (
    <div className={`detail-sheet-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="detail-sheet-backdrop" onClick={onClose} />
      <div className="detail-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="detail-sheet-header">
          <h3>{title}</h3>
          <button className="detail-sheet-close" onClick={onClose} aria-label={closeLabel ?? 'close'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>
        <div className="detail-sheet-body">{children}</div>
        {ctaLabel && (
          <button className="detail-sheet-cta" onClick={handleCta}>
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default DetailSheet;
