import React, { useState } from 'react';
import { LandscapingMaterial, InspirationItem } from '../types';
import { LANDSCAPING_MATERIALS, INSPIRATIONS, BRAND_IMAGES } from '../data';
import { ShoppingCart, Tag, Check, Award, Compass, RefreshCw, Sparkles, ShoppingBag } from 'lucide-react';

interface CartItem extends LandscapingMaterial {
  quantity: number;
}

export default function LandscapingDesign() {
  const [styleFilter, setStyleFilter] = useState<'rainforest' | 'bonsai' | 'succulent'>('rainforest');
  
  // Shopping state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g. 0.2 means 20%
  const [orders, setOrders] = useState<{ id: string; date: string; sum: number; itemsCount: number }[]>([]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const styleInformation = {
    rainforest: {
      title: "原生中南美热带雨林中层景观 (Rainforest Vivarium)",
      intro: "重现亚马逊河上游明亮、恒湿的下层地貌。通过轻质火山石搭建错落阶梯，种植苔藓与积水凤梨，形成自闭合的小气候水分循环系统。",
      difficulty: "高级造景 • 推荐恒湿自动喷淋",
      image: BRAND_IMAGES.rainforestHero
    },
    bonsai: {
      title: "侘寂禅意泥舍微盆景 (Wabi-Sabi Zen Bonsai)",
      intro: "利用天然赤玉土与山野迎客盆松，搭配几枚天然青龙石，注重空间留白与不对称平衡修剪。能让您的玄关或茶席瞬间多一抹深山寂静。",
      difficulty: "中级修剪 • 推荐见干见湿",
      image: BRAND_IMAGES.bonsaiHero
    },
    succulent: {
      title: "北美温带隔屏多肉排沙 (Bohemian Cactus Desert Bed)",
      intro: "利用棱角鲜明的硬煤与红泥赤玉土结合。点缀大团多肉植物、雪地球属及斑砂。极易维护，夜间进行景天酸呼吸代谢，可摆置于床头空气层。",
      difficulty: "初级入门 • 喜干燥不畏暴晒",
      image: BRAND_IMAGES.succulentHero
    }
  };

  const handleAddToCart = (material: LandscapingMaterial) => {
    const existing = cart.find(item => item.id === material.id);
    if (existing) {
      setCart(cart.map(item => item.id === material.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...material, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleApplyCoupon = () => {
    if (discountCode.trim().toUpperCase() === 'GREEN2026') {
      setAppliedDiscount(0.2); // 20% discount
    } else {
      alert('优惠码格式无效！提示：试用优惠码「GREEN2026」享受 8 折优惠。');
    }
  };

  const currentStyle = styleInformation[styleFilter];

  const subTotal = cart.reduce((count, item) => count + (item.price * item.quantity), 0);
  const discountAmount = subTotal * appliedDiscount;
  const finalTotal = subTotal - discountAmount;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: `MN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleTimeString(),
      sum: finalTotal,
      itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCheckoutSuccess(true);
    setTimeout(() => setIsCheckoutSuccess(false), 4500);
  };

  return (
    <div className="space-y-10">
      
      {/* 🧭 Master Landscaping Styles Layout */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-50 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>微盆景艺术与造物搭配</span>
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-emerald-950">大师造景流派推荐</h3>
            <p className="text-xs text-gray-400">选择您喜欢的生态地貌，从基质材料到活体生态圈一键配齐</p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto shrink-0 font-semibold gap-1">
            <button 
              onClick={() => setStyleFilter('rainforest')}
              className={`px-4 py-2 rounded-lg text-xs cursor-pointer transition-all ${styleFilter === 'rainforest' ? 'bg-emerald-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              🌿 热带雨林风
            </button>
            <button 
              onClick={() => setStyleFilter('bonsai')}
              className={`px-4 py-2 rounded-lg text-xs cursor-pointer transition-all ${styleFilter === 'bonsai' ? 'bg-emerald-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              🎋 侘寂微禅盆
            </button>
            <button 
              onClick={() => setStyleFilter('succulent')}
              className={`px-4 py-2 rounded-lg text-xs cursor-pointer transition-all ${styleFilter === 'succulent' ? 'bg-emerald-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              🌵 温带荒漠多肉
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden h-72 md:h-80 shadow-md">
            <img 
              src={currentStyle.image} 
              alt={currentStyle.title} 
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block bg-orange-100/80 text-orange-950 font-bold text-[10px] px-2.5 py-1 rounded-md">
              {currentStyle.difficulty}
            </span>
            <h4 className="text-lg md:text-xl font-serif font-semibold text-emerald-990 leading-snug">{currentStyle.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{currentStyle.intro}</p>
            
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-normal">
              <strong>🛠️ 推荐骨架工具：</strong> 日本特级赤玉土铺底 + 青龙石造景搭基 + 恒温高压微雾雨喷淋。可前往下方精品商城购买造物材料进行实体复刻。
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ Landscaping Mall & Cart Split System */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Shopping list grid */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-base font-serif font-bold text-gray-950">🌿 盆景与生态景致配套特许商城</h4>
            <p className="text-xs text-gray-400">甄选高保肥基砂层、骨架造景石材与气动控湿器械</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LANDSCAPING_MATERIALS.map((mat) => (
              <div 
                key={mat.id} 
                className="p-4 rounded-xl border border-gray-150 hover:border-emerald-350 transition-colors bg-white flex items-center gap-4 text-xs"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-150 bg-gray-50">
                  <img 
                    src={mat.image} 
                    alt={mat.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h5 className="font-bold text-gray-900 truncate">{mat.name}</h5>
                  <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-1">{mat.description}</p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-emerald-800 font-mono font-bold text-sm">¥{mat.price} <span className="text-[10px] text-gray-400 font-normal">/ {mat.unit}</span></span>
                    
                    <button 
                      onClick={() => handleAddToCart(mat)}
                      className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-white rounded font-bold text-[10px] transition-colors cursor-pointer"
                    >
                      + 加入车
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h5 className="text-xs font-bold text-gray-450 tracking-wider uppercase">🎨 绿意造景启迪图集及共生案例</h5>
            <div className="grid grid-cols-5 gap-3.5">
              {INSPIRATIONS.map((insp) => (
                <div key={insp.id} className="group relative rounded-lg overflow-hidden h-28 cursor-pointer">
                  <img 
                    src={insp.image} 
                    alt={insp.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                    <span className="text-[9px] font-bold line-clamp-1">{insp.title}</span>
                    <span className="text-[7px] text-gray-200">{insp.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🛒 Shopping Cart & Orders */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h4 className="font-serif font-bold text-gray-950 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-800" />
              <span>造景物料购物车</span>
            </h4>
            <span className="bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} 件
            </span>
          </div>

          {/* Success toast inside column */}
          {isCheckoutSuccess && (
            <div className="p-3.5 bg-emerald-50 text-emerald-905 rounded-xl border border-emerald-200 text-xs space-y-1 animate-pulse">
              <div className="flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                <span>订单支付成功 & 呼入排单！</span>
              </div>
              <p className="text-[10px] text-emerald-800 leading-normal">
                我们正在为您包装专业基土和青龙石，配备重型物流，配赠养护日历通关礼包。
              </p>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs space-y-1">
              <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 stroke-[1.5]" />
              <p>您的购物车还是空的</p>
              <p className="text-[10px] text-gray-355">去左侧选购赤玉土、喷雾设备吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#fafaf7] border border-gray-100">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">¥{item.price} × {item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold shrink-0 cursor-pointer"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="pt-2 border-t text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="输入绿券码(例: GREEN2026)" 
                    value={discountCode} 
                    onChange={e => setDiscountCode(e.target.value)}
                    className="flex-1 bg-gray-50 border p-1 rounded text-[10px] outline-none"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="p-1 px-2.5 bg-gray-150 hover:bg-emerald-950 hover:text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    充
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <span>✓ 已成功立享 8 折！优惠：</span>
                    <span className="font-mono text-emerald-700">-¥{discountAmount.toFixed(1)}</span>
                  </p>
                )}
              </div>

              {/* Summaries */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1.5 font-sans">
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>小计金额</span>
                  <span>¥{subTotal.toFixed(1)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>绿色优惠折扣</span>
                    <span>-¥{discountAmount.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t">
                  <span>实付支付</span>
                  <span className="font-mono text-emerald-850 text-sm">¥{finalTotal.toFixed(1)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-serif font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
              >
                马上结算配送
              </button>
            </div>
          )}

          {/* Checkout log simulations */}
          {orders.length > 0 && (
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">📝 本地配货记录 simulator</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {orders.map((o) => (
                  <div key={o.id} className="p-2 rounded bg-stone-50 border text-[10px] flex items-center justify-between text-stone-600">
                    <div>
                      <p className="font-bold text-gray-900">{o.id}</p>
                      <p className="text-gray-400">时间：{o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-800 font-mono">¥{o.sum.toFixed(1)}</p>
                      <p className="text-gray-400">{o.itemsCount}件物料</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
