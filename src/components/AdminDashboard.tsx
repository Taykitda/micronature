import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users as UsersIcon, 
  Database, 
  LogOut, 
  ArrowLeft, 
  Trash2, 
  ShieldAlert, 
  Sprout, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Activity, 
  Clock, 
  UserPlus,
  BookOpen,
  Edit
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  exp: 'beginner' | 'intermediate' | 'expert';
  created_at: string;
}

interface Analytics {
  totalPV: number;
  totalUV: number;
  avgLatency: number;
  dailyStats: { date: string; pv: number; uv: number }[];
  popularEndpoints: { method: string; url: string; count: number }[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Authentication & Session States
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mn_token'));
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Login Form States (if not authenticated as admin)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'content'>('analytics');
  const [contentSubTab, setContentSubTab] = useState<'plants' | 'tasks' | 'posts' | 'encyclopedia'>('plants');

  // Admin Data States
  const [usersList, setUsersList] = useState<User[]>([]);
  const [plantsList, setPlantsList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [encyclopediaList, setEncyclopediaList] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<Analytics | null>(null);

  // Add/Edit Encyclopedia Modal States
  const [isAddEpOpen, setIsAddEpOpen] = useState(false);
  const [editingEp, setEditingEp] = useState<any | null>(null);
  const [epName, setEpName] = useState('');
  const [epLatinName, setEpLatinName] = useState('');
  const [epCategory, setEpCategory] = useState('');
  const [epLightRequirement, setEpLightRequirement] = useState('diffuse');
  const [epToxicity, setEpToxicity] = useState('safe');
  const [epDifficulty, setEpDifficulty] = useState('easy');
  const [epThumbnail, setEpThumbnail] = useState('');
  const [epWaterRequirement, setEpWaterRequirement] = useState('');
  const [epDescription, setEpDescription] = useState('');
  const [epCareSecrets, setEpCareSecrets] = useState('');
  const [epUploadLoading, setEpUploadLoading] = useState(false);

  // Fetch admin profile and verify role
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Auth verify failed');
        return res.json();
      })
      .then(data => {
        if (data.role === 'admin') {
          setIsAdmin(true);
          setAdminUser(data);
        } else {
          setIsAdmin(false);
          setLoginError('拒绝访问：需要管理员账号权限');
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setToken(null);
        localStorage.removeItem('mn_token');
      });
  }, [token]);

  // Load Admin Dashboard Data once authorized
  useEffect(() => {
    if (!isAdmin || !token) return;

    // Load Analytics
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(err => console.error(err));

    // Load Users
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(err => console.error(err));

    // Load Content
    fetch('/api/plants', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPlantsList(data))
      .catch(err => console.error(err));

    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTasksList(data))
      .catch(err => console.error(err));

    fetch('/api/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPostsList(data))
      .catch(err => console.error(err));

    fetch('/api/encyclopedia')
      .then(res => res.json())
      .then(data => setEncyclopediaList(data))
      .catch(err => console.error(err));
  }, [isAdmin, token, activeTab, contentSubTab]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '登录失败，请检查账号和密码');
      }

      if (data.user.role !== 'admin') {
        throw new Error('拒绝访问：此账户不是管理员');
      }

      localStorage.setItem('mn_token', data.token);
      localStorage.setItem('mn_user_name', data.user.username);
      localStorage.setItem('mn_user_avatar', data.user.avatar);
      localStorage.setItem('mn_user_role', data.user.role);
      
      setToken(data.token);
      setIsAdmin(true);
      setAdminUser(data.user);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mn_token');
    setToken(null);
    setIsAdmin(false);
    setAdminUser(null);
    navigate('/');
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, role: nextRole } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('确定要删除此用户吗？此操作不可逆，用户数据将全部清除。')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsersList(usersList.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (!window.confirm('确定要强行移除此绿植监护卡片吗？')) return;
    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPlantsList(plantsList.filter(p => p.id !== plantId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('确定要下架删除此社区日志吗？')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPostsList(postsList.filter(p => p.id !== postId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setTasksList(tasksList.map(t => t.id === taskId ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // Encyclopedia CRUD Operations
  // ==========================================

  const handleDeleteEncyclopedia = async (epId: string) => {
    if (!window.confirm('确定要下架删除此科普百科植物吗？将不可恢复。')) return;
    try {
      const res = await fetch(`/api/admin/encyclopedia/${epId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEncyclopediaList(encyclopediaList.filter(item => item.id !== epId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEncyclopediaClick = (ep: any) => {
    setEditingEp(ep);
    setEpName(ep.name);
    setEpLatinName(ep.latinName);
    setEpCategory(ep.category || '');
    setEpLightRequirement(ep.lightRequirement);
    setEpToxicity(ep.toxicity);
    setEpDifficulty(ep.difficulty);
    setEpThumbnail(ep.thumbnail);
    setEpWaterRequirement(ep.waterRequirement);
    setEpDescription(ep.description);
    setEpCareSecrets(ep.careSecrets || '');
    setIsAddEpOpen(true);
  };

  const handleEpImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEpUploadLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEpThumbnail(data.url);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setEpUploadLoading(false);
    }
  };

  const handleAddEncyclopediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingEp;
    const id = isEdit ? editingEp.id : `ep-${Date.now()}`;
    const payload = {
      id,
      name: epName,
      latinName: epLatinName,
      category: epCategory,
      lightRequirement: epLightRequirement,
      toxicity: epToxicity,
      difficulty: epDifficulty,
      thumbnail: epThumbnail || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=300',
      waterRequirement: epWaterRequirement,
      description: epDescription,
      careSecrets: epCareSecrets
    };

    try {
      const url = isEdit ? `/api/admin/encyclopedia/${editingEp.id}` : '/api/admin/encyclopedia';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = isEdit ? payload : await res.json();
        if (isEdit) {
          setEncyclopediaList(encyclopediaList.map(item => item.id === editingEp.id ? saved : item));
        } else {
          setEncyclopediaList([saved, ...encyclopediaList]);
        }
        setIsAddEpOpen(false);
        setEditingEp(null);
        // Clear form
        setEpName('');
        setEpLatinName('');
        setEpCategory('');
        setEpLightRequirement('diffuse');
        setEpToxicity('safe');
        setEpDifficulty('easy');
        setEpThumbnail('');
        setEpWaterRequirement('');
        setEpDescription('');
        setEpCareSecrets('');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`保存失败: ${errData.error || res.statusText || '未知错误'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // RENDER: Admin Login Page (Fallback)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans text-slate-100">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-600/10 rounded-full blur-3xl"></div>

          <div className="text-center space-y-2 relative">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-serif">MicroNature 管理中心</h2>
            <p className="text-xs text-slate-400 font-mono">MICRONATURE CONTROL PORTAL V2</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 relative">
            {loginError && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">管理员账号</label>
              <input 
                type="text" 
                required
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder="请输入管理员账户" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">安全密码</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="请输入密码" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-slate-500"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 rounded-xl text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? "安全认证中..." : "建立安全连接"}
            </button>
          </form>

          <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between text-xs text-slate-400 relative">
            <Link to="/" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回前台主页</span>
            </Link>
            <span className="font-mono">Security Level: High</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Full Authorized Admin Panel
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 🧭 Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-black text-md text-white">MicroNature</h1>
            <p className="text-[10px] font-mono text-emerald-500 tracking-wider">ADMIN PANEL v2.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'analytics' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>运营流量分析看板</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'users' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <UsersIcon className="w-4 h-4" />
            <span>系统注册用户管理</span>
          </button>

          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'content' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>全网业务数据中心</span>
          </button>
        </nav>

        {/* Admin Personal Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <img 
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
              alt="Admin avatar" 
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/25"
            />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{adminUser?.username || "管理员"}</p>
              <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/30 px-1.5 py-0.5 rounded-sm uppercase">ADMINISTRATOR</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link 
              to="/" 
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>前台主页</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all border border-red-900/20 cursor-pointer"
              title="登出安全连接"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 🖥️ Main Dashboard Workplace */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* ==========================================
            TAB 1: ANALYTICS & MONITORING
            ========================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-black text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-emerald-500" />
                <span>实时运营与流量分析看板</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">监控应用总体 API 响应性能、每日访问分布与网关遥测日志。</p>
            </div>

            {/* Quick Metrics Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group">
                <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">总访问量 (PV)</p>
                  <h3 className="text-3xl font-mono font-black text-white mt-1">{analyticsData?.totalPV || 0} 次</h3>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group">
                <div className="w-12 h-12 bg-teal-600/10 border border-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">独立访客 (UV)</p>
                  <h3 className="text-3xl font-mono font-black text-white mt-1">{analyticsData?.totalUV || 0} 人</h3>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group">
                <div className="w-12 h-12 bg-sky-600/10 border border-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">平均接口耗时</p>
                  <h3 className="text-3xl font-mono font-black text-white mt-1">{analyticsData?.avgLatency || 0} ms</h3>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">最近一周网关访问趋势图 (PV / UV)</h3>
              <div className="w-full h-80">
                {analyticsData?.dailyStats && analyticsData.dailyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '10px' }} />
                      <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="pv" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPv)" name="页面请求数 (PV)" />
                      <Area type="monotone" dataKey="uv" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUv)" name="独立访问数 (UV)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                    暂无图表遥测日志数据，触发前台刷新获取。
                  </div>
                )}
              </div>
            </div>

            {/* Popular API Endpoints */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">最热门接口路由排行榜 (TOP 5)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">请求类型</th>
                      <th className="px-6 py-3.5">接口路径</th>
                      <th className="px-6 py-3.5 text-right">调用频次</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {analyticsData?.popularEndpoints && analyticsData.popularEndpoints.length > 0 ? (
                      analyticsData.popularEndpoints.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4 font-mono font-bold">
                            <span className={`px-2 py-0.5 rounded-sm text-[10px] ${
                              item.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' :
                              item.method === 'POST' ? 'bg-blue-950 text-blue-400 border border-blue-900/40' :
                              item.method === 'DELETE' ? 'bg-red-950 text-red-400 border border-red-900/40' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {item.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono">{item.url}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-white">{item.count} 次</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                          暂无接口调用排行，系统静默采点中...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: REGISTERED USERS MANAGEMENT
            ========================================== */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-black text-white flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-emerald-500" />
                <span>系统注册用户账户管理</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">管理用户权限角色、个人勋章级别并执行强制注销等审计手段。</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">头像 & 用户名</th>
                      <th className="px-6 py-4">邮箱</th>
                      <th className="px-6 py-4">系统角色</th>
                      <th className="px-6 py-4">园艺级别</th>
                      <th className="px-6 py-4 text-center">审计操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {usersList.length > 0 ? (
                      usersList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img 
                              src={user.avatar} 
                              alt={user.username} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-bold text-white leading-tight">{user.username}</p>
                              <p className="text-[10px] font-mono text-slate-500">{user.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-400">{user.email || '未填'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              user.role === 'admin' 
                                ? 'bg-red-950 text-red-400 border border-red-900/30' 
                                : 'bg-slate-850 text-slate-400 border border-slate-800'
                            }`}>
                              {user.role === 'admin' ? '系统管理员' : '普通用户'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-200">
                              {user.exp === 'expert' ? '🏆 资深造景专家' : 
                               user.exp === 'intermediate' ? '☘️ 中级养护高手' : 
                               '🌱 萌新花卉入门者'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3.5">
                              {/* Toggle Role */}
                              <button 
                                onClick={() => handleToggleUserRole(user.id, user.role)}
                                disabled={user.id === adminUser?.id}
                                className="text-slate-400 hover:text-emerald-400 font-bold transition-colors disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                              >
                                {user.role === 'admin' ? '降级' : '提权'}
                              </button>
                              
                              {/* Delete User */}
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.id === adminUser?.id}
                                className="text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                                title="强制注销该账户"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          加载用户列表中...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: DATA CENTER CRUD
            ========================================== */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-black text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-500" />
                <span>全网业务数据中心</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">越权审核系统全部业务数据，包括绿植监护卡、待办计划以及日志。</p>
            </div>

            {/* Sub Tabs Selection */}
            <div className="flex border-b border-slate-800 gap-1.5 pb-2">
              <button 
                onClick={() => setContentSubTab('plants')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  contentSubTab === 'plants' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span>受监护植物 ({plantsList.length})</span>
              </button>
              
              <button 
                onClick={() => setContentSubTab('tasks')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  contentSubTab === 'tasks' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>日程养护待办 ({tasksList.length})</span>
              </button>
              
              <button 
                onClick={() => setContentSubTab('posts')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  contentSubTab === 'posts' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>社区发表动态 ({postsList.length})</span>
              </button>

              <button 
                onClick={() => setContentSubTab('encyclopedia')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  contentSubTab === 'encyclopedia' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>科普智慧百科 ({encyclopediaList.length})</span>
              </button>
            </div>

            {/* Content Table Body */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              
              {/* Plants Table Sub */}
              {contentSubTab === 'plants' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">缩图 & 植物名称</th>
                        <th className="px-6 py-4">学名科别</th>
                        <th className="px-6 py-4">归属所有者 (User ID)</th>
                        <th className="px-6 py-4">湿度与状态</th>
                        <th className="px-6 py-4 text-center">维护动作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {plantsList.length > 0 ? (
                        plantsList.map((plant) => (
                          <tr key={plant.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <img src={plant.thumbnail} alt={plant.name} className="w-10 h-7 rounded-sm object-cover border border-slate-700" />
                              <span className="font-bold text-white">{plant.name}</span>
                            </td>
                            <td className="px-6 py-4 italic text-slate-400">{plant.latinName}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{plant.userId || '默认公共'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                plant.status === 'optimal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-yellow-950 text-yellow-400 border border-yellow-900/30'
                              }`}>
                                {plant.soilStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => handleDeletePlant(plant.id)}
                                  className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                  title="强行剔除监护"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            暂无监护植物卡片
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tasks Table Sub */}
              {contentSubTab === 'tasks' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">待办指令</th>
                        <th className="px-6 py-4">目标绿植</th>
                        <th className="px-6 py-4">归属所有者 (User ID)</th>
                        <th className="px-6 py-4">状态</th>
                        <th className="px-6 py-4 text-center">状态翻转</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {tasksList.length > 0 ? (
                        tasksList.map((task) => (
                          <tr key={task.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4 font-bold text-white">{task.taskName}</td>
                            <td className="px-6 py-4 text-slate-400">{task.plantName}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{task.userId || '默认公共'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                task.done ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {task.done ? '已完成' : '挂起中'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => handleToggleTask(task.id)}
                                  className="text-slate-400 hover:text-emerald-400 font-bold transition-colors cursor-pointer"
                                >
                                  切换
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            暂无日程养护待办
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Posts Table Sub */}
              {contentSubTab === 'posts' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">内容预览</th>
                        <th className="px-6 py-4">作者角色</th>
                        <th className="px-6 py-4">圈子分类</th>
                        <th className="px-6 py-4 text-center">点赞/评论</th>
                        <th className="px-6 py-4 text-center">强制审核</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {postsList.length > 0 ? (
                        postsList.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-800/30">
                            <td className="px-6 py-4 max-w-sm truncate">
                              <div className="font-bold text-white">{post.title || '无标题发布'}</div>
                              <div className="text-slate-400 truncate text-[10px] mt-0.5">{post.content}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-white leading-tight">{post.author.name}</div>
                              <div className="text-[10px] text-slate-500 leading-tight">{post.author.role}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-850 px-2 py-1 rounded text-slate-300 border border-slate-800">
                                {post.tag}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center font-mono text-slate-350">
                              👍 {post.likes} / 💬 {post.comments?.length || post.commentsCount || 0}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                  title="下架删除内容"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            暂无社区发表动态
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Encyclopedia Table Sub */}
              {contentSubTab === 'encyclopedia' && (
                <div className="space-y-4">
                  <div className="px-6 py-4 flex justify-between items-center border-b border-slate-800 bg-slate-900/40">
                    <span className="text-xs text-slate-400">管理系统植物百科全书，数据实时渲染到普通用户的科普页。</span>
                    <button 
                      onClick={() => {
                        setEditingEp(null);
                        setEpName('');
                        setEpLatinName('');
                        setEpCategory('');
                        setEpLightRequirement('diffuse');
                        setEpToxicity('safe');
                        setEpDifficulty('easy');
                        setEpThumbnail('');
                        setEpWaterRequirement('');
                        setEpDescription('');
                        setEpCareSecrets('');
                        setIsAddEpOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>新增百科植物</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4">缩图 & 植物名称</th>
                          <th className="px-6 py-4">学名科别</th>
                          <th className="px-6 py-4">养护难度</th>
                          <th className="px-6 py-4">水分与光照规律</th>
                          <th className="px-6 py-4 text-center">管理操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {encyclopediaList.length > 0 ? (
                          encyclopediaList.map((ep) => (
                            <tr key={ep.id} className="hover:bg-slate-800/30">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img src={ep.thumbnail} alt={ep.name} className="w-10 h-7 rounded-sm object-cover border border-slate-700 animate-in fade-in" />
                                <span className="font-bold text-white">{ep.name}</span>
                              </td>
                              <td className="px-6 py-4 italic text-slate-400">
                                <div>{ep.latinName}</div>
                                <span className="text-[9px] bg-slate-850 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded-sm inline-block mt-1">{ep.category}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-semibold text-slate-200">
                                  {ep.difficulty === 'easy' ? '⭐ 简单' : ep.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 难'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-slate-400">
                                <div>💧 {ep.waterRequirement}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">☀️ {ep.lightRequirement === 'direct' ? '强向阳直射' : ep.lightRequirement === 'diffuse' ? '明亮散光' : '喜阴耐暗'}</div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEditEncyclopediaClick(ep)}
                                    className="text-slate-400 hover:text-emerald-450 transition-colors cursor-pointer"
                                    title="编辑植物信息"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteEncyclopedia(ep.id)}
                                    className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                    title="下架删除物种"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                              暂无百科植物，点击新增。
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* ==========================================
          MODAL: ADD ENCYCLOPEDIA PLANT
          ========================================== */}
      {isAddEpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs px-4 font-sans text-slate-100 animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-500" />
                <span>{editingEp ? '编辑科普百科植物' : '新增科普百科植物'}</span>
              </h3>
              <button 
                onClick={() => {
                  setIsAddEpOpen(false);
                  setEditingEp(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEncyclopediaSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">植物中文名称 *</label>
                  <input 
                    type="text" 
                    required 
                    value={epName} 
                    onChange={e => setEpName(e.target.value)}
                    placeholder="例如：琴叶榕" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">拉学名 *</label>
                  <input 
                    type="text" 
                    required 
                    value={epLatinName} 
                    onChange={e => setEpLatinName(e.target.value)}
                    placeholder="例如：Ficus lyrata" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">科别归类 *</label>
                  <input 
                    type="text" 
                    required 
                    list="categories-datalist"
                    value={epCategory} 
                    onChange={e => setEpCategory(e.target.value)}
                    placeholder="如：天南星科" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                  <datalist id="categories-datalist">
                    {Array.from(new Set(encyclopediaList.map(ep => ep.category).filter(Boolean))).map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">光度要求</label>
                  <select 
                    value={epLightRequirement} 
                    onChange={e => setEpLightRequirement(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-600"
                  >
                    <option value="direct">强向阳直射</option>
                    <option value="diffuse">明亮散射光</option>
                    <option value="low">喜阴耐暗</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">宠物毒性</label>
                  <select 
                    value={epToxicity} 
                    onChange={e => setEpToxicity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-600"
                  >
                    <option value="safe">宠物友好型</option>
                    <option value="toxic">家有萌宠禁区</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">栽培难度等级</label>
                  <select 
                    value={epDifficulty} 
                    onChange={e => setEpDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-600"
                  >
                    <option value="easy">新手推荐 (⭐)</option>
                    <option value="medium">中级挑战 (⭐⭐)</option>
                    <option value="hard">骨灰磨炼 (⭐⭐⭐)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">水分需求规律 *</label>
                  <input 
                    type="text" 
                    required 
                    value={epWaterRequirement} 
                    onChange={e => setEpWaterRequirement(e.target.value)}
                    placeholder="例如：见干见湿，避免积水" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Image Upload Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">植物缩略图 (直链或上传本地文件) *</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={epThumbnail} 
                    onChange={e => setEpThumbnail(e.target.value)}
                    placeholder="可直接输入 https://... 图片直链" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-650"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleEpImageUpload}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                    />
                    <button 
                      type="button"
                      disabled={epUploadLoading}
                      className="h-full px-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-center"
                    >
                      {epUploadLoading ? '上传中...' : '上传本地'}
                    </button>
                  </div>
                </div>
                {epThumbnail && (
                  <div className="mt-2 h-20 w-32 border border-slate-800 rounded-lg overflow-hidden">
                    <img src={epThumbnail} alt="Upload preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">植物历史履历与养护偏好详细描述 *</label>
                <textarea 
                  required 
                  value={epDescription} 
                  onChange={e => setEpDescription(e.target.value)}
                  placeholder="请输入植物原产地、空气蒸腾效率、土壤配水比例及光度调配等..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 h-20 text-white resize-none outline-none focus:border-emerald-600 focus:ring-1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">养护秘笈 (Care Secrets) *</label>
                <textarea 
                  required
                  value={epCareSecrets} 
                  onChange={e => setEpCareSecrets(e.target.value)}
                  placeholder="请输入关于本植物的独特养护要点、防雷避坑避水经验等秘笈..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 h-16 text-white resize-none outline-none focus:border-emerald-600 focus:ring-1"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white shadow-lg cursor-pointer transition-all uppercase tracking-wider text-[11px]"
              >
                {editingEp ? '保存修改' : '提交并录入百科库'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
