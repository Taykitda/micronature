import React, { useState } from 'react';
import { Plant, CareTask } from './types';
import { INITIAL_PLANTS, INITIAL_TASKS, BRAND_IMAGES } from './data';
import Explore from './components/Explore';
import CareWorkbench from './components/CareWorkbench';
import Encyclopedia from './components/Encyclopedia';
import LandscapingDesign from './components/LandscapingDesign';
import Community from './components/Community';
import AIDoctor from './components/AIDoctor';
import UserProfileModal from './components/UserProfileModal';
import LoginModal from './components/LoginModal';
import { Sparkles, Sprout, HeartPulse, Compass, Users, BookOpen, Compass as MapPin, TreePine, Eye, ShieldCheck, LogOut } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'explore' | 'care' | 'encyclopedia' | 'landscaping' | 'community' | 'doctor'>('explore');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Authentication state
  const [token, setToken] = useState<string | null>(localStorage.getItem('mn_token'));

  // User Profile State with LocalStorage cache
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem('mn_user_name') || '我的绿洲主理人',
    email: localStorage.getItem('mn_user_email') || 'taykitda@gmail.com',
    avatar: localStorage.getItem('mn_user_avatar') || BRAND_IMAGES.expertAvatar,
    role: localStorage.getItem('mn_user_role') || '高级绿植造景师',
    exp: (localStorage.getItem('mn_user_exp') as 'beginner' | 'intermediate' | 'expert') || 'expert',
    notify: localStorage.getItem('mn_user_notify') === 'false' ? false : true,
    bio: localStorage.getItem('mn_user_bio') || '热心理工男，喜欢在阳台用物联网探针调教各种雨林植物。'
  });

  const handleSaveProfile = (updated: typeof userProfile) => {
    setUserProfile(updated);
    localStorage.setItem('mn_user_name', updated.name);
    localStorage.setItem('mn_user_email', updated.email);
    localStorage.setItem('mn_user_avatar', updated.avatar);
    localStorage.setItem('mn_user_role', updated.role);
    localStorage.setItem('mn_user_exp', updated.exp);
    localStorage.setItem('mn_user_notify', String(updated.notify));
    localStorage.setItem('mn_user_bio', updated.bio);

    if (token) {
      fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      }).catch(err => console.error('Failed to sync profile:', err));
    }
  };

  // Plants State
  const [plants, setPlants] = useState<Plant[]>([]);

  // Care Tasks State
  const [tasks, setTasks] = useState<CareTask[]>([]);

  const fetchUserData = (jwtToken: string) => {
    fetch('/api/plants', {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch plants');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setPlants(data);
      })
      .catch(err => console.error('Failed to fetch plants:', err));

    fetch('/api/tasks', {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(err => console.error('Failed to fetch tasks:', err));
  };

  // Load initial data from Express backend
  React.useEffect(() => {
    if (token) {
      fetchUserData(token);
    } else {
      setPlants([]);
      setTasks([]);
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, user: any) => {
    setToken(newToken);
    localStorage.setItem('mn_token', newToken);

    const mappedProfile = {
      name: user.username,
      email: user.email || 'user@micronature.com',
      avatar: user.avatar || BRAND_IMAGES.expertAvatar,
      role: user.role === 'admin' ? '系统管理员' : '高级绿植造景师',
      exp: (user.exp || 'expert') as any,
      notify: true,
      bio: user.bio || '新晋绿植主理人'
    };

    setUserProfile(mappedProfile);
    localStorage.setItem('mn_user_name', mappedProfile.name);
    localStorage.setItem('mn_user_email', mappedProfile.email);
    localStorage.setItem('mn_user_avatar', mappedProfile.avatar);
    localStorage.setItem('mn_user_role', mappedProfile.role);
    localStorage.setItem('mn_user_exp', mappedProfile.exp);
    localStorage.setItem('mn_user_bio', mappedProfile.bio);

    fetchUserData(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('mn_token');
    localStorage.removeItem('mn_user_name');
    localStorage.removeItem('mn_user_email');
    localStorage.removeItem('mn_user_avatar');
    localStorage.removeItem('mn_user_role');
    localStorage.removeItem('mn_user_exp');
    localStorage.removeItem('mn_user_bio');

    setUserProfile({
      name: '我的绿洲主理人',
      email: 'taykitda@gmail.com',
      avatar: BRAND_IMAGES.expertAvatar,
      role: '高级绿植造景师',
      exp: 'expert',
      notify: true,
      bio: '热心理工男，喜欢在阳台用物联网探针调教各种雨林植物。'
    });

    setCurrentTab('explore');
    setPlants([]);
    setTasks([]);
  };

  const handleTabClick = (tab: typeof currentTab) => {
    if (tab === 'explore' || tab === 'encyclopedia') {
      setCurrentTab(tab);
    } else {
      if (!token) {
        setIsLoginModalOpen(true);
      } else {
        setCurrentTab(tab);
      }
    }
  };

  const handleWaterPlant = (plantId: string) => {
    fetch(`/api/plants/${plantId}/water`, { 
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to water plant');
        return res.json();
      })
      .then(updatedPlant => {
        setPlants(plants.map(p => p.id === plantId ? updatedPlant : p));
      })
      .catch(err => console.error(err));
  };

  const handleFertilizePlant = (plantId: string) => {
    fetch(`/api/plants/${plantId}/fertilize`, { 
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fertilize plant');
        return res.json();
      })
      .then(updatedPlant => {
        setPlants(plants.map(p => p.id === plantId ? updatedPlant : p));
      })
      .catch(err => console.error(err));
  };

  const handleAddCustomPlant = (newP: Omit<Plant, 'id' | 'status'>) => {
    const freshPlant = {
      ...newP,
      id: `plant-${Date.now()}`,
      status: 'optimal' as const
    };
    fetch('/api/plants', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(freshPlant)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add custom plant');
        return res.json();
      })
      .then(savedPlant => {
        setPlants([...plants, savedPlant]);
      })
      .catch(err => console.error(err));
  };

  const handleDeletePlant = (id: string) => {
    fetch(`/api/plants/${id}`, { 
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete plant');
        setPlants(plants.filter(p => p.id !== id));
        return fetch('/api/tasks', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data) setTasks(data);
      })
      .catch(err => console.error(err));
  };

  const handleToggleTask = (taskId: string) => {
    fetch(`/api/tasks/${taskId}/toggle`, { 
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to toggle task');
        return res.json();
      })
      .then(updatedTask => {
        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      })
      .catch(err => console.error(err));
  };

  const handleAddTask = (newT: Omit<CareTask, 'id' | 'done'>) => {
    const freshTask = {
      ...newT,
      id: `task-${Date.now()}`,
      done: false
    };
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(freshTask)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add task');
        return res.json();
      })
      .then(savedTask => {
        setTasks([savedTask, ...tasks]);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-[#fafaf6] flex flex-col font-sans text-gray-800">
      
      {/* 🌲 Nature Top Brand Bar */}
      <header className="sticky top-0 z-40 bg-[#fafaf6]/90 backdrop-blur-md border-b border-emerald-900/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-3xl text-emerald-805 fill-current animate-pulse">spa</span>
            <div>
              <span className="font-serif text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1.5">
                MicroNature <span className="text-emerald-700 italic font-normal text-sm">缩影自然</span>
              </span>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">掌上室内生态与AI医馆</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Environmental telemetry tracker */}
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-805 text-md">co2</span>
                <span>碳吸收系数: <strong className="text-emerald-800 font-mono">1.45 kg/d</strong></span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-805 text-md">air</span>
                <span>空气净化量: <strong className="text-emerald-800 font-mono">15.4 K/m³</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>物联传感在线</span>
              </div>
            </div>

            {/* 👤 User Session Triggers */}
            {token ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 bg-white hover:bg-emerald-50/50 border border-neutral-200 hover:border-emerald-800 p-1.5 pr-3.5 rounded-full shadow-xs cursor-pointer transition-all duration-300 group"
                  id="header-profile-btn"
                  title="打开个人中心"
                >
                  <img 
                    src={userProfile.avatar} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full object-cover border border-emerald-100 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-gray-950 leading-tight group-hover:text-emerald-900 transition-colors">{userProfile.name}</p>
                    <p className="text-[9px] text-gray-400 font-mono uppercase tracking-tight">{userProfile.role}</p>
                  </div>
                </button>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="退出登录"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white border border-emerald-950 px-4 py-2 rounded-full text-xs font-bold shadow-xs cursor-pointer transition-all"
                id="header-login-btn"
              >
                <span>登录 / 注册</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 🎛️ Navigation and Main Layout Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Nav Tabs */}
        <div className="flex items-center overflow-x-auto pb-2 border-b gap-1 font-semibold scrollbar-none">
          <button 
            onClick={() => handleTabClick('explore')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'explore' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>探索自然</span>
          </button>

          <button 
            onClick={() => handleTabClick('care')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'care' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>养护工作台</span>
          </button>

          <button 
            onClick={() => handleTabClick('doctor')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'doctor' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>AI 植物医馆</span>
          </button>

          <button 
            onClick={() => handleTabClick('encyclopedia')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'encyclopedia' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>科普智慧百科</span>
          </button>

          <button 
            onClick={() => handleTabClick('landscaping')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'landscaping' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>造景与设计</span>
          </button>

          <button 
            onClick={() => handleTabClick('community')}
            className={`px-5 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all ${
              currentTab === 'community' 
                ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>绿植微生社区</span>
          </button>
        </div>

        {/* Dynamic Tab Body Render */}
        <div className="animate-in fade-in duration-300">
          {currentTab === 'explore' && (
            <Explore 
              onNavigateToCare={() => handleTabClick('care')}
              onNavigateToDoctor={() => handleTabClick('doctor')}
            />
          )}

          {currentTab === 'care' && (
            <CareWorkbench 
              plants={plants}
              tasks={tasks}
              onWaterPlant={handleWaterPlant}
              onFertilizePlant={handleFertilizePlant}
              onAddCustomPlant={handleAddCustomPlant}
              onDeletePlant={handleDeletePlant}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          )}

          {currentTab === 'doctor' && (
            <AIDoctor plants={plants} />
          )}

          {currentTab === 'encyclopedia' && (
            <Encyclopedia />
          )}

          {currentTab === 'landscaping' && (
            <LandscapingDesign />
          )}

          {currentTab === 'community' && (
            <Community userProfile={userProfile} />
          )}
        </div>

      </main>

      {/* 🌲 Bottom Footer */}
      <footer className="bg-emerald-950 text-emerald-100 py-12 border-t mt-16 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 leading-relaxed">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-emerald-400">spa</span>
              <span className="font-serif text-lg font-bold tracking-tight text-white">MicroNature</span>
            </div>
            <p className="text-emerald-250 pr-8">
              缩影自然是一个致力于让都市室内生态唯美化、科技化和可量化的平台。我们精选高洁净净化绿植并为其定制智能微观复苏指南。
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">学名科别快捷研究</h4>
            <ul className="space-y-2 text-emerald-200">
              <li>桑科榕属 (Ficus Lyrata) - 明亮有散光，不可过早积水</li>
              <li>天南星科 (Monstera Deliciosa) - 空气高气孔蒸腾活性，宠物需避免啃食</li>
              <li>景天酸CAM (Sansevieria) - 暗夜持续吸收净化甲醛效率显著</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">微生态保护宣言</h4>
            <div className="p-4 bg-emerald-900 rounded-xl space-y-1">
              <p className="font-semibold text-white">🌿 绿脉守护伙伴计划 2026</p>
              <p className="text-emerald-200">用户每提交 1 份 AI 真机康复诊断，我们将向荒漠防风林基金捐建 0.1M² 太行山防风沙障。</p>
            </div>
            <p className="text-emerald-300">© 2026 MicroNature. Built with Google AI Studio & Gemini.</p>
          </div>

        </div>
      </footer>

      {/* 👤 User Personal Center Modal Component */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={userProfile} 
        onSave={handleSaveProfile} 
      />

      {/* 🔐 Login / Register Modal Component */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
