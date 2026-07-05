import React, { useState, useEffect } from 'react';
import { EncyclopediaPlant } from '../types';
import { Search, SlidersHorizontal, Eye, ShieldCheck, AlertOctagon, Heart, HelpCircle, Sparkles } from 'lucide-react';

export default function Encyclopedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedPlant, setSelectedPlant] = useState<EncyclopediaPlant | null>(null);
  
  const [encyclopediaPlants, setEncyclopediaPlants] = useState<EncyclopediaPlant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/encyclopedia')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEncyclopediaPlants(data);
        }
      })
      .catch(err => console.error('Failed to fetch encyclopedia:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(encyclopediaPlants.map(p => p.category).filter(Boolean)))];
  
  const filteredPlants = encyclopediaPlants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plant.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          plant.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    
    const matchesDifficulty = selectedDifficulty === 'all' || plant.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      {/* 🔍 Dynamic filter and search block */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-50 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 text-gray-450 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              placeholder="搜索植物中文俗称、世界拉丁科属或养护特征描述..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-650 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${selectedCategory === cat ? 'bg-emerald-900 text-white shadow-xs' : 'bg-gray-100 text-gray-500 hover:text-gray-800'}`}
              >
                {cat === 'all' ? '全部科属' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-semibold">养护难度：</span>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${selectedDifficulty === diff ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-white border hover:bg-gray-50'}`}
              >
                {diff === 'all' ? '全难度' : diff === 'easy' ? '新手必备 (⭐)' : diff === 'medium' ? '中级磨炼 (⭐⭐)' : '骨灰挑战 (⭐⭐⭐)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🪴 Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlants.map((plant) => (
          <div 
            key={plant.id} 
            className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-gray-50 overflow-hidden group">
                <img 
                  src={plant.thumbnail} 
                  alt={plant.name}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-550"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {plant.category}
                </span>

                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  plant.toxicity === 'safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-850'
                }`}>
                  {plant.toxicity === 'safe' ? <ShieldCheck className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                  <span>{plant.toxicity === 'safe' ? '宠物友好' : '谨防毒性'}</span>
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-md font-serif font-bold text-gray-950">{plant.name}</h3>
                  <span className="text-[10px] text-gray-400 font-semibold">{plant.difficulty === 'easy' ? '⭐ 简单' : plant.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 难'}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic font-mono truncate">{plant.latinName}</p>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{plant.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-20 py-1 rounded font-medium truncate max-w-[150px]">
                💧 {plant.waterRequirement}
              </span>
              <button 
                onClick={() => setSelectedPlant(plant)}
                className="p-1 px-3 text-xs bg-gray-100 hover:bg-emerald-950 hover:text-white rounded-lg text-emerald-950 font-bold transition-colors cursor-pointer"
              >
                查看详说
              </button>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border text-gray-400 text-sm">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin mx-auto mb-3"></div>
            正在同步地球绿植百科数据中...
          </div>
        ) : filteredPlants.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border text-gray-400 text-sm">
            未检索到该关键词植物科别。请重试或前往 [智能植物医馆] 咨询AI百科！
          </div>
        )}
      </div>

      {/* 🖼️ Plant Detail Modal Overlay */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-in fade-in-50 duration-200">
            <div className="relative h-64 md:h-80">
              <img 
                src={selectedPlant.thumbnail} 
                alt={selectedPlant.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/45 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-5 inset-x-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {selectedPlant.category}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    selectedPlant.toxicity === 'safe' ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {selectedPlant.toxicity === 'safe' ? '宠物友好型' : '警惕：家宠不友好'}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold">{selectedPlant.name}</h3>
                <p className="text-xs text-gray-200 italic font-mono">{selectedPlant.latinName}</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#fafaf6] rounded-xl p-3 border border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">养护要求</div>
                  <div className="text-xs text-emerald-990 font-bold">
                    {selectedPlant.difficulty === 'easy' ? '⭐⭐⭐ 极其简单' : selectedPlant.difficulty === 'medium' ? '⭐⭐ 中等学问' : '⭐ 极考技术'}
                  </div>
                </div>

                <div className="bg-[#fafaf6] rounded-xl p-3 border border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">光度偏好</div>
                  <div className="text-xs text-emerald-990 font-bold">
                    {selectedPlant.lightRequirement === 'direct' ? '强向阳直射' : selectedPlant.lightRequirement === 'diffuse' ? '明亮散光' : '喜阴耐暗型'}
                  </div>
                </div>

                <div className="bg-[#fafaf6] rounded-xl p-3 border border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">水分规律</div>
                  <div className="text-xs text-emerald-990 font-bold">{selectedPlant.waterRequirement}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>植物履历与生态效力</span>
                  </h4>
                  <p className="text-sm dark:text-gray-800 leading-relaxed font-sans">{selectedPlant.description}</p>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100/75 text-emerald-900 text-xs flex gap-2.5">
                  <span className="material-symbols-outlined text-emerald-700 font-bold mt-0.5">help_center</span>
                  <div>
                    <strong>养护秘笈：</strong>
                    {selectedPlant.careSecrets || '暂无详细养护秘笈。'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedPlant(null)}
                  className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
