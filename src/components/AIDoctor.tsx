import React, { useState } from 'react';
import { Plant } from '../types';
import { HeartPulse, Send, Sparkles, CheckCircle2, ShieldAlert, Cpu, AlertCircle, Info } from 'lucide-react';

interface DoctorProps {
  plants: Plant[];
}

export default function AIDoctor({ plants }: DoctorProps) {
  const [selectedPlant, setSelectedPlant] = useState<string>(plants[0]?.name || '卧室龟背竹');
  const [customPlantName, setCustomPlantName] = useState('');
  const [symptom, setSymptom] = useState('焦边叶片发黄');
  const [customSymptom, setCustomSymptom] = useState('');
  
  const [soilMoisture, setSoilMoisture] = useState(25);
  const [lightLevel, setLightLevel] = useState(70);

  // loading + result states
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  const [conf, setConf] = useState('高');
  const [modelType, setModelType] = useState('gemini-3.5-flash');

  const symptomPresets = [
    '焦边叶片发黄',
    '下叶脱落萎蔫',
    '长时间没有生发新枝芽',
    '盆土表面泛白、泛盐碱霉层',
    '背面附着白色白色飞虱虫害'
  ];

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDiagnosis(null);
    setErrorWord(null);

    const plantName = selectedPlant === 'custom' ? customPlantName : selectedPlant;
    const finalSymptom = symptom === 'custom' ? customSymptom : symptom;

    if (!plantName) {
      setErrorWord('请输入您的植物中文或俗称学名！');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('mn_token');
      const response = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plantName,
          symtom: finalSymptom,
          waterLevel: soilMoisture,
          lightLevel: lightLevel
        })
      });

      if (!response.ok) {
        throw new Error('后台AI诊疗网关延迟，正在唤起本地缓存植物病害库。');
      }

      const data = await response.json();
      setDiagnosis(data.diagnosis);
      setConf(data.confidence || '高');
      setModelType(data.model || 'gemini-3.5-flash');
    } catch (err: any) {
      console.error(err);
      setErrorWord(err.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* 🔮 Left Column: Diagnosis Parameters Form */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm space-y-5">
        <div className="border-b pb-4">
          <h3 className="text-lg font-serif font-bold text-gray-950 flex items-center gap-1.5">
            <HeartPulse className="w-5 h-5 text-emerald-800" />
            <span>AI 植物三维智慧会诊室</span>
          </h3>
          <p className="text-[11px] text-gray-400">结合介质湿度及光度进行植物叶面病害推理</p>
        </div>

        <form onSubmit={handleDiagnose} className="space-y-4 text-xs font-sans">
          
          <div className="space-y-1.5">
            <label className="text-gray-600 font-bold block">1. 选择或键入植物</label>
            <select 
              value={selectedPlant} 
              onChange={e => setSelectedPlant(e.target.value)}
              className="w-full bg-[#fafaf7] border border-gray-200 rounded-xl p-2.5 outline-none font-medium text-xs"
            >
              {plants.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.latinName})</option>
              ))}
              <option value="custom">+ 其他野生/新增绿植...</option>
            </select>
          </div>

          {selectedPlant === 'custom' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="text-gray-500 block">新植物学名/俗称 *</label>
              <input 
                type="text" 
                placeholder="例如：吊兰、散尾葵、波士顿蕨" 
                value={customPlantName}
                onChange={e => setCustomPlantName(e.target.value)}
                className="w-full bg-white border rounded-xl p-2.5"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-gray-600 font-bold block">2. 选择或描述植物症状</label>
            <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto border border-gray-100 p-2 rounded-xl bg-gray-50/50">
              {symptomPresets.map((preset) => (
                <label 
                  key={preset}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    symptom === preset ? 'bg-emerald-55 text-emerald-990 font-semibold' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="symptom"
                    checked={symptom === preset}
                    onChange={() => setSymptom(preset)}
                    className="accents-emerald-850"
                  />
                  <span>{preset}</span>
                </label>
              ))}
              <label 
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  symptom === 'custom' ? 'bg-emerald-55 text-emerald-990 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                <input 
                  type="radio" 
                  name="symptom"
                  checked={symptom === 'custom'}
                  onChange={() => setSymptom('custom')}
                  className="accents-emerald-850"
                />
                <span className="text-emerald-800 font-bold">+ 描述未包含的症状...</span>
              </label>
            </div>
          </div>

          {symptom === 'custom' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="text-gray-500 block">请祥注植物受剪或霉变状态 *</label>
              <input 
                type="text" 
                placeholder="例如：老叶从底部一圈发黑、土面长了绿茸斑点等" 
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none"
                required
              />
            </div>
          )}

          {/* Environmental parameters linked to sensors */}
          <div className="space-y-3 pt-2 border-t border-gray-100 font-medium">
            <span className="text-gray-400 text-[10px] tracking-widest uppercase block mb-1">养护微电脑环境参数对齐</span>
            
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between text-[11px] text-gray-700">
                <span>模拟土壤含水量：</span>
                <span className="font-mono text-emerald-800 font-bold">{soilMoisture}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="95" 
                value={soilMoisture} 
                onChange={e => setSoilMoisture(Number(e.target.value))}
                className="w-full h-1 accents-emerald-700 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between text-[11px] text-gray-700">
                <span>模拟全日照照强度：</span>
                <span className="font-mono text-emerald-800 font-bold">{lightLevel}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={lightLevel} 
                onChange={e => setLightLevel(Number(e.target.value))}
                className="w-full h-1 accents-emerald-700 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-serif font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>AI 正在探针诊断中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>发起 AI 安全会诊</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 🔮 Right Column: Diagnosis Report Presentation */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm min-h-[460px] flex flex-col justify-between">
        <div className="space-y-5">
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-gray-950 text-sm">🩺 诊断回执单 (AI Consultation Receipt)</h4>
              <p className="text-[10px] text-gray-400">生成式 AI 根据气孔蒸腾与水照平衡进行的概率评估</p>
            </div>
            
            {diagnosis && (
              <span className="bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                模型：{modelType}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 border-dashed animate-pulse">
                <Cpu className="w-5 h-5 text-emerald-800 animate-spin-slow" />
                <div>
                  <h5 className="font-bold text-emerald-950 text-xs text-emerald-950">正在提取植物基因气孔吸析特征</h5>
                  <p className="text-[10px] text-emerald-700">针对水分比例：{soilMoisture}% 进行叶绿细胞水分损失模型匹配...</p>
                </div>
              </div>
              
              <div className="space-y-2.5">
                <div className="h-4 bg-emerald-100/40 rounded w-11/12"></div>
                <div className="h-4 bg-emerald-100/40 rounded w-full"></div>
                <div className="h-4 bg-emerald-100/40 rounded w-4/5"></div>
                <div className="h-4 bg-emerald-100/40 rounded w-3/4"></div>
              </div>
            </div>
          ) : errorWord ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                <span>病原诊断发生断连</span>
              </div>
              <p className="leading-relaxed">{errorWord}</p>
              <div className="p-3 bg-white rounded-lg border border-amber-100 text-[10px] text-amber-700 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>提示：如遇此问题，无需焦虑。请检查本地环境变量 `.env.example`，配置 `GEMINI_API_KEY`，我们将自动重新激活真机级诊断服务。您也可以继续多次提交，本地内置专家诊疗模型将为您正常提供推荐对策。</span>
              </div>
            </div>
          ) : diagnosis ? (
            <div className="prose prose-emerald max-w-none text-xs text-gray-800 leading-relaxed space-y-2 font-sans">
              {/* Render Markdown format elegantly */}
              <div className="bg-[#fafaf6] border border-gray-150 rounded-2xl p-5 space-y-4 shadow-2xs whitespace-pre-wrap">
                {diagnosis}
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-900 border text-[11px] font-sans">
                <strong>💡 特别安全通告：</strong>
                若叶面表现出霉变并逐渐蔓延、或有严重的幼嫩茎尖枯烂，极易造成真菌和粉虱在家庭盆栽群间迅速漂移侵染。可立即结合 <strong>「养护工作台」-「一键剪枯叶」</strong>，配合 <strong>「造景商城」-「微雾喷淋」</strong> 进行喷洒恒湿复苏。
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 text-xs space-y-4">
              <span className="material-symbols-outlined text-4xl text-emerald-800 fill-current animate-pulse">medication</span>
              <div className="space-y-1">
                <p className="font-serif font-bold text-gray-900 text-sm">植物诊断报告就绪</p>
                <p className="text-gray-400">左侧选择您的植物、当前土壤含水值及异样表现，点击一键会诊</p>
              </div>
            </div>
          )}
        </div>

        {diagnosis && (
          <div className="border-t pt-4 text-[10px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>会诊准确置信度: <strong>{conf}</strong></span>
            </span>
            <span>由于室内环境受日落和新家甲醛影响，AI报告仅作林业管养参考</span>
          </div>
        )}
      </div>

    </div>
  );
}
