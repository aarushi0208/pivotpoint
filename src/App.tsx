/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Heart, 
  Target, 
  History, 
  ChevronRight, 
  Loader2,
  Trophy,
  Zap,
  MapPin,
  Calendar,
  Shield,
  Briefcase
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---

interface Career {
  title: string;
  description: string;
  whyFits: string;
  salaryRange: string;
}

interface LegacySkill {
  oldSkill: string;
  newApplication: string;
  icon: string;
}

interface AssessmentResult {
  topCareers: Career[];
  legacyVault: LegacySkill[];
}

interface RoadmapStep {
  step: string;
  timeline: string;
  action: string;
}

interface DetailedRoadmap {
  careerTitle: string;
  steps: RoadmapStep[];
  mentorAdvice: string;
}

interface Question {
  id: number;
  text: string;
  options: { label: string; value: string }[];
}

// --- Constants ---

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When facing a complex problem, you usually:",
    options: [
      { label: "Check the rulebook and standard procedures", value: "structured" },
      { label: "Experiment with unconventional solutions", value: "creative" },
      { label: "Break it down into data and logic", value: "analytical" },
      { label: "Consider how it impacts others involved", value: "empathetic" }
    ]
  },
  {
    id: 2,
    text: "Your ideal workspace feels like:",
    options: [
      { label: "A collaborative hub with constant interaction", value: "social" },
      { label: "A quiet, highly focused solo environment", value: "independent" },
      { label: "A fast-paced, high-stakes command center", value: "dynamic" },
      { label: "A stable, predictable office setting", value: "stable" }
    ]
  },
  {
    id: 3,
    text: "What motivates you most to finish a project?",
    options: [
      { label: "The recognition and status of winning", value: "achievement" },
      { label: "The knowledge that you helped someone", value: "purpose" },
      { label: "The satisfaction of solving a hard puzzle", value: "intellectual" },
      { label: "The financial rewards and security", value: "security" }
    ]
  }
];

// --- Components ---

export default function App() {
  const [step, setStep] = useState<'welcome' | 'test' | 'narrative' | 'loading_analysis' | 'results' | 'loading_roadmap' | 'final_path'>('welcome');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [narrative, setNarrative] = useState('');
  const [analysis, setAnalysis] = useState<AssessmentResult | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [detailedRoadmap, setDetailedRoadmap] = useState<DetailedRoadmap | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  useEffect(() => {
    if (apiKey) {
      aiRef.current = new GoogleGenAI({ apiKey });
    }
  }, [apiKey]);

  const handleNextStep = () => {
    if (step === 'welcome') setStep('test');
    else if (step === 'test') {
      if (currentQuestionIdx < QUESTIONS.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setStep('narrative');
      }
    } else if (step === 'narrative') {
      startAnalysis();
    }
  };

  const startAnalysis = async () => {
    setStep('loading_analysis');
    
    if (!aiRef.current) {
      console.error("Gemini API key missing");
      alert("AI Configuration missing. Please check your environment variables.");
      setStep('narrative');
      return;
    }

    const testAnswersSummary = Object.entries(answers)
      .map(([id, val]) => `Q${id}: ${val}`)
      .join(', ');

    const userPrompt = `
      Personality Profile: ${testAnswersSummary}
      Student's Story/Scenario: "${narrative}"
    `;

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: `
            Act as a world-class career counselor and psychologist.
            First, extract the "Legacy Vault": mapping 3 skills from their previous/lost dream to new potential uses.
            Then, propose 3 modern, high-potential career options that fit their profile.
            
            IMPORTANT: The "Legacy Vault" is the core emotional hook. If they failed NDA, focus on discipline and strategic thinking. If they missed pilot school, focus on spatial awareness and precision.
            Be compassionate but strategic.
          `,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topCareers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    whyFits: { type: Type.STRING },
                    salaryRange: { type: Type.STRING }
                  },
                  required: ["title", "description", "whyFits", "salaryRange"]
                }
              },
              legacyVault: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    oldSkill: { type: Type.STRING },
                    newApplication: { type: Type.STRING },
                    icon: { type: Type.STRING, description: "A keyword for a Lucide icon: target, shield, zap, trophy, heart" }
                  },
                  required: ["oldSkill", "newApplication", "icon"]
                }
              }
            },
            required: ["topCareers", "legacyVault"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setAnalysis(data);
      setStep('results');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong with the AI analysis. Please try again.");
      setStep('narrative');
    }
  };

  const generateDedicatedPathway = async (career: Career) => {
    setSelectedCareer(career);
    setStep('loading_roadmap');
    
    if (!aiRef.current) return;

    const context = `
      Selected career: ${career.title}
      Reasoning: ${career.whyFits}
      Student's background: ${narrative}
    `;

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: context,
        config: {
          systemInstruction: `
            Create a detailed, actionable 6-month roadmap for a student pivoting to ${career.title}.
            Provide specific steps, timelines, and a piece of expert "Mentor Advice" to keep them motivated.
            The roadmap should be realistic and broken down month-by-month into exact actions.
          `,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              careerTitle: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    timeline: { type: Type.STRING },
                    action: { type: Type.STRING }
                  },
                  required: ["step", "timeline", "action"]
                }
              },
              mentorAdvice: { type: Type.STRING }
            },
            required: ["careerTitle", "steps", "mentorAdvice"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setDetailedRoadmap(data);
      setStep('final_path');
    } catch (error) {
      console.error("Roadmap generation failed", error);
      // Removed alert to use a more graceful fallback if needed, but for now we reset step
      setStep('results');
      alert("The roadmap generator hit a snag. Please select the career path again to retry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#EEDDCC]">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        
        {/* Header */}
        <header className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
            <Compass className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">PivotPoint AI</h1>
        </header>

        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.9] text-pretty">
                Turn your <span className="italic font-serif">setbacks</span> into your <span className="text-[#A44333]">pivot</span>.
              </h2>
              <p className="text-xl text-[#666] max-w-xl leading-relaxed">
                Failed your dream exam? PivotPoint analyzes your psychology and legacy skills to map out a career you haven't even considered yet.
              </p>
              <button 
                onClick={handleNextStep}
                className="group flex items-center gap-4 bg-[#1A1A1A] text-white px-8 py-5 rounded-full hover:bg-[#333] transition-all"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* Test Step */}
          {step === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#999] font-semibold">
                  Step 01 — Mind Profile
                </span>
                <h3 className="text-4xl font-medium tracking-tight leading-tight">
                  {QUESTIONS[currentQuestionIdx].text}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTIONS[currentQuestionIdx].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAnswers({ ...answers, [QUESTIONS[currentQuestionIdx].id]: option.value });
                      handleNextStep();
                    }}
                    className={`p-8 text-left rounded-3xl border-2 transition-all ${
                      answers[QUESTIONS[currentQuestionIdx].id] === option.value
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#E5E5E5] hover:border-[#1A1A1A] bg-white'
                    }`}
                  >
                    <span className="text-lg font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-full transition-all ${i <= currentQuestionIdx ? 'bg-[#1A1A1A]' : 'bg-[#E5E5E5]'}`} 
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Narrative Step */}
          {step === 'narrative' && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#999] font-semibold">
                  Step 02 — The Narrative
                </span>
                <h3 className="text-4xl font-medium tracking-tight leading-tight">
                  Tell us your story. What was the dream, and what changed?
                </h3>
                <p className="text-[#666]">
                  Be honest. "I wanted to be X, but Y happened, and now I feel Z."
                </p>
              </div>

              <div className="space-y-6">
                <textarea
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Example: My dream was to crack the NDA exam and serve in the army, but I didn't make the cut. Commercial pilot training is too expensive for my family. Now I'm lost..."
                  className="w-full min-h-[200px] p-8 text-xl bg-[#F5F5F5] border-none rounded-3xl focus:ring-2 focus:ring-[#1A1A1A] transition-all resize-none font-serif italic"
                />
                
                <button
                  disabled={narrative.length < 10}
                  onClick={handleNextStep}
                  className="w-full group flex items-center justify-center gap-4 bg-[#1A1A1A] text-white px-8 py-5 rounded-full hover:bg-[#333] transition-all disabled:opacity-50"
                >
                  Generate My Pivot
                  <Sparkles className="w-5 h-5 text-[#FFD700]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Loading Steps */}
          {(step === 'loading_analysis' || step === 'loading_roadmap') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full"
                />
                <Brain className="absolute inset-0 m-auto w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium">
                  {step === 'loading_analysis' ? 'Synthesizing your PivotPoint...' : 'Carving your dedicated pathway...'}
                </h3>
                <p className="text-[#666]">
                  {step === 'loading_analysis' ? 'Mapping legacy skills to emerging markets.' : 'Building month-by-month actionable steps.'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Step: Career Selection */}
          {analysis && step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-24 pb-24"
            >
              <section className="space-y-12">
                <div className="flex items-end justify-between border-b border-[#E5E5E5] pb-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#999] font-semibold">Step 03 — Selection</span>
                    <h2 className="text-5xl font-medium tracking-tight">Your Potential Pivots</h2>
                  </div>
                  <Target className="w-10 h-10 text-[#A44333]" />
                </div>

                <p className="text-xl text-[#666] max-w-2xl">
                  We've identified three paths where your unique background gives you an unfair advantage. <span className="text-[#1A1A1A] font-medium">Select one to build your dedicated roadmap.</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.topCareers.map((career, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={career.title}
                      className="p-8 bg-white rounded-3xl border border-[#E5E5E5] space-y-6 hover:shadow-xl transition-all group flex flex-col justify-between"
                    >
                      <div className="space-y-6">
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-2xl flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-semibold leading-tight">{career.title}</h4>
                          <p className="text-sm text-[#999]">{career.salaryRange}</p>
                        </div>
                        <p className="text-sm text-[#666] leading-relaxed">{career.description}</p>
                        <div className="pt-4 border-t border-[#F5F5F5]">
                          <p className="text-xs font-semibold text-[#A44333] uppercase mb-1">Why it fits you:</p>
                          <p className="text-xs italic text-[#666]">{career.whyFits}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => generateDedicatedPathway(career)}
                        className="mt-8 w-full py-4 rounded-full border-2 border-[#1A1A1A] font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        Select Path <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Legacy Vault remains in this step to remind them of their worth */}
              <section className="space-y-12 p-12 bg-[#1A1A1A] text-white rounded-[40px] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#A44333] blur-[120px] opacity-20" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-[#A44333]" />
                    <span className="text-xs uppercase tracking-widest text-[#999] font-semibold">Skill Alchemy</span>
                  </div>
                  <h3 className="text-4xl font-medium tracking-tight">The Legacy Vault</h3>
                  <p className="text-[#999] max-w-lg">
                    Evidence that your past efforts weren't wasted. Your "lost dream" created these competitive advantages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  {analysis.legacyVault.map((item, i) => {
                    const IconComp = {
                      target: Target,
                      shield: Shield,
                      zap: Zap,
                      trophy: Trophy,
                      heart: Heart,
                    }[item.icon.toLowerCase()] || Zap;

                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        key={i} 
                        className="flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
                            <IconComp className="w-4 h-4 text-[#A44333]" />
                          </div>
                          <span className="text-lg font-serif italic text-white/50">{item.oldSkill}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#999] rotate-90 md:rotate-0" />
                        <div className="p-6 bg-[#333]/50 rounded-2xl backdrop-blur-sm border border-white/5">
                          <h5 className="font-semibold text-white mb-1 uppercase text-xs tracking-wider">New Application</h5>
                          <p className="text-sm text-[#CCC] leading-relaxed">{item.newApplication}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* Final Dedicated Pathway */}
          {detailedRoadmap && step === 'final_path' && (
            <motion.div
              key="final_path"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-16 pb-24"
            >
              <div className="space-y-6">
                <button 
                  onClick={() => setStep('results')}
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#999] hover:text-[#1A1A1A] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Change Path
                </button>
                <div className="border-b border-[#E5E5E5] pb-10">
                  <span className="text-xs uppercase tracking-widest text-[#999] font-semibold">Your Blueprint</span>
                  <h2 className="text-6xl font-medium tracking-tight mt-2">Pathway to {detailedRoadmap.careerTitle}</h2>
                </div>
              </div>

              {/* Mentor Advice Card */}
              <section className="bg-[#EEDDCC]/30 p-10 rounded-[40px] border border-[#EEDDCC] flex gap-8 items-start">
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#A44333]">Mentor Advice</h4>
                  <p className="text-2xl font-serif italic leading-snug">"{detailedRoadmap.mentorAdvice}"</p>
                </div>
              </section>

              <section className="space-y-12">
                <div className="space-y-8">
                  {detailedRoadmap.steps.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-8 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center font-serif text-xl group-hover:bg-[#1A1A1A] group-hover:text-white transition-all bg-white relative z-10">
                          {i + 1}
                        </div>
                        {i < detailedRoadmap.steps.length - 1 && <div className="w-0.5 h-full bg-[#E5E5E5] mt-4" />}
                      </div>
                      <div className="pb-16 space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-2xl font-semibold">{step.step}</h4>
                          <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-[#1A1A1A]/5 rounded-full text-[#666]">
                            <Calendar className="w-3 h-3" />
                            {step.timeline}
                          </div>
                        </div>
                        <div className="p-8 bg-[#F5F5F5] rounded-[32px] group-hover:bg-white border border-transparent group-hover:border-[#E5E5E5] transition-all group-hover:shadow-lg">
                          <p className="text-lg text-[#333] leading-relaxed">{step.action}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <div className="bg-[#1A1A1A] text-white p-12 rounded-[40px] text-center space-y-6">
                <h3 className="text-3xl font-medium tracking-tight">Ready to start your pivot?</h3>
                <p className="text-[#999] max-w-md mx-auto">This roadmap is built on your legacy skills. Your failure wasn't a dead end—it was preparation.</p>
                <div className="pt-4 flex flex-col items-center gap-4">
                  <button className="bg-[#A44333] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                    Download Roadmap (PDF)
                  </button>
                  <button 
                    onClick={() => {
                      setStep('welcome');
                      setAnalysis(null);
                      setAnswers({});
                      setNarrative('');
                      setCurrentQuestionIdx(0);
                    }}
                    className="text-sm uppercase tracking-widest text-[#999] hover:text-white transition-colors"
                  >
                    Start a New Assessment
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
