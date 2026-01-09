import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full px-2 py-1.5 text-sm bg-slate-100 dark:bg-black/20 rounded-lg border-none focus:ring-2 focus:ring-primary flex items-center justify-between hover:bg-slate-200 dark:hover:bg-black/30 transition-colors"
      >
        <span className="truncate">{selectedOption.label}</span>
        <span className={`material-symbols-outlined text-sm ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            role="listbox"
            className="absolute z-50 mt-1 w-full bg-surface-light dark:bg-slate-900 border border-border-light dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  option.value === value
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium'
                    : 'text-text-light dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
