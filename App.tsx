
import React, { useState, useRef } from 'react';
import { analyzeBiologyContent } from './services/geminiService';
import { AnalysisResult, AnalysisMode } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.GENERAL);
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [showImpact, setShowImpact] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !text) {
      setError("يرجى إضافة صورة أو نص للتحليل");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeBiologyContent(image || undefined, text, mode);
      setResult(data);
    } catch (err) {
      setError("حدث خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const content = `درس: ${result.lessonTitle}\n\nالشرح: ${result.explanation}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ModeButton = ({ targetMode, label, icon }: { targetMode: AnalysisMode, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => setMode(targetMode)}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
        mode === targetMode 
        ? 'bg-gradient-to-l from-sky-600 to-teal-600 text-white shadow-lg shadow-sky-100 border-transparent scale-[1.03]'
        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full sticky top-0 z-40 glass-card border-b border-white/50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-[30px] mt-2">
        <div className="flex items-center gap-4">
          <div className="w-44 md:w-56">
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/darib-logo.png" 
              alt="Darib AI" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowImpact(true)}
            className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md"
          >
            <span>✨</span> أثر دَرْب
          </button>
          <div className="bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/160px-Flag_of_Jordan.svg.png" className="h-4 rounded-sm border border-slate-100" alt="Jordan" />
             <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">المنهاج الأردني</span>
          </div>
        </div>
      </nav>

      {/* Main Hero Header */}
      <header className="w-full max-w-4xl text-center px-4 mt-16 mb-16 space-y-6">
        <div className="inline-block animate-float">
           <span className="bg-teal-50 text-teal-700 text-xs font-black px-4 py-1.5 rounded-full border border-teal-100 uppercase tracking-widest shadow-sm">
              مساعدك الذكي للتفوق
           </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          ارتقِ بتعليمك مع <span className="bg-gradient-to-l from-sky-600 to-teal-500 bg-clip-text text-transparent">دَرْب AI</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          منصة تعليمية مبتكرة تحول مادتك الدراسية إلى تجربة تفاعلية ذكية تناسب تطلعاتك.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-[22px] border border-slate-200 shadow-inner">
             <button 
                onClick={() => setActiveTab('student')} 
                className={`px-12 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'student' ? 'bg-white text-sky-700 shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
              >
                ركن الطالب
             </button>
             <button 
                onClick={() => setActiveTab('teacher')} 
                className={`px-12 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'teacher' ? 'bg-white text-sky-700 shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
              >
                ركن المعلم
             </button>
          </div>
        </div>
      </header>

      {/* Main Application Layout */}
      <main className="w-full max-w-7xl px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
        
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white sticky top-28">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">⚙️</span>
              إعدادات المحتوى
            </h3>

            {/* Image Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group border-2 border-dashed rounded-[32px] p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${image ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-400'}`}
            >
              {image ? (
                <div className="relative w-full flex justify-center">
                   <img src={image} className="h-40 object-contain rounded-2xl shadow-xl border-4 border-white" alt="Source" />
                   <button 
                    onClick={(e) => { e.stopPropagation(); setImage(null); }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors border border-slate-100"
                   >✕</button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-4 opacity-40 group-hover:opacity-100 transition-opacity">📷</div>
                  <span className="text-slate-900 text-lg font-black block">ارفق صورة المادة</span>
                  <p className="text-slate-400 text-sm mt-1">دفتر، كتاب، أو ملخص</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Note Area */}
            <div className="mt-8">
              <textarea 
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder="أضف ملاحظات إضافية أو عنوان الدرس..."
                className="w-full h-28 p-5 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-sky-100 transition-all resize-none font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* Tool Selection */}
            <div className="mt-8">
              <span className="block text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] text-center">اختر المخرجات الذكية</span>
              <div className="grid grid-cols-2 gap-3">
                {activeTab === 'student' ? (
                  <>
                    <ModeButton targetMode={AnalysisMode.GENERAL} label="تحليل كامل" icon="🔬" />
                    <ModeButton targetMode={AnalysisMode.SUMMARY} label="ملخص ذكي" icon="⚡" />
                    <ModeButton targetMode={AnalysisMode.MIND_MAP} label="خريطة ذهنية" icon="🧠" />
                    <ModeButton targetMode={AnalysisMode.PRESENTATION} label="عرض تقديمي" icon="📊" />
                  </>
                ) : (
                  <>
                    <ModeButton targetMode={AnalysisMode.TEACHER_PLAN} label="خطة الدرس" icon="📋" />
                    <ModeButton targetMode={AnalysisMode.WORKSHEET} label="ورقة عمل" icon="✍️" />
                    <ModeButton targetMode={AnalysisMode.INFOGRAPHIC} label="تخطيط بصري" icon="🎨" />
                    <ModeButton targetMode={AnalysisMode.VIDEO} label="سكريبت" icon="🎬" />
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleAnalyze} 
              disabled={loading} 
              className={`w-full mt-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl flex items-center justify-center gap-3 ${
                activeTab === 'student' ? 'bg-gradient-to-l from-sky-600 to-sky-700 text-white shadow-sky-100' : 'bg-gradient-to-l from-teal-600 to-teal-700 text-white shadow-teal-100'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحليل الذكي...</span>
                </>
              ) : "توليد المحتوى الآن"}
            </button>
            {error && <p className="mt-4 text-red-500 text-center font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="glass-card rounded-[40px] overflow-hidden border border-white animate-in slide-in-from-bottom-6 duration-500">
              {/* Output Header */}
              <div className={`p-10 text-white relative overflow-hidden ${activeTab === 'student' ? 'bg-gradient-to-br from-sky-700 to-blue-900' : 'bg-gradient-to-br from-teal-700 to-emerald-900'}`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/20 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest backdrop-blur-md border border-white/20">دَرْب AI - ذكاء تعليمي</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight">{result.lessonTitle}</h2>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={copyToClipboard} 
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-black flex items-center gap-2 shadow-xl"
                    >
                      {copied ? "✅ تم الحفظ" : "📤 مشاركة المحتوى"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Content Body */}
              <div className="p-8 md:p-12 space-y-12">
                
                {/* Specific Section for Teacher/Student unique fields */}
                {result.teacherPlan && activeTab === 'teacher' && (
                  <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-3">
                       <span className="text-2xl">📝</span> خطة الدرس النموذجية
                    </h4>
                    <div className="text-slate-600 whitespace-pre-line leading-relaxed text-lg font-medium">{result.teacherPlan}</div>
                  </section>
                )}

                {/* Main Explanation Section */}
                <section>
                  <h4 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-sky-500 rounded-full"></span>
                    الشرح المفصل
                  </h4>
                  <div className="text-slate-600 leading-[2] text-lg font-medium whitespace-pre-line bg-white p-6 rounded-3xl border border-slate-50 shadow-sm">{result.explanation}</div>
                </section>
                
                {/* Visual Data / Map */}
                {result.mindMap && (
                  <section className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-900/20 to-transparent"></div>
                    <h4 className="font-black text-sky-400 mb-6 text-2xl flex items-center gap-3 relative z-10">🧠 الهيكل المفاهيمي</h4>
                    <div className="text-slate-300 text-lg whitespace-pre-line font-mono bg-white/5 p-8 rounded-3xl border border-white/10 relative z-10 leading-relaxed shadow-inner">
                      {result.mindMap}
                    </div>
                  </section>
                )}
                
                {/* Exam Focus / Ministerial Tip */}
                <section className="bg-gradient-to-br from-orange-500 to-red-600 p-8 md:p-10 rounded-[40px] text-white shadow-2xl shadow-orange-100 relative overflow-hidden group">
                  <div className="absolute -right-16 -bottom-16 opacity-10 text-[200px] font-black text-white pointer-events-none group-hover:scale-110 transition-transform duration-700">🇯🇴</div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="bg-white text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl border-b-4 border-orange-200">!</div>
                    <h4 className="font-black text-white text-2xl tracking-tight">زاوية التوجيهي (هام جداً)</h4>
                  </div>
                  <p className="text-white font-bold text-xl md:text-2xl leading-relaxed relative z-10 drop-shadow-md">
                    {result.ministerialTip}
                  </p>
                </section>
              </div>
            </div>
          ) : (
            /* Empty State Container */
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center glass-card rounded-[60px] p-16 space-y-10 group">
              <div className="relative">
                 <div className="absolute inset-0 bg-sky-100 blur-[50px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                 <div className="w-48 h-48 bg-white rounded-[50px] flex items-center justify-center border border-slate-100 shadow-xl relative z-10 transform group-hover:rotate-3 transition-transform">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/600px-Flag_of_Jordan.svg.png" className="h-20 shadow-lg rounded-md" alt="JO Flag" />
                 </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">جاهزون للبدء؟</h3>
                <p className="text-slate-400 max-w-sm text-lg font-bold leading-relaxed mx-auto">
                  ارفع صورة مادتك العلمية وسيقوم مساعد دَرْب الذكي بتحليلها فوراً بأعلى دقة أكاديمية.
                </p>
              </div>

              <div className="flex gap-4 opacity-10 pt-4">
                {[1,2,3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-400"></div>)}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modern Footprint Footer */}
      <footer className="w-full bg-slate-950 py-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-900/10 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="text-right space-y-6">
             <div className="w-48 brightness-0 invert opacity-80">
               <img src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/darib-logo.png" alt="Darib Logo" />
             </div>
             <p className="text-slate-500 font-bold max-w-md leading-relaxed text-lg italic">
               "نحو بيئة تعليمية أردنية ذكية، تُمكّن الطالب وتدعم المعلم."
             </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
             <div className="flex gap-3">
               {['#ذكاء_اصطناعي', '#توجيهي_2026', '#تعليم_مبتكر'].map(tag => (
                 <span key={tag} className="text-[10px] px-4 py-1.5 bg-white/5 rounded-full text-teal-400 font-black border border-white/5 tracking-wider">
                   {tag}
                 </span>
               ))}
             </div>
             <p className="text-white/80 font-black text-lg">جميع الحقوق محفوظة لمنصة دَرْب @ 2026</p>
             <div className="text-slate-600 font-bold text-xs uppercase tracking-[0.2em] border-t border-white/5 pt-4">
               بإشراف مدرسة منشية حسبان الثانوية - وزارة التربية والتعليم
             </div>
          </div>
        </div>
      </footer>

      {/* Impact Modal Placeholder Content */}
      {showImpact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] max-w-2xl w-full p-10 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-sky-600 to-teal-600"></div>
              <button onClick={() => setShowImpact(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 transition-colors">✕ إغلاق</button>
              <div className="text-center space-y-6 pt-6">
                 <div className="w-20 h-20 bg-sky-50 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner border border-sky-100">🌍</div>
                 <h2 className="text-3xl font-black text-slate-900">رؤية دَرْب الاستراتيجية</h2>
                 <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    يهدف مشروع دَرْب إلى ردم الفجوة الرقمية في التعليم الأردني، من خلال توفير أدوات ذكاء اصطناعي وطنية تساهم في تحسين نواتج التعلم وتخفيف العبء عن كاهل المعلمين والطلبة.
                 </p>
                 <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-right">
                       <span className="block text-2xl mb-2">💰</span>
                       <span className="block font-black text-slate-900">وفر اقتصادي</span>
                       <span className="text-xs text-slate-400">تقليل الحاجة للدروس الخصوصية</span>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-right">
                       <span className="block text-2xl mb-2">📈</span>
                       <span className="block font-black text-slate-900">تميز أكاديمي</span>
                       <span className="text-xs text-slate-400">تحسين مستويات التحصيل العلمي</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
