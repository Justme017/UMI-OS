import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Link as LinkIcon, 
  ArrowUp, 
  Sparkles, 
  MoreHorizontal, 
  Play, 
  FileText, 
  CheckCircle,
  Lightbulb,
  Mail,
  ArrowRight,
  Grid,
  List,
  Calendar,
  X,
  Check,
  Share,
  Edit3,
  Trash,
  Volume2,
  Loader2,
  StopCircle,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UmiSphere } from '../components/UmiSphere';
import { GoogleGenAI, Modality } from "@google/genai";

// --- Types ---
type ViewMode = 'grid' | 'list' | 'calendar';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface MemoryItemData {
  id: string;
  title: string;
  type: 'AUDIO' | 'NOTE' | 'TASKS' | 'STRATEGY' | 'CRITICAL' | 'LINK' | 'COLLECTION';
  timestamp: string;
  content: string;
  tags: string[];
  icon: any;
  color: string;
  bgColor: string;
  progress?: number;
  tasks?: Task[];
  audioUrl?: string; // For the 'Play' button
  gradient?: string;
}

// --- Gemini Helper ---
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const Workspace = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [suggestionGrouped, setSuggestionGrouped] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Modal & Menu State
  const [selectedItem, setSelectedItem] = useState<MemoryItemData | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  
  // --- Data ---
  const [memoryItems, setMemoryItems] = useState<MemoryItemData[]>([
    {
      id: '1',
      title: 'Design Sprint Review',
      type: 'AUDIO',
      timestamp: '10:45 AM today',
      content: 'Discussion regarding the new accessibility palette. Action items assigned to Sarah for high-contrast testing. We also touched upon the spacing issues in the mobile view.',
      tags: ['AUDIO', 'UX'],
      icon: Mic,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      gradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
      id: '2',
      title: 'Product Roadmap Q3',
      type: 'NOTE',
      timestamp: '2 hours ago',
      content: 'Key deliverables include the user dashboard update and API integration. Needs review by engineering lead. The timeline is tight, so we might need to deprioritize the dark mode update for the admin panel.',
      tags: ['NOTE', 'PRODUCT'],
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      progress: 75,
      gradient: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    },
    {
      id: '3',
      title: 'Weekly Sync Items',
      type: 'TASKS',
      timestamp: 'Yesterday',
      content: 'Weekly sync meeting checklist.',
      tags: ['TASKS'],
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      tasks: [
        { id: 't1', text: 'Review KPIs', completed: true },
        { id: 't2', text: 'Update Jira board', completed: false },
        { id: 't3', text: 'Client email draft', completed: false },
      ],
      gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    },
    {
       id: '4',
       title: 'Ideation Session: Marketing',
       type: 'STRATEGY',
       timestamp: 'Tue, 2:30 PM',
       content: 'Captured 14 key insights regarding the new campaign launch. Focus on Gen Z demographics and TikTok integration.',
       tags: ['STRATEGY'],
       icon: Lightbulb,
       color: 'text-purple-500',
       bgColor: 'bg-purple-50 dark:bg-purple-900/10',
       gradient: 'bg-gradient-to-br from-purple-400 to-pink-500',
    },
    {
       id: '5',
       title: 'Resources for Project Alpha',
       type: 'LINK',
       timestamp: 'Wed, 10:00 AM',
       content: 'Collection of 5 links and 2 PDF documents regarding the new architecture.',
       tags: ['DOCS'],
       icon: LinkIcon,
       color: 'text-cyan-600',
       bgColor: 'bg-cyan-50 dark:bg-cyan-900/10',
       gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    },
    {
       id: '6',
       title: 'Client Feedback Summary',
       type: 'CRITICAL',
       timestamp: 'Mon, 9:15 AM',
       content: 'Synthesized from email thread "Re: UX Revision 2". The client loves the new header but hates the font choice.',
       tags: ['CRITICAL'],
       icon: Mail,
       color: 'text-rose-500',
       bgColor: 'bg-rose-50 dark:bg-rose-900/10',
       gradient: 'bg-gradient-to-br from-rose-400 to-red-500',
    }
  ]);

  // --- Actions ---
  const toggleTask = (itemId: string, taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    setMemoryItems(prevItems => prevItems.map(item => {
      if (item.id === itemId && item.tasks) {
        return {
          ...item,
          tasks: item.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return item;
    }));
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    
    // Simulate a "Think" delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        contents: inputText,
      });
      
      console.log('AI Response:', response.text);
      
      // Dynamic Item Creation Logic (Simulated for Demo)
      const newItem: MemoryItemData = {
        id: Date.now().toString(),
        title: inputText.length > 30 ? inputText.substring(0, 30) + '...' : inputText,
        type: 'NOTE',
        timestamp: 'Just now',
        content: response.text || "Generated content based on your request.",
        tags: ['AI GENERATED'],
        icon: Sparkles,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        gradient: 'bg-gradient-to-br from-indigo-400 to-violet-500',
      };
      
      // If user asked for tasks, create a task item
      if (inputText.toLowerCase().includes('task')) {
         newItem.type = 'TASKS';
         newItem.icon = CheckCircle;
         newItem.tasks = [
            { id: 'nt1', text: 'Analyze requirements', completed: false },
            { id: 'nt2', text: 'Draft initial concept', completed: false },
         ];
      }

      setMemoryItems(prev => [newItem, ...prev]);
      setInputText('');
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
       setIsRecording(true);
       
       // Simulate transcription delay
       setTimeout(async () => {
          setIsRecording(false);
          setInputText("Schedule a meeting with the design team for tomorrow at 10 AM.");
          stream.getTracks().forEach(track => track.stop());
       }, 2500);

    } catch (err) {
      console.error("Mic access denied", err);
      alert("Microphone access is required for transcription.");
    }
  };

  const handleTTS = async (text: string) => {
    if (isPlayingTTS) {
       window.speechSynthesis.cancel(); 
       setIsPlayingTTS(false);
       return;
    }

    setIsPlayingTTS(true);
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(
            Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => setIsPlayingTTS(false);
      } else {
        setIsPlayingTTS(false);
      }
    } catch (e) {
      console.error(e);
      setIsPlayingTTS(false);
    }
  };

  const handleSuggestionAction = () => {
    setSuggestionGrouped(true);
    
    // Add the new collection item
    const newCollection: MemoryItemData = {
        id: 'new-collection-1',
        title: 'Q3 Marketing',
        type: 'COLLECTION',
        timestamp: 'Just now',
        content: 'Collection of notes and assets for the Q3 Marketing push. Includes 3 previously unfiled items.',
        tags: ['COLLECTION', 'MARKETING'],
        icon: Folder,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-900/20',
        gradient: 'bg-gradient-to-br from-pink-400 to-rose-500',
    };

    setMemoryItems(prev => [newCollection, ...prev]);

    setTimeout(() => {
      setShowSuggestion(false);
    }, 1500);
  };

  const quickActions = ['Summarize today', 'Create tasks', "Find 'Project Alpha'"];

  // --- Components ---

  const Dropdown = ({ id }: { id: string }) => (
    <AnimatePresence>
      {menuOpenId === id && (
         <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-10 right-0 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-30 overflow-hidden"
         >
            <div className="flex flex-col py-1">
               <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 text-left">
                  <Edit3 size={14} /> Edit
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 text-left">
                  <Share size={14} /> Share
               </button>
               <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
               <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      setMemoryItems(prev => prev.filter(item => item.id !== id));
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
               >
                  <Trash size={14} /> Delete
               </button>
            </div>
         </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden" onClick={() => setMenuOpenId(null)}>
      
      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white dark:bg-[#151b28] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85vh] border border-white/10"
              >
                {/* Header Image or Gradient */}
                <div className={`h-32 w-full ${selectedItem.gradient || 'bg-gradient-to-r from-indigo-500 to-purple-500'} relative`}>
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md">
                    <X size={20} />
                  </button>
                  <div className="absolute -bottom-8 left-8">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border-4 border-white dark:border-[#151b28]">
                        <selectedItem.icon size={32} className={selectedItem.color} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 px-8 pb-8 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-tight">{selectedItem.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedItem.bgColor} ${selectedItem.color}`}>{selectedItem.type}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500">{selectedItem.timestamp}</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleTTS(selectedItem.content)}
                            className={`p-2 border rounded-xl transition-colors text-slate-500 ${isPlayingTTS ? 'bg-primary/10 border-primary text-primary animate-pulse' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            title="Read Aloud"
                         >
                            {isPlayingTTS ? <StopCircle size={18} /> : <Volume2 size={18} />}
                         </button>
                         <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-500">
                            <Share size={18} />
                         </button>
                         <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-slate-500">
                            <Edit3 size={18} />
                         </button>
                      </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                      <p className="whitespace-pre-wrap">{selectedItem.content}</p>
                  </div>

                  {selectedItem.tasks && (
                    <div className="mt-6 space-y-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-2">Checklist</h4>
                      {selectedItem.tasks.map((task) => (
                        <div 
                          key={task.id} 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={(e) => toggleTask(selectedItem.id, task.id, e)}
                        >
                           <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'}`}>
                              {task.completed && <Check size={14} className="text-white" />}
                           </div>
                           <span className={`text-sm transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{task.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedItem.type === 'AUDIO' && (
                     <div className="mt-6 bg-slate-100 dark:bg-white/5 rounded-xl p-4 flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-white dark:bg-primary text-primary dark:text-white shadow-sm flex items-center justify-center">
                           <Play size={18} fill="currentColor" />
                        </button>
                        <div className="flex-1">
                           <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full w-full overflow-hidden">
                              <div className="h-full bg-primary w-1/3"></div>
                           </div>
                           <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                              <span>04:12</span>
                              <span>12:45</span>
                           </div>
                        </div>
                     </div>
                  )}

                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Left Panel - Sphere & Input */}
      <div className="w-full md:w-[480px] bg-white/40 dark:bg-[#0A0E17]/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 flex flex-col relative z-10 shrink-0 transition-all">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-40 pointer-events-none"></div>
        
        {/* Sphere Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
          <UmiSphere onClick={handleMicClick} isRecording={isRecording} />
          
          <div className="mt-12 text-center space-y-4 z-10 relative">
            <h2 className="text-slate-900 dark:text-white font-display font-medium text-2xl tracking-tight">Good afternoon, Josh.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[300px] mx-auto leading-relaxed font-light">
              I've synced 4 new contexts. Your <span className="text-primary font-medium cursor-pointer hover:underline decoration-primary/30">Design Sprint</span> notes are ready for review.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="p-8 pb-10 relative z-20">
           <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-image-linear-to-r">
             {quickActions.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => setInputText(action)}
                  className="shrink-0 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 hover:border-primary/50 hover:text-primary transition-all shadow-sm hover:-translate-y-0.5"
                >
                  {action}
                </button>
             ))}
           </div>
           
           <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-focus-within:opacity-20 transition duration-700 blur-lg"></div>
             <div className="relative bg-white dark:bg-[#151b28] rounded-[1.5rem] shadow-xl shadow-indigo-900/5 ring-1 ring-black/5 dark:ring-white/10 transition-all group-focus-within:translate-y-[-2px] group-focus-within:shadow-2xl">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="w-full bg-transparent border-0 rounded-t-[1.5rem] px-6 py-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-0 resize-none h-24 text-base leading-relaxed font-light outline-none" 
                  placeholder="Ask UMI to remember, analyze, or create..."
                ></textarea>
                <div className="flex justify-between items-center px-4 pb-4">
                   <div className="flex gap-1 pl-2">
                      <button 
                        onClick={handleMicClick}
                        className={`p-2.5 transition-all rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                      >
                        <Mic size={20} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-primary transition-all rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                        <LinkIcon size={20} />
                      </button>
                   </div>
                   <button 
                     onClick={handleSend}
                     disabled={!inputText.trim() && !isSending}
                     className={`bg-primary hover:bg-primary-hover text-white rounded-xl py-2 px-6 flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${isSending ? 'pl-4 pr-4' : ''}`}
                   >
                      {isSending ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="text-sm font-medium">Thinking</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Send</span>
                          <ArrowUp size={16} />
                        </>
                      )}
                   </button>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Main Stream */}
      <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] via-[#F1F5F9] to-[#E2E8F0] dark:from-[#050505] dark:via-[#0B0F19] dark:to-[#111827] flex flex-col relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

         <header className="px-10 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 shrink-0">
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tighter">Memory Workspace</h2>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live Sync</span>
                 </div>
                 <span className="text-slate-500 dark:text-slate-400 text-sm">Updated just now</span>
              </div>
            </div>
            
            <div className="flex bg-white/80 dark:bg-white/5 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-primary shadow-sm scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-primary shadow-sm scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('calendar')} 
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'calendar' ? 'bg-white dark:bg-white/10 text-primary shadow-sm scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Calendar View"
                >
                  <Calendar size={18} />
                </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto px-10 pb-20 no-scrollbar relative">
            
            {/* Smart Suggestion */}
            <AnimatePresence>
            {showSuggestion && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#1E1B4B]/30 border border-indigo-100 dark:border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-center gap-5 relative group shadow-sm hover:shadow-md transition-all">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-primary shadow-sm shrink-0 border border-indigo-100 dark:border-indigo-500/30">
                      <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div className="flex-1 z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-indigo-300">Smart Suggestion</h4>
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">AI Context Analysis</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-light">
                        {suggestionGrouped 
                          ? "Great! I've created the collection 'Q3 Marketing' and moved 3 items." 
                          : <span>I noticed you have 3 unfiled notes related to <strong className="font-semibold text-slate-900 dark:text-white">"Q3 Marketing"</strong>. Should I group them into a collection?</span>}
                      </p>
                  </div>
                  <div className="flex items-center gap-3 z-10">
                      {!suggestionGrouped ? (
                        <>
                          <button onClick={() => setShowSuggestion(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 transition-colors">Dismiss</button>
                          <button onClick={handleSuggestionAction} className="text-xs font-bold uppercase tracking-wide bg-primary text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all">Group Items</button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500 font-medium px-4">
                          <CheckCircle size={18} />
                          <span className="text-sm">Done</span>
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Grid View Content */}
            {viewMode === 'grid' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
              >
                 {memoryItems.slice(0, 3).map((item) => (
                    <motion.div 
                       key={item.id}
                       whileHover={{ y: -5 }}
                       onClick={() => setSelectedItem(item)}
                       className="glass-card rounded-[2rem] p-7 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full relative overflow-hidden group"
                    >
                        <div className="flex items-start justify-between mb-6 relative z-10">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.color} group-hover:rotate-6 transition-transform`}>
                                 <item.icon size={24} />
                              </div>
                              <div>
                                 <span className={`block text-[11px] font-bold ${item.color.replace('text', 'text-slate-600 dark:text')} tracking-wider uppercase`}>{item.type}</span>
                                 <span className="text-xs text-slate-500">{item.timestamp}</span>
                              </div>
                           </div>
                           <div className="relative">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === item.id ? null : item.id); }}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
                              >
                                <MoreHorizontal size={20} />
                              </button>
                              <Dropdown id={item.id} />
                           </div>
                        </div>
                        <h3 className="font-display font-semibold text-2xl mb-3 text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                        
                        {item.type === 'TASKS' ? (
                           <div className="space-y-3 mt-2 flex-1">
                              {item.tasks?.map((task) => (
                                 <div 
                                    key={task.id} 
                                    className="flex items-center gap-3 group/item hover:bg-slate-50 dark:hover:bg-white/5 p-1 -ml-1 rounded-lg transition-colors"
                                    onClick={(e) => toggleTask(item.id, task.id, e)}
                                 >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent'}`}>
                                       {task.completed && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className={`text-sm transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.text}</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-light line-clamp-3">
                              {item.content}
                           </p>
                        )}

                        <div className="mt-auto">
                           {item.progress !== undefined ? (
                              <div>
                                 <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                    <span>Progress</span>
                                    <span>{item.progress}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div style={{ width: `${item.progress}%` }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                 </div>
                              </div>
                           ) : (
                              <div className="flex items-center gap-2">
                                 {item.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">{tag}</span>
                                 ))}
                              </div>
                           )}
                        </div>
                        
                        {item.type === 'AUDIO' && (
                           <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100">
                              <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl">
                                 <Play size={20} fill="currentColor" />
                              </div>
                           </div>
                        )}
                    </motion.div>
                 ))}
              </motion.div>
            )}

            {/* List View Content */}
            {viewMode === 'list' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-12">
                  {memoryItems.map((item) => (
                    <motion.div 
                       key={item.id}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       onClick={() => setSelectedItem(item)}
                       className="bg-white/60 dark:bg-surface-glassDark backdrop-blur-sm p-4 rounded-2xl border border-white/60 dark:border-white/5 hover:border-primary/30 hover:shadow-lg transition-all flex items-center gap-5 group cursor-pointer"
                    >
                       <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.color} shadow-sm border border-white/50 dark:border-white/5 shrink-0`}>
                          <item.icon size={24} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="text-slate-900 dark:text-white font-medium truncate text-base">{item.title}</h4>
                             {item.tags[0] && <span className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-white/10 ${item.color} font-bold tracking-wider`}>{item.tags[0]}</span>}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-light">{item.content}</p>
                       </div>
                       <div className="hidden md:flex flex-col items-end gap-1 text-xs text-slate-400">
                          <span>{item.timestamp}</span>
                       </div>
                       <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowRight size={20} />
                       </button>
                    </motion.div>
                  ))}
               </motion.div>
            )}

            {/* Calendar View Content */}
            {viewMode === 'calendar' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
                 <div className="glass-card rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-display font-semibold text-slate-900 dark:text-white">October 2023</h3>
                       <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"><ArrowRight className="rotate-180" size={16}/></button>
                          <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"><ArrowRight size={16}/></button>
                       </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                         <div key={i} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                       ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                       {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                          <div key={day} className={`aspect-square rounded-xl border border-slate-100 dark:border-white/5 ${day === 24 ? 'bg-primary text-white shadow-lg shadow-primary/30 border-primary' : 'bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'} p-2 relative transition-all cursor-pointer group flex flex-col justify-between`}>
                             <span className="text-sm font-medium">{day}</span>
                             {[12, 15, 24, 8].includes(day) && (
                               <div className="flex gap-1">
                                 <div className={`w-1.5 h-1.5 rounded-full ${day === 24 ? 'bg-white/60' : 'bg-indigo-400'}`}></div>
                                 {day === 15 && <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>}
                               </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
            
            {/* Earlier this week - Shown if in Grid or List mode */}
            {viewMode !== 'calendar' && (
              <>
                <div className="flex items-center gap-6 mb-8">
                   <h3 className="text-lg font-medium text-slate-900 dark:text-white">Earlier this week</h3>
                   <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></div>
                </div>
                
                <div className="space-y-4">
                   {memoryItems.slice(3).map((item) => (
                      <motion.div 
                         key={item.id}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         onClick={() => setSelectedItem(item)}
                         className="bg-white/60 dark:bg-surface-glassDark backdrop-blur-sm p-4 rounded-2xl border border-white/60 dark:border-white/5 hover:border-primary/30 hover:shadow-lg transition-all flex items-center gap-5 group cursor-pointer"
                      >
                         <div className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center ${item.color} shadow-sm border border-white/50 dark:border-white/5 shrink-0`}>
                            <item.icon size={24} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                               <h4 className="text-slate-900 dark:text-white font-medium truncate text-base">{item.title}</h4>
                               {item.tags[0] && <span className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-white/10 ${item.color} font-bold tracking-wider`}>{item.tags[0]}</span>}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-light">{item.content}</p>
                         </div>
                         <div className="hidden md:flex flex-col items-end gap-1 text-xs text-slate-400">
                            <span>{item.timestamp}</span>
                         </div>
                         <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                            <ArrowRight size={20} />
                         </button>
                      </motion.div>
                   ))}
                </div>
              </>
            )}

         </div>
      </div>
    </div>
  );
};