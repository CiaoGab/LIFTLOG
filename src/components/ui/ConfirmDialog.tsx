import React, { useRef } from 'react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'destructive';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      // Prevent accidental dismissal while confirming/destructing actions
      allowOverlayClose={false}
      allowEscClose={false}
      initialFocusRef={confirmRef}
    >
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-text-sub-light dark:text-text-sub-dark">{message}</p>
        </div>
        <div className="p-6 border-t border-border-light dark:border-border-dark flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              variant === 'destructive'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

