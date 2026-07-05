import React, { useState } from 'react';
import { BRAND_IMAGES } from '../data';
import { Play, Sparkles, Award, ShieldAlert, GraduationCap, ArrowRight, HeartPulse } from 'lucide-react';

interface ExploreProps {
  onNavigateToCare: () => void;
  onNavigateToDoctor: () => void;
}

export default function Explore({ onNavigateToCare, onNavigateToDoctor }: ExploreProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'toxins' | 'efficiency'>('toxins');
  const [toxicLevel, setToxicLevel] = useState(78); // Benzene filtration simulation

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const lessons = [
    { id: 'l1', title: '室内微生态系统的土壤基质选择', duration: '12分钟' },
    { id: 'l2', title: '琴叶榕、龟背竹等雨林植物的水肥循环', duration: '18分钟' },
    { id: 'l3', title: '侘寂苔玉网（Kokedama）的艺术造型技巧', duration: '15分钟' },
  ];

  const handleToggleLesson = (id: string) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter(l => l !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  return (
    <div className="space-y-10">
      {/* 🌲 Nature Hero Hero */}
      <section className="relative rounded-3xl overflow-hidden h-[460px] flex items-center shadow-xl">
        <img 
          src={BRAND_IMAGES.heroBg} 
          alt="MicroNature Interior Oasis" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl pl-8 md:pl-16 pr-6 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>智能绿色生活，源于自然缩影</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-emerald-50 leading-[1.25]">
            寻找属于你的<br />
            <span className="text-emerald-300 underline underline-offset-8 decoration-emerald-400">室内空气净化绿洲</span>
          </h1>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed font-sans max-w-lg">
            缩影自然 (MicroNature) 融合智能物联网、现代造景艺术与AI诊断技术，帮您在快节奏都市中打造科学、唯美且低维护的掌上雨林。
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={onNavigateToCare}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-medium text-sm shadow-md shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
            >
              <span>管理我的绿植</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onNavigateToDoctor}
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 transition-all text-white font-medium text-sm backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <HeartPulse className="w-4 h-4 text-emerald-300" />
              <span>智能绿植会诊</span>
            </button>
          </div>
        </div>
      </section>

      {/* 🔬 NASA Clean Air Study Interactive Feature */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-50 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2.5 py-1 rounded">
              <Award className="w-3.5 h-3.5" />
              <span>NASA 空气洁净研究认证数据 (Clean Air Study)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-emerald-950 font-semibold">
              高出普通盆栽 <span className="text-emerald-600">50倍</span> 的空气滤净率
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl">
              特定天南星科与天门冬科植物，其气孔和根际共生菌能够高效代谢室内甲醛、苯及三氯乙烯。
            </p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('toxins')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${activeTab === 'toxins' ? 'bg-white text-emerald-900' : 'text-gray-500 hover:text-gray-800'}`}
            >
              有害气体吸收率
            </button>
            <button 
              onClick={() => setActiveTab('efficiency')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${activeTab === 'efficiency' ? 'bg-white text-emerald-900' : 'text-gray-500 hover:text-gray-800'}`}
            >
              光合增氧倍率表
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#fafaf6] rounded-xl p-6 border border-gray-100">
          <div className="lg:col-span-5 space-y-4">
            <img 
              src={BRAND_IMAGES.nasaBanner} 
              alt="NASA Study Illustration" 
              className="rounded-lg w-full h-44 object-cover border border-gray-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100/60 text-emerald-900 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-700 mt-0.5" data-icon="filter_vintage">filter_vintage</span>
              <span><strong>智能绿植微生态推荐：</strong>在起居室放置 1-2 盆高度达 1.2M 的虎尾兰或金钱树，辅以微雨恒湿气流，可有效替换 85% 以上沉降性重金属气溶胶粒子。</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'toxins' ? (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-emerald-900 tracking-wider uppercase block">气孔活性模拟：拖动滑块查看相对湿度对毒物净化的影响</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>环境空气湿度：<strong className="text-emerald-700 font-mono text-sm">{toxicLevel}%</strong></span>
                    <span>蒸腾净化流速率系数: <strong className="text-emerald-700 font-mono text-sm">{(toxicLevel * 1.45).toFixed(1)} mg/h</strong></span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="95" 
                    value={toxicLevel} 
                    onChange={(e) => setToxicLevel(Number(e.target.value))}
                    className="w-full accents-emerald-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-700 flex items-center gap-1.5">苯 (Benzene) 滤降速度</span>
                      <span className="text-emerald-700 font-mono font-bold">{(toxicLevel * 0.9).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${toxicLevel * 0.9}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-700 flex items-center gap-1.5">甲醛 (Formaldehyde) 降解率</span>
                      <span className="text-rose-600 font-mono font-bold">{(Math.min(99, toxicLevel * 1.1)).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${Math.min(99, toxicLevel * 1.1)}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-700 flex items-center gap-1.5">三氯乙烯气态降质物</span>
                      <span className="text-blue-600 font-mono font-bold">{(toxicLevel * 0.65).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${toxicLevel * 0.65}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-emerald-900 tracking-wider uppercase block">全天候氧气及环境离子释放效率曲线</span>
                <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-4 shadow-2xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="text-emerald-800 text-lg font-bold font-mono">+124%</div>
                      <div className="text-[10px] text-gray-500">光合供氧提速</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-blue-800 text-lg font-bold font-mono">15.4K/cm³</div>
                      <div className="text-[10px] text-gray-500">负氧离子浓度</div>
                    </div>
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <div className="text-violet-800 text-lg font-bold font-mono">24h</div>
                      <div className="text-[10px] text-gray-500">全时段循环耗氧比</div>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed text-gray-500">
                    得益于特殊的生物学特性，仙人掌类与多肉植物采用景天酸代谢（CAM）机制。它们在夜间吸收二氧化碳，不仅不与人争氧，反而在暗光睡眠中持续净化卧室微气候。
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🎓 Masterclass Expert Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-emerald-50 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>造景名师讲堂</span>
            </span>
            <h3 className="text-2xl font-serif font-semibold text-emerald-950">
              室内造景艺术与绿植管养实操
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              我们邀请了国际著名造景艺术家、华中农大客座教授 李博士 亲手录制微缩盆景观养微课，解答造景布局到日常救活等全链条问题。
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-md group">
            <img 
              src={BRAND_IMAGES.masterclassThumb} 
              alt="Masterclass video cover" 
              className="w-full h-56 object-cover transform scale-100 group-hover:scale-102 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {isPlaying ? (
              <div className="absolute inset-0 bg-emerald-950/95 flex flex-col justify-center items-center p-6 text-center text-emerald-100 space-y-4">
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-1 text-xs cursor-pointer"
                >
                  ✕ 关闭预览
                </button>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                <div>
                  <h4 className="font-semibold text-white">李博士造景课程正在加载</h4>
                  <p className="text-xs text-emerald-300 mt-1">智能造景骨架搭建与青龙石错落层次实演课程</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-all text-white flex items-center justify-center shadow-lg hover:scale-110 cursor-pointer"
                >
                  <Play className="fill-current w-5 h-5 ml-1" />
                </button>
              </div>
            )}
            
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 p-3 text-white flex justify-between items-center text-xs">
              <span>主讲：李维华 博士</span>
              <span>12,492 人已订购学习</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#fafaf7] rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-4">
            <img 
              src={BRAND_IMAGES.expertAvatar} 
              alt="Dr. Li Avatar" 
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-serif font-semibold text-emerald-950">李维华 博士</h4>
              <p className="text-xs text-emerald-700 font-medium">自然美学造景家 • 缩影自然首席学术官</p>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-semibold text-gray-500 tracking-wider uppercase">章节小测验与实操打卡</h5>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => handleToggleLesson(lesson.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${completedLessons.includes(lesson.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      {completedLessons.includes(lesson.id) ? 'check_circle' : 'circle'}
                    </span>
                    <span className="font-medium">{lesson.title}</span>
                  </div>
                  <span className="text-gray-400 font-mono text-[10px] shrink-0 ml-2">{lesson.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-950 text-white rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-300">本季通关进度</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round((completedLessons.length / lessons.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-emerald-900/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-500" 
                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-emerald-200/80 pt-0.5">
              完成全部打卡课程即赠造景入门材料大礼包（赤玉土500g + 专用剪刀）
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
