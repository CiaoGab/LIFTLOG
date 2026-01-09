import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const NavItem = ({ to, icon, label, end = false }: { to: string, icon: string, label: string, end?: boolean }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-text-sub-light dark:text-text-sub-dark hover:bg-slate-100 dark:hover:bg-white/5'
        }`
      }
    >
      <span className={`material-symbols-outlined ${window.location.pathname === to ? 'icon-filled' : ''}`}>{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </NavLink>
  );
};

const MobileNavItem = ({ to, icon, label }: { to: string, icon: string, label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center p-2 transition-colors ${
          isActive ? 'text-primary' : 'text-text-sub-light dark:text-text-sub-dark'
        }`
      }
    >
      <span className="material-symbols-outlined text-2xl mb-1">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
};

export const Layout = () => {
  const activeSession = useAppStore(state => state.activeSession);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-background-dark shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">fitness_center</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LiftLog</h1>
            <p className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">Pro Member</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem to="/home" icon="home" label="Home" />
          <NavItem to="/workout" icon="fitness_center" label={activeSession ? "Live Session" : "Workout"} />
          <NavItem to="/templates" icon="edit_note" label="Templates" />
          <NavItem to="/history" icon="history" label="History" />
          <NavItem to="/progress" icon="monitoring" label="Analytics" />
          <NavItem to="/export" icon="download" label="Export" />
          <NavItem to="/settings" icon="settings" label="Settings" />
        </nav>
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4x6cvtubmZQlxQnobcOcd1Ep3ytz9G8ZQAFdKhyPPsjVrP9PEKbrqPrSTIj-OFX6XxeV5X7quE2fufFCGvp3jyWsTMgGuxSxRIDVCZcAV3orW0zmBPyOku7nC0X0h4KOcHpLGwrFPOYugoJx9tkiB2KKtBSXUP0lYPuTJ5jFpuunEi57HpwltUM0BawdFNTF33lXXtCCBKIyeK8-qQqIxrnwnzT6iWu2FK1vIh0lrzQWWxq2hvb48aKyEmimb6JbyRQV1Dq_PPg)'}}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-background-dark border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">fitness_center</span>
            </div>
            <h1 className="text-lg font-bold">LiftLog</h1>
          </div>
          {/* Simple placeholder for user/menu */}
          <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4x6cvtubmZQlxQnobcOcd1Ep3ytz9G8ZQAFdKhyPPsjVrP9PEKbrqPrSTIj-OFX6XxeV5X7quE2fufFCGvp3jyWsTMgGuxSxRIDVCZcAV3orW0zmBPyOku7nC0X0h4KOcHpLGwrFPOYugoJx9tkiB2KKtBSXUP0lYPuTJ5jFpuunEi57HpwltUM0BawdFNTF33lXXtCCBKIyeK8-qQqIxrnwnzT6iWu2FK1vIh0lrzQWWxq2hvb48aKyEmimb6JbyRQV1Dq_PPg)'}}></div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bg-surface-light dark:bg-[#1a2233] border-t border-border-light dark:border-border-dark flex justify-around pb-safe pt-1 shrink-0 z-50">
          <MobileNavItem to="/home" icon="home" label="Home" />
          <MobileNavItem to="/workout" icon="fitness_center" label="Workout" />
          <MobileNavItem to="/history" icon="history" label="History" />
          <MobileNavItem to="/progress" icon="monitoring" label="Progress" />
          <MobileNavItem to="/settings" icon="settings" label="Settings" />
        </nav>
      </main>
    </div>
  );
};
