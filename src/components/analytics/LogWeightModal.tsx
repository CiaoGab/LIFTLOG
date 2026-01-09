import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { BodyWeightEntry } from '../../models/types';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<BodyWeightEntry, 'id'>) => void;
  defaultUnit?: 'kg' | 'lb';
}

export const LogWeightModal: React.FC<LogWeightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultUnit = 'kg',
}) => {
  const [dateISO, setDateISO] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lb'>(defaultUnit);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      setError('Weight must be greater than 0');
      return;
    }

    onSave({
      dateISO,
      weight: weightNum,
      unit,
      note: note.trim() || undefined,
    });

    // Reset form
    setDateISO(new Date().toISOString().split('T')[0]);
    setWeight('');
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={weightInputRef}>
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h3 className="font-bold text-lg">Log Weight</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-text-sub-light dark:text-text-sub-dark">
              Date
            </label>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Weight and Unit */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1 text-text-sub-light dark:text-text-sub-dark">
                Weight
              </label>
              <input
                ref={weightInputRef}
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-sub-light dark:text-text-sub-dark">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'kg' | 'lb')}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium mb-1 text-text-sub-light dark:text-text-sub-dark">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-text-sub-light dark:text-text-sub-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
