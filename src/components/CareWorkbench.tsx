import React, { useState } from 'react';
import { Plant, CareTask } from '../types';
import { Check, Plus, Droplet, Sun, PenSquare, Trash2, ShieldAlert, Sparkles, CheckCircle, Flame, RefreshCw } from 'lucide-react';

interface CareProps {
  plants: Plant[];
  tasks: CareTask[];
  onWaterPlant: (plantId: string) => void;
  onFertilizePlant: (plantId: string) => void;
  onAddCustomPlant: (newPlant: Omit<Plant, 'id' | 'status'>) => void;
  onDeletePlant: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<CareTask, 'id' | 'done'>) => void;
}

export default function CareWorkbench({
  plants,
  tasks,
  onWaterPlant,
  onFertilizePlant,
  onAddCustomPlant,
  onDeletePlant,
  onToggleTask,
  onAddTask,
}: CareProps) {
  // Add Plant Modal state
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantLatin, setNewPlantLatin] = useState('');
  const [newPlantCat, setNewPlantCat] = useState('天南星科');
  const [newPlantMoisture, setNewPlantMoisture] = useState(40);
  const [newPlantLight, setNewPlantLight] = useState(60);

  // Add Task Input state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTargetPlant, setNewTaskTargetPlant] = useState(plants[0]?.name || '');
  const [newTaskCat, setNewTaskCat] = useState<'watering' | 'fertilizer' | 'light' | 'pruning'>('watering');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Local interactive fine-tuning values for slider testing
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);

  // Handle addition
  const handleCreatePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlantName) return;
    onAddCustomPlant({
      name: newPlantName,
      latinName: newPlantLatin || "Ficus unknown",
      category: newPlantCat,
      soilMoisture: newPlantMoisture,
      soilStatus: `${newPlantMoisture}% (${newPlantMoisture < 35 ? '过低' : newPlantMoisture > 80 ? '过湿' : '适宜'})`,
      lightLevel: newPlantLight,
      lightStatus: `${newPlantLight > 75 ? '强日光' : '适度温和'}`,
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1xk4joGCgBpBnmLq_2CJk5HXAdss4GFF3S7HUjNRtQ5PfIbE8216bcshOxjN7ufgX8aarLPHSdW6z1VV6estC6lEgmdAlHw5UcUUbD5en5rNes8vRc4g6TTpDUNu2Xkyb1Qpi-EWxpUd3nXFfyLTdxEstlMS6hj4nl679k1caenGmaBJVgb6VWYf8Mp4AvsP_RRPOWhL0LOqcH4pF5nliBvumxF3IkGRb68i2ZPc233bFQlmucU7whDFOywv0cm4aavdT4ZOKA"
    });
    setNewPlantName('');
    setNewPlantLatin('');
    setShowAddPlant(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const target = plants.find(p => p.name === newTaskTargetPlant) || plants[0];
    onAddTask({
      plantId: target?.id || 'manual',
      taskName: newTaskTitle,
      plantName: newTaskTargetPlant || target?.name || '大厅植物',
      category: newTaskCat,
      description: newTaskDesc || '用户自定义养护提醒',
      thumbnail: target?.thumbnail || "https://lh3.googleusercontent.com/aida-public/AB6AXuCpCDKbRu7y_lb_rCmHRcCqPCVZ42h_Myd4DgZofxyUcn4C35oPzn94R1mw_cwABcIes87MqwxwsI588dKo045D3rhMaammxn5C05VBaZVfSnRdoN6z1B5ggZ__QtQmL_gqlkkH0TL_yCmHJOHFLvDm0n8NNNGJ39f1-CXi9W_HMq7HzFT0lgA4qJMSlzBZU29spGuO8CgIP74UwtlaPL_z6pO3ebwMfdun_84RZ4NBGJ3ohRdd7RIyZaaS83crcthPswwUEJwq6g"
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTask(false);
  };

  const finishedTasksCount = tasks.filter(t => t.done).length;
  const taskSuccessRatio = tasks.length > 0 ? Math.round((finishedTasksCount / tasks.length) * 100) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* 📋 Left Column: Today's Tasks */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-emerald-50 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-950">今日养护待办</h3>
            <p className="text-[11px] text-gray-400">水肥周期与定时提醒看板</p>
          </div>
          <button 
            onClick={() => setShowAddTask(!showAddTask)}
            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Task Completion Banner */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-100/60 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-950 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />
              <span>今日养护进度</span>
            </span>
            <span className="font-mono text-emerald-800 font-bold">{finishedTasksCount} / {tasks.length}已完成</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500" 
              style={{ width: `${taskSuccessRatio}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-emerald-800 font-medium">
            {taskSuccessRatio === 100 ? "🎉 今日全部完成！绿植微环境处于最佳水平" : "💡 处理下方已逾期卡片，拯救植物脱水萎蔫值"}
          </p>
        </div>

        {/* Add custom care task popup form */}
        {showAddTask && (
          <form onSubmit={handleCreateTask} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs space-y-3">
            <h4 className="font-bold text-gray-900 border-b pb-1.5">⏰ 添加人工养护警报</h4>
            
            <div className="space-y-1">
              <label className="text-gray-500 block">养护名称</label>
              <input 
                type="text" 
                placeholder="例如：琴叶榕修叶散光" 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-gray-500 block">对应植物</label>
                <select 
                  value={newTaskTargetPlant} 
                  onChange={e => setNewTaskTargetPlant(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs"
                >
                  {plants.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 block">日程分类</label>
                <select 
                  value={newTaskCat} 
                  onChange={e => setNewTaskCat(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs"
                >
                  <option value="watering">💧 快速浇水</option>
                  <option value="fertilizer">🧪 追速肥力</option>
                  <option value="light">☀️ 日照调节</option>
                  <option value="pruning">✂️ 枯叶修剪</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500 block">状态详注</label>
              <input 
                type="text" 
                placeholder="例如：需少量、避开叶片中间" 
                value={newTaskDesc} 
                onChange={e => setNewTaskDesc(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex gap-2 pt-1 font-semibold">
              <button 
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded p-1.5 transition-colors cursor-pointer text-center"
              >
                添加待办
              </button>
              <button 
                type="button"
                onClick={() => setShowAddTask(false)}
                className="bg-gray-200 hover:bg-gray-300 rounded px-2.5 py-1.5 transition-colors cursor-pointer text-gray-700"
              >
                取消
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              无任何待办，新建一个任务呵护绿植吧！
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${task.done ? 'bg-gray-50/60 border-gray-100 opacity-60' : 'bg-white border-gray-150 hover:shadow-2xs'}`}
              >
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer mt-0.5 ${task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 hover:border-emerald-600'}`}
                >
                  {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-900 truncate">{task.taskName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      task.category === 'watering' ? 'bg-blue-50 text-blue-600' :
                      task.category === 'fertilizer' ? 'bg-orange-50 text-orange-600' :
                      task.category === 'light' ? 'bg-yellow-50 text-yellow-600' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {task.category === 'watering' ? '浇水' :
                       task.category === 'fertilizer' ? '底肥' :
                       task.category === 'light' ? '散光' : '叶剪'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">{task.plantName} • {task.description}</p>
                </div>

                <img 
                  src={task.thumbnail} 
                  alt={task.plantName} 
                  className="w-10 h-10 rounded-lg object-cover border shrink-0 scale-95"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🌲 Right Column: My Plants Interactive Telemetry */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-emerald-50 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-950">智能物联养护工作台 (Caretaker Workspace)</h3>
            <p className="text-xs text-gray-400">管理植物实时传感模拟，手动复苏，配置警报限额</p>
          </div>

          <button 
            onClick={() => setShowAddPlant(!showAddPlant)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加植物守护</span>
          </button>
        </div>

        {/* Add custom plant form popup */}
        {showAddPlant && (
          <form onSubmit={handleCreatePlant} className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 text-xs space-y-4">
            <h4 className="font-serif font-bold text-md text-emerald-950">🆕 新增植物空气守护卡片</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-emerald-900 font-semibold block">植物俗称 *</label>
                <input 
                  type="text" 
                  placeholder="如：阳台金钱树" 
                  value={newPlantName} 
                  onChange={e => setNewPlantName(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-emerald-900 font-semibold block">学名 (拉丁名)</label>
                <input 
                  type="text" 
                  placeholder="如：Zamioculcas" 
                  value={newPlantLatin} 
                  onChange={e => setNewPlantLatin(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-emerald-900 font-semibold block">植物科别</label>
                <select 
                  value={newPlantCat} 
                  onChange={e => setNewPlantCat(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-lg p-2.5 h-10"
                >
                  <option value="天南星科">天南星科</option>
                  <option value="桑科">桑科（榕属）</option>
                  <option value="天门冬科">天门冬科</option>
                  <option value="马齿苋科">马齿苋科</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 bg-white p-3 rounded-xl border border-emerald-100">
                <div className="flex justify-between font-semibold text-emerald-950">
                  <span>预设土壤湿度：</span>
                  <span className="font-mono text-emerald-600">{newPlantMoisture}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="95" 
                  value={newPlantMoisture} 
                  onChange={e => setNewPlantMoisture(Number(e.target.value))}
                  className="w-full h-1.5 accents-emerald-600 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-emerald-100">
                <div className="flex justify-between font-semibold text-emerald-950">
                  <span>预设光照强度：</span>
                  <span className="font-mono text-emerald-600">{newPlantLight}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={newPlantLight} 
                  onChange={e => setNewPlantLight(Number(e.target.value))}
                  className="w-full h-1.5 accents-emerald-600 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddPlant(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium cursor-pointer"
              >
                生成物联守护卡
              </button>
            </div>
          </form>
        )}

        {/* List of active plants with sensor telemetry simulator and direct actions */}
        <div className="space-y-6">
          {plants.map((plant) => (
            <div 
              key={plant.id} 
              className={`p-5 rounded-2xl border transition-all relative ${
                plant.soilMoisture < 30 ? 'border-orange-200 bg-orange-50/15' : 'border-gray-150 bg-white'
              }`}
            >
              {plant.soilMoisture < 30 && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-100 text-orange-850 px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse">
                  <ShieldAlert className="w-3 h-3 text-orange-700" />
                  <span>极度缺水萎蔫风险</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-150">
                  <img 
                    src={plant.thumbnail} 
                    alt={plant.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-serif font-bold text-gray-950">{plant.name}</h4>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold">{plant.category}</span>
                      </div>
                      <p className="text-xs text-gray-400 italic font-mono">{plant.latinName}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onWaterPlant(plant.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="瞬时对该卡片增加 40% 水分"
                      >
                        <Droplet className="w-3.5 h-3.5" />
                        <span>一键浇水</span>
                      </button>
                      
                      <button 
                        onClick={() => onFertilizePlant(plant.id)}
                        className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="施用速效微量肥料颗粒"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin-slow" />
                        <span>速效施肥</span>
                      </button>

                      <button 
                        onClick={() => onDeletePlant(plant.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="移除此物联监测"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sensor sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 土壤水分 */}
                    <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-blue-500" />
                          <span>介质水分活度</span>
                        </span>
                        <span className={`font-mono font-bold ${plant.soilMoisture < 30 ? 'text-orange-650' : 'text-blue-700'}`}>
                          {plant.soilMoisture}% ({plant.soilMoisture < 30 ? '干燥警戒' : plant.soilMoisture > 75 ? '过湿饱和' : '健康适宜'})
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${plant.soilMoisture < 30 ? 'bg-orange-500' : 'bg-blue-500'}`}
                          style={{ width: `${plant.soilMoisture}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 周围光度 */}
                    <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-yellow-500" />
                          <span>顶红外光传感器</span>
                        </span>
                        <span className="text-emerald-800 font-mono font-bold">
                          {plant.lightLevel}% ({plant.lightLevel < 35 ? '阴暗遮蔽' : plant.lightLevel > 80 ? '强直射光' : '温带散光'})
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-300"
                          style={{ width: `${plant.lightLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
