import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Template } from '../models/types';
import { TemplateEditor } from '../components/TemplateEditor';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const Templates = () => {
  const { templates, startWorkout, createTemplate, updateTemplate, deleteTemplate } = useAppStore();
  const navigate = useNavigate();
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>(undefined);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const handleStart = (id: string) => {
    startWorkout(id);
    navigate('/workout');
  };

  const handleCreate = () => {
    setEditingTemplate(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditorOpen(true);
    setMenuOpenId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ isOpen: true, id });
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.id) {
      deleteTemplate(deleteDialog.id);
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const handleSave = (templateData: Omit<Template, 'id'>) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, templateData);
    } else {
      createTemplate(templateData);
    }
    setEditorOpen(false);
    setEditingTemplate(undefined);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black tracking-tight">Templates</h1>
        <button 
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="hidden sm:inline">New Template</span>
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">edit_note</span>
          <h3 className="text-xl font-bold mb-2">No Templates Yet</h3>
          <p className="text-text-sub-light dark:text-text-sub-dark mb-6">Create a template to quickly start workouts</p>
          <button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template.id} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm hover:border-primary transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <span className="material-symbols-outlined text-2xl">fitness_center</span>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpenId(menuOpenId === template.id ? null : template.id)}
                    className="text-text-sub-light dark:text-text-sub-dark hover:text-primary p-1"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  
                  {menuOpenId === template.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
                      <div className="absolute right-0 top-full mt-1 z-50 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg py-1 min-w-[140px]">
                        <button
                          onClick={() => handleEdit(template)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{template.name}</h3>
              <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-3 line-clamp-2">
                {template.description || 'No description'}
              </p>
              
              {/* Exercise preview */}
              <div className="text-xs text-text-sub-light dark:text-text-sub-dark mb-4">
                <span className="font-medium">{template.exercises.length} exercises</span>
                {template.exercises.length > 0 && (
                  <span className="ml-1">
                    · {template.exercises.slice(0, 2).map(e => e.name).join(', ')}
                    {template.exercises.length > 2 && ` +${template.exercises.length - 2}`}
                  </span>
                )}
              </div>
              
              {template.tags && template.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button 
                onClick={() => handleStart(template.id)}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Start Workout
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Template Editor Modal */}
      {editorOpen && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSave}
          onCancel={() => { setEditorOpen(false); setEditingTemplate(undefined); }}
        />
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};
