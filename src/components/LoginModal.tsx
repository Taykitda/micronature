import React, { useState } from 'react';
import { ShieldCheck, Sprout, Mail, Lock, User, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLoginTab ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginTab ? { username, password } : { username, password, email };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '操作失败，请重试');
      }

      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md px-4 font-sans animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-emerald-900/10 p-8 space-y-6 overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-6 h-6 animate-bounce" />
          </div>
          <h2 className="text-2xl font-serif font-black text-emerald-950">
            {isLoginTab ? '欢迎回归自然' : '开启您的绿洲旅程'}
          </h2>
          <p className="text-xs text-gray-400">MicroNature 室内生态管家系统</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 pb-1 font-bold text-sm">
          <button 
            onClick={() => { setIsLoginTab(true); setError(''); }}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer ${
              isLoginTab ? 'text-emerald-850 border-b-2 border-emerald-850' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            账户登录
          </button>
          <button 
            onClick={() => { setIsLoginTab(false); setError(''); }}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer ${
              !isLoginTab ? 'text-emerald-850 border-b-2 border-emerald-850' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            注册新账号
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-in slide-in-from-top-1 duration-200">
            <span className="material-symbols-outlined text-md text-red-650 shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900/70 tracking-wider">用户名 / 昵称</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名" 
                className="w-full bg-gray-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:border-emerald-850 focus:ring-1 focus:ring-emerald-850 transition-all text-gray-850"
              />
            </div>
          </div>

          {!isLoginTab && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-900/70 tracking-wider">电子邮箱</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱" 
                  className="w-full bg-gray-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:border-emerald-850 focus:ring-1 focus:ring-emerald-850 transition-all text-gray-850"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900/70 tracking-wider">安全密码</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码" 
                className="w-full bg-gray-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:border-emerald-850 focus:ring-1 focus:ring-emerald-850 transition-all text-gray-850"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 disabled:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/10 cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? '加载中...' : isLoginTab ? '开启绿洲管理' : '立即注册并登录'}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-neutral-100 pt-4 flex items-center justify-between text-xs text-gray-400">
          <button 
            onClick={onClose}
            className="hover:text-emerald-850 font-bold transition-colors cursor-pointer"
          >
            暂不登录，先看看
          </button>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono">SSL 256位加密</span>
          </div>
        </div>
      </div>
    </div>
  );
}
