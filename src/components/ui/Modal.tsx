import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  allowOverlayClose?: boolean;
  allowEscClose?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  allowOverlayClose = true,
  allowEscClose = true,
  initialFocusRef,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus initial element
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }

    // ESC key handler
    const handleEsc = (e: KeyboardEvent) => {
      if (!allowEscClose) return;
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, initialFocusRef, allowEscClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (allowOverlayClose && e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
};

