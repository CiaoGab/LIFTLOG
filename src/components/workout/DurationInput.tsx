import React, { useState, useEffect } from 'react';
import { formatDuration, parseDuration } from '../../utils/duration';

interface DurationInputProps {
  value: number | null;
  onChange: (seconds: number | null) => void;
  className?: string;
}

export const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(formatDuration(value));

  // Update input when value prop changes (e.g., from external source)
  useEffect(() => {
    setInputValue(formatDuration(value));
  }, [value]);

  const handleBlur = () => {
    const parsed = parseDuration(inputValue);
    onChange(parsed);
    // Update display to formatted value
    setInputValue(formatDuration(parsed));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="mm:ss"
      className={className}
    />
  );
};
