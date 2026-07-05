import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Award, CheckCircle2, Image, Sparkles, BellRing, Heart, Edit3 } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  exp: 'beginner' | 'intermediate' | 'expert';
  notify: boolean;
  bio: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBm7Jqsmi4-Pjxc_bnVemoEJXUfo1VGtYFKLkngzebR4kqoNegz4TuzHsX7_aruJtuDLt6HJ3a2dHC8Y_YJ4OF2NpKmQp8QyxomnlftsdsA9Lih3kVY-6CzCPHWLjT7zzY76DZf9MUd0h7tC3MyZxbe_OG38ccKHYZlyy_w1s-FORkU3Njccck8nVzhaLSGbNA0lU9A473bRvLmu_dfgYjRAvUkKXsTIdZlvF06WqNsZa0QN_q84Ne9LSvVy4BlTAYukNltsgOkWQ", // Expert
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
];

export default function UserProfileModal({ isOpen, onClose, profile, onSave }: UserProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [tab, setTab] = useState<'basic' | 'preference'>('basic');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [isUrlInputActive, setIsUrlInputActive] = useState(false);

  // Sync state if initial prop changes
  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1800);
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarInput.trim()) {
      setFormData(prev => ({ ...prev, avatar: customAvatarInput.trim() }));
      setIsUrlInputActive(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-emerald-990/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-emerald-50 max-h-[90vh] overflow-y-auto z-10 flex flex-col md:flex-row"
            id="user-profile-center-modal"
          >
            
            {/* 🏷️ Left Passport Card Section: Interactive ID card mockup */}
            <div className="md:w-5/12 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 p-6 md:p-8 text-white flex flex-col justify-between border-r border-emerald-800/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-800/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-12 -left-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-1.5 opacity-80">
                  <span className="material-symbols-outlined text-emerald-450 text-xl animate-pulse">spa</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-250">MicroNature VIP PASS</span>
                </div>

                <div className="space-y-4">
                  <div className="relative group w-28 h-28 mx-auto md:mx-0">
                    <img 
                      src={formData.avatar} 
                      alt="Avatar Preview" 
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-lg"
                      referrerPolicy="referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white">
                      <span>已选头像</span>
                    </div>
                  </div>

                  <div className="text-center md:text-left space-y-1">
                    <span className="bg-emerald-800/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      {formData.role}
                    </span>
                    <h3 className="text-xl font-serif font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-1.5">
                      <span>{formData.name || '我的绿洲主理人'}</span>
                      <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-emerald-200/80 font-mono italic truncate">{formData.email}</p>
                  </div>
                </div>

                <div className="border-t border-emerald-500/15 pt-4 space-y-3.5 text-xs text-emerald-205">
                  <div className="space-y-1">
                    <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase block">主理人誓言 (Bio)</span>
                    <p className="leading-relaxed opacity-95 text-emerald-100 font-sans italic min-h-[40px]">
                      "{formData.bio || '尚未编写您的首选宣言...'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                    <div className="bg-emerald-800/30 rounded-xl p-2 border border-emerald-800/40">
                      <span className="text-[8px] text-emerald-400 block pb-0.5">园艺资质</span>
                      <span className="font-bold text-white text-[11px]">
                        {formData.exp === 'beginner' ? '☘️ 新绿入行' : formData.exp === 'intermediate' ? '🌿 绿意浸润' : '🦖 骨灰宗师'}
                      </span>
                    </div>
                    <div className="bg-emerald-800/30 rounded-xl p-2 border border-emerald-800/40">
                      <span className="text-[8px] text-emerald-400 block pb-0.5">智能预警状态</span>
                      <span className="font-bold text-white text-[11px]">
                        {formData.notify ? '🔔 实时开启' : '🔕 局部静音'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-[9px] text-emerald-400/80 font-mono uppercase tracking-wider text-center md:text-left border-t border-emerald-500/15 mt-6 md:mt-0">
                <span>MEMBERSHIP ID: MN-2026-884812</span>
              </div>
            </div>

            {/* 📝 Right Panels: Forms and inputs */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
              
              {/* Header inside right column */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-neutral-100">绿植主理人个人中心</h3>
                  <p className="text-xs text-neutral-400">修改您的主理权限、偏好设置和微生态账户头衔</p>
                </div>
                
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-neutral-100 dark:border-neutral-850 gap-2 font-semibold">
                <button
                  onClick={() => setTab('basic')}
                  className={`pb-2.5 text-xs px-3 border-b-2 transition-all cursor-pointer ${
                    tab === 'basic' 
                      ? 'border-emerald-800 text-emerald-950 font-bold' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  基本背景信息
                </button>
                <button
                  onClick={() => setTab('preference')}
                  className={`pb-2.5 text-xs px-3 border-b-2 transition-all cursor-pointer ${
                    tab === 'preference' 
                      ? 'border-emerald-800 text-emerald-950 font-bold' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  智能预警与偏好
                </button>
              </div>

              {/* Form implementation */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
                
                {tab === 'basic' ? (
                  <div className="space-y-4 text-xs">
                    
                    {/* CURATED AVATARS ROW */}
                    <div className="space-y-2">
                      <label className="text-neutral-500 font-bold flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-emerald-700" />
                        <span>快捷选择微观头像</span>
                      </label>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {PRESET_AVATARS.map((pAvatar, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, avatar: pAvatar }));
                              setIsUrlInputActive(false);
                            }}
                            className={`w-11 h-11 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                              formData.avatar === pAvatar ? 'border-emerald-800 ring-2 ring-emerald-100' : 'border-neutral-200 hover:scale-105'
                            }`}
                          >
                            <img src={pAvatar} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => setIsUrlInputActive(!isUrlInputActive)}
                          className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                            isUrlInputActive ? 'bg-emerald-900 border-emerald-900 text-white' : 'bg-neutral-50 hover:bg-neutral-100'
                          }`}
                        >
                          {isUrlInputActive ? '收起 URL' : '+ 自定义URL'}
                        </button>
                      </div>

                      {isUrlInputActive && (
                        <div className="p-3 bg-neutral-50 border rounded-xl flex gap-2 items-center text-[10px] animate-in slide-in-from-top-2 duration-150">
                          <input
                            type="text"
                            placeholder="输入头像的 https 图片直链地址..."
                            value={customAvatarInput}
                            onChange={(e) => setCustomAvatarInput(e.target.value)}
                            className="flex-1 bg-white border border-neutral-200 rounded-lg p-2 outline-none text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomAvatar}
                            className="px-3 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg font-bold shrink-0"
                          >
                            应用
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-700" />
                          <span>主理人昵称 (Nickname)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                          placeholder="请输入您的绿植昵称..."
                          className="w-full bg-[#fafaf7] focus:bg-white border focus:border-emerald-650 transition-colors rounded-xl p-2.5 outline-none font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-700" />
                          <span>绑定的电子邮箱 (Email)</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-[#fafaf7] focus:bg-white border focus:border-emerald-650 transition-colors rounded-xl p-2.5 outline-none font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>专长头衔 (Title/Role)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))}
                          placeholder="例如：高级绿植造景师、多肉骨灰盆友"
                          className="w-full bg-[#fafaf7] focus:bg-white border focus:border-emerald-650 transition-colors rounded-xl p-2.5 outline-none font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold block flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>园艺等级 (Level)</span>
                        </label>
                        <select
                          value={formData.exp}
                          onChange={(e) => setFormData(p => ({ ...p, exp: e.target.value as any }))}
                          className="w-full bg-[#fafaf7] focus:bg-white border focus:border-emerald-650 transition-colors rounded-xl p-2.5 outline-none font-medium"
                        >
                          <option value="beginner">☘️ 新绿入行 (0-1年养花经验)</option>
                          <option value="intermediate">🌿 绿意浸润 (1-3年栽培进阶)</option>
                          <option value="expert">🦖 骨灰宗师 (3年以上智能极客)</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold block flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-700" />
                        <span>绿植日志签名 (Bio Statement)</span>
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                        placeholder="简单写一句您对绿洲的宣言，会在发布日记或求助帖时同步浮现哦..."
                        className="w-full bg-[#fafaf7] focus:bg-white border focus:border-emerald-650 transition-colors rounded-xl p-2.5 h-20 outline-none font-medium resize-none leading-relaxed"
                      />
                    </div>

                  </div>
                ) : (
                  <div className="space-y-5 text-xs">
                    
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                      <BellRing className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-emerald-950 text-xs">微生态智能预警推送</h4>
                        <p className="text-[10px] text-emerald-800 leading-relaxed">
                          MicroNature 底层物联网探针在检测到室内多肉含水量 &lt;15% 或明亮照度 &gt;95% 时，将智能亮起橙色小灯，并在这里触发柔光动画。您可以通过该开关一键对其进行配置。
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl cursor-pointer border hover:border-emerald-200 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.notify}
                          onChange={(e) => setFormData(p => ({ ...p, notify: e.target.checked }))}
                          className="w-4 h-4 accents-emerald-800 rounded"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">开启枯黄焦枯 AI 弹窗报警</p>
                          <span className="text-[10px] text-neutral-400 block pt-0.5">当探针传感器监测到连续48小时没有光合散照时，发出智能提醒。</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl cursor-pointer border hover:border-emerald-200 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="w-4 h-4 accents-emerald-800 rounded"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">社区收到求助评论时推送给我</p>
                          <span className="text-[10px] text-neutral-400 block pt-0.5">有花友对您的发黄求助提出配土改良对策时，立即在「绿植微生社区」栏亮起消息红点。</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl cursor-pointer border hover:border-emerald-200 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="w-4 h-4 accents-emerald-800 rounded"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">同步加入太行山风沙障低碳守护计划</p>
                          <span className="text-[10px] text-neutral-400 block pt-0.5">允许平台将您的日常配水浇水、底肥填埋等日志，按 0.1M² 太行山防风沙障进行低碳折算并上榜表彰。</span>
                        </div>
                      </label>
                    </div>

                  </div>
                )}

                {/* Submits and toasts */}
                <div className="space-y-3 pt-4 border-t border-neutral-150">
                  <AnimatePresence>
                    {showSuccessToast && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-emerald-50 text-emerald-990 border border-emerald-200 py-3 px-4 rounded-xl flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[3]" />
                        <span className="font-sans font-semibold">主理人专属资料已安全写入本地缓存，社区名片已即时重塑！</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end gap-2.5 font-bold select-none text-[11px]">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer text-neutral-600"
                    >
                      取消修改
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      保存并更新账户
                    </button>
                  </div>
                </div>

              </form>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
