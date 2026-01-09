import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LogWeightModal } from '../components/analytics/LogWeightModal';
import { ChartCard } from '../components/analytics/ChartCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Select } from '../components/ui/Select';
import {
  computeSummaryStats,
  computeWeeklyVolumeTrend,
  computeBodyweightTrend,
  computeExercisePerformance,
  getUniqueExerciseNames,
} from '../utils/analytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Progress = () => {
  const { history, bodyweight, settings, addBodyWeightEntry, deleteBodyWeightEntry } = useAppStore();
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [deleteWeightId, setDeleteWeightId] = useState<string | null>(null);

  // Compute analytics
  const summaryStats = useMemo(() => computeSummaryStats(history, 4), [history]);
  const weeklyVolume = useMemo(() => computeWeeklyVolumeTrend(history, 12), [history]);
  const bodyweightTrend = useMemo(() => computeBodyweightTrend(bodyweight, 12), [bodyweight]);
  const exerciseNames = useMemo(() => getUniqueExerciseNames(history), [history]);
  const exercisePerformance = useMemo(
    () => selectedExercise ? computeExercisePerformance(history, selectedExercise) : [],
    [history, selectedExercise]
  );

  // Recent weight logs (latest 10)
  const recentWeights = useMemo(
    () => bodyweight.slice(0, 10),
    [bodyweight]
  );

  // Format date for chart labels
  const formatDate = (dateISO: string): string => {
    const date = new Date(dateISO + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format week label
  const formatWeekLabel = (weekStartISO: string): string => {
    const date = new Date(weekStartISO + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const hasHistory = history.filter(s => s.status === 'completed').length > 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">Progress Analytics</h1>
        <button
          onClick={() => setIsLogWeightOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Log Weight
        </button>
      </div>

      {/* Summary Cards */}
      {hasHistory ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
              <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Workouts (4w)</p>
              <h3 className="text-4xl font-black">{summaryStats.workoutsCompleted}</h3>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
              <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Sets (4w)</p>
              <h3 className="text-4xl font-black">{summaryStats.totalSetsCompleted}</h3>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
              <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Volume (4w)</p>
              <h3 className="text-4xl font-black text-primary">
                {summaryStats.totalVolume.toLocaleString()}
                <span className="text-lg text-text-sub-light dark:text-text-sub-dark"> {settings.units}</span>
              </h3>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
              <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark mb-1">Avg/Week</p>
              <h3 className="text-4xl font-black">{summaryStats.avgWorkoutsPerWeek.toFixed(1)}</h3>
            </div>
          </div>

          {/* Weekly Volume Chart */}
          <ChartCard title="Weekly Volume Trend (12 weeks)" className="mb-8">
            {weeklyVolume.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                  <XAxis
                    dataKey="weekStartISO"
                    tickFormatter={formatWeekLabel}
                    stroke="currentColor"
                    className="text-xs"
                  />
                  <YAxis stroke="currentColor" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(226, 232, 240)',
                      borderRadius: '0.5rem',
                    }}
                    className="dark:!bg-[#1a2233] dark:!border-[#2d3b55]"
                    labelFormatter={(label) => `Week of ${formatWeekLabel(label)}`}
                    formatter={(value: number) => [`${value.toLocaleString()} ${settings.units}`, 'Volume']}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#135bec"
                    strokeWidth={2}
                    dot={{ fill: '#135bec', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-sub-light dark:text-text-sub-dark">
                No volume data available
              </div>
            )}
          </ChartCard>

          {/* Exercise Performance Chart */}
          <ChartCard title="Exercise Performance" className="mb-8">
            {exerciseNames.length > 0 ? (
              <>
                <div className="mb-4">
                  <Select
                    value={selectedExercise}
                    onChange={setSelectedExercise}
                    options={[
                      { value: '', label: 'Select an exercise...' },
                      ...exerciseNames.map(name => ({ value: name, label: name }))
                    ]}
                    className="max-w-xs"
                  />
                </div>
                {selectedExercise ? (
                  exercisePerformance.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={exercisePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                        <XAxis
                          dataKey="dateISO"
                          tickFormatter={formatDate}
                          stroke="currentColor"
                          className="text-xs"
                        />
                        <YAxis stroke="currentColor" className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgb(255, 255, 255)',
                            border: '1px solid rgb(226, 232, 240)',
                            borderRadius: '0.5rem',
                          }}
                          className="dark:!bg-[#1a2233] dark:!border-[#2d3b55]"
                          labelFormatter={(label) => formatDate(label)}
                          formatter={(value: number) => [`${value} ${settings.units}`, 'Top Set']}
                        />
                        <Line
                          type="monotone"
                          dataKey="topSetWeight"
                          stroke="#135bec"
                          strokeWidth={2}
                          dot={{ fill: '#135bec', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-text-sub-light dark:text-text-sub-dark">
                      No logged sets yet for this exercise
                    </div>
                  )
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-text-sub-light dark:text-text-sub-dark">
                    Select an exercise to view performance
                  </div>
                )}
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-text-sub-light dark:text-text-sub-dark">
                No exercise data available
              </div>
            )}
          </ChartCard>
        </>
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 h-96 flex flex-col justify-center items-center text-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">insights</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Log your first workout to see analytics</h3>
          <p className="text-text-sub-light dark:text-text-sub-dark max-w-md">
            Complete a workout to start tracking your progress with detailed charts and statistics.
          </p>
        </div>
      )}

      {/* Bodyweight Chart */}
      <ChartCard title="Bodyweight Trend (12 weeks)" className="mb-8">
        {bodyweightTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bodyweightTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
              <XAxis
                dataKey="dateISO"
                tickFormatter={formatDate}
                stroke="currentColor"
                className="text-xs"
              />
              <YAxis stroke="currentColor" className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(226, 232, 240)',
                  borderRadius: '0.5rem',
                }}
                className="dark:!bg-[#1a2233] dark:!border-[#2d3b55]"
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number, _name: string, props: any) => {
                  const dateISO = props?.payload?.dateISO;
                  const entry = dateISO ? bodyweight.find(b => b.dateISO === dateISO) : null;
                  return [`${value} ${entry?.unit || 'kg'}`, 'Weight'];
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#135bec"
                strokeWidth={2}
                dot={{ fill: '#135bec', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-text-sub-light dark:text-text-sub-dark">
            Log weight to see your trend
          </div>
        )}
      </ChartCard>

      {/* Recent Weight Logs */}
      <ChartCard title="Recent Weight Logs">
        {recentWeights.length > 0 ? (
          <div className="space-y-2">
            {recentWeights.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/10 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-bold">
                    {new Date(entry.dateISO + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                    {entry.weight} {entry.unit}
                    {entry.note && ` • ${entry.note.length > 30 ? entry.note.substring(0, 30) + '...' : entry.note}`}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteWeightId(entry.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-sub-light dark:text-text-sub-dark">
            No weight logs yet. Click "Log Weight" to get started.
          </div>
        )}
      </ChartCard>

      {/* Modals */}
      <LogWeightModal
        isOpen={isLogWeightOpen}
        onClose={() => setIsLogWeightOpen(false)}
        onSave={addBodyWeightEntry}
        defaultUnit={settings.units}
      />

      <ConfirmDialog
        isOpen={deleteWeightId !== null}
        title="Delete Weight Entry"
        message="Are you sure you want to delete this weight entry? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteWeightId) {
            deleteBodyWeightEntry(deleteWeightId);
            setDeleteWeightId(null);
          }
        }}
        onCancel={() => setDeleteWeightId(null)}
      />
    </div>
  );
};
