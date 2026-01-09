import React, { useState, useEffect, useMemo } from 'react';
import { loadExerciseDb } from '../data/loadExerciseDb';
import { ExerciseDbItem } from '../models/types';
import { Select } from './ui/Select';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (name: string, muscleGroup: string, category?: string) => void;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [exercises, setExercises] = useState<ExerciseDbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('All');
  const [muscleFilter, setMuscleFilter] = useState<string>('All');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  // Load exercise DB when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    loadExerciseDb()
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [isOpen]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const equipment = new Set<string>();
    const muscles = new Set<string>();

    exercises.forEach(ex => {
      if (ex.category) categories.add(ex.category);
      if (ex.equipment) equipment.add(ex.equipment);
      ex.primaryMuscles.forEach(m => muscles.add(m));
    });

    return {
      categories: Array.from(categories).sort(),
      equipment: Array.from(equipment).sort(),
      muscles: Array.from(muscles).sort()
    };
  }, [exercises]);

  // Filter and search exercises
  const filtered = useMemo(() => {
    const searchLower = debouncedSearch.toLowerCase();
    
    return exercises.filter(ex => {
      // Category filter
      if (categoryFilter !== 'All' && ex.category !== categoryFilter) return false;
      
      // Equipment filter
      if (equipmentFilter !== 'All' && ex.equipment !== equipmentFilter) return false;
      
      // Muscle filter
      if (muscleFilter !== 'All' && !ex.primaryMuscles.includes(muscleFilter)) return false;
      
      // Search filter
      if (searchLower) {
        const matchesName = ex.name.toLowerCase().includes(searchLower);
        const matchesCategory = ex.category?.toLowerCase().includes(searchLower);
        const matchesEquipment = ex.equipment?.toLowerCase().includes(searchLower);
        const matchesMuscle = ex.primaryMuscles.some(m => m.toLowerCase().includes(searchLower)) ||
                              ex.secondaryMuscles.some(m => m.toLowerCase().includes(searchLower));
        
        if (!matchesName && !matchesCategory && !matchesEquipment && !matchesMuscle) {
          return false;
        }
      }
      
      return true;
    });
  }, [exercises, debouncedSearch, categoryFilter, equipmentFilter, muscleFilter]);

  // Group exercises
  const grouped = useMemo(() => {
    const groups: Record<string, ExerciseDbItem[]> = {};
    
    filtered.forEach(ex => {
      const groupKey = ex.primaryMuscles[0] || ex.category || 'Other';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(ex);
    });
    
    return groups;
  }, [filtered]);

  // Limit rendered results for performance
  const renderLimit = 200;
  const shouldShowMore = filtered.length > renderLimit;

  // Calculate how many items to show per group
  const getGroupRenderLimit = (groupIndex: number, remaining: number) => {
    const groups = Object.entries(grouped);
    const isLastGroup = groupIndex === groups.length - 1;
    if (isLastGroup) return remaining; // Use all remaining for last group
    return Math.min(60, remaining); // Max 60 per group, or remaining if less
  };

  const handleSelect = (ex: ExerciseDbItem) => {
    const muscleGroup = ex.primaryMuscles[0] || ex.category || 'Other';
    onSelect(ex.name, muscleGroup, ex.category);
  };

  const handleAddCustom = () => {
    if (customName.trim()) {
      onSelect(customName.trim(), 'Other');
      setCustomName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Add Exercise</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light dark:text-text-sub-dark">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-border-light dark:border-border-dark shrink-0 grid grid-cols-3 gap-2">
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: 'All', label: 'All Categories' },
              ...filterOptions.categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
          
          <Select
            value={equipmentFilter}
            onChange={setEquipmentFilter}
            options={[
              { value: 'All', label: 'All Equipment' },
              ...filterOptions.equipment.map(eq => ({ value: eq, label: eq }))
            ]}
          />
          
          <Select
            value={muscleFilter}
            onChange={setMuscleFilter}
            options={[
              { value: 'All', label: 'All Muscles' },
              ...filterOptions.muscles.map(muscle => ({ value: muscle, label: muscle }))
            ]}
          />
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="text-center py-8 text-text-sub-light dark:text-text-sub-dark">
              Loading exercises...
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          {!loading && !error && Object.keys(grouped).length === 0 && (
            <div className="text-center py-8 text-text-sub-light dark:text-text-sub-dark">
              No exercises found
            </div>
          )}
          
          {!loading && !error && (() => {
            const groups = Object.entries(grouped);
            let remaining = renderLimit;
            let totalRendered = 0;
            
            return (
              <>
                {groups.map(([group, groupExercises], groupIndex) => {
                  const limit = getGroupRenderLimit(groupIndex, remaining);
                  const toRender = groupExercises.slice(0, limit);
                  const hasMore = groupExercises.length > toRender.length;
                  remaining -= toRender.length;
                  totalRendered += toRender.length;
                  
                  return (
                    <div key={group}>
                      <h4 className="text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider mb-2">
                        {group} {hasMore && `(${toRender.length} of ${groupExercises.length})`}
                      </h4>
                      <div className="space-y-1">
                        {toRender.map(ex => (
                          <button
                            key={ex.id || ex.name}
                            onClick={() => handleSelect(ex)}
                            className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between group transition-colors"
                          >
                            <span className="font-medium">{ex.name}</span>
                            <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              add_circle
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {shouldShowMore && totalRendered >= renderLimit && (
                  <div className="text-center py-2 text-xs text-text-sub-light dark:text-text-sub-dark">
                    Showing first {renderLimit} results. Refine your search to see more.
                  </div>
                )}
              </>
            );
          })()}

          {/* Custom exercise */}
          <div className="pt-4 border-t border-border-light dark:border-border-dark">
            <h4 className="text-xs font-bold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider mb-2">
              Custom Exercise
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Exercise name..."
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-black/20 rounded-xl border-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <button
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
