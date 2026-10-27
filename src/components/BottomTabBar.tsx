import React from 'react';
import { 
  Compass,
  Flame, 
  Code2, 
  Target, 
  GitBranch, 
  User as UserIcon,
  Radio
} from 'lucide-react';
import { playTechClick } from '../utils/audio';

export type TabType = 'discover' | 'feed' | 'editor' | 'match' | 'timeline' | 'profile';

interface BottomTabBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isPairingActive: boolean;
  isMobileFrame?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  isPairingActive,
  isMobileFrame = false
}) => {
  const tabs = [
    {
      id: 'discover' as TabType,
      label: 'Discover',
      icon: Compass,
      badge: null
    },
    {
      id: 'feed' as TabType,
      label: 'Pulse',
      icon: Flame,
      badge: null
    },
    {
      id: 'editor' as TabType,
      label: 'Live IDE',
      icon: Code2,
      badge: isPairingActive ? 'LIVE' : null
    },
    {
      id: 'match' as TabType,
      label: 'Sprints',
      icon: Target,
      badge: '96%'
    },
    {
      id: 'timeline' as TabType,
      label: 'Roadmap',
      icon: GitBranch,
      badge: null
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: UserIcon,
      badge: null
    }
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className={`${
        isMobileFrame ? 'absolute' : 'fixed'
      } bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 transition-colors safe-area-bottom shadow-lg`}
    >
      <div className="max-w-md md:max-w-2xl mx-auto grid grid-cols-6 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTechClick(850);
                onChangeTab(tab.id);
              }}
              className="relative min-h-[48px] min-w-[44px] flex flex-col items-center justify-center py-1 transition-all active:scale-95 group"
            >
              <div className="relative">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.4]'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                
                {tab.badge === 'LIVE' && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 text-[7px] font-mono font-bold bg-emerald-500 text-slate-950 rounded uppercase tracking-tighter animate-pulse flex items-center gap-0.5">
                    <Radio className="w-1.5 h-1.5 text-slate-950 inline" />
                    LIVE
                  </span>
                )}

                {tab.badge === '96%' && (
                  <span className="absolute -top-1.5 -right-2.5 px-0.5 text-[7px] font-mono font-semibold bg-violet-500 text-white rounded">
                    96%
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] font-medium tracking-tight mt-1 transition-colors truncate max-w-full px-0.5 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
