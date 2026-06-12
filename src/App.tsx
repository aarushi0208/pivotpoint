/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

const personalityProfile = (answers: Record<number, string>) => {
  const counts: Record<string, number> = {
    structured: 0,
    creative: 0,
    analytical: 0,
    empathetic: 0,
    social: 0,
    independent: 0,
    dynamic: 0,
    stable: 0,
    achievement: 0,
    purpose: 0,
    intellectual: 0,
    security: 0,
  };

  Object.values(answers).forEach((value) => {
    counts[value] = (counts[value] || 0) + 1;
  });

  const topSkill = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'balanced';
  return topSkill;
};

const createLocalAnalysis = (answers: Record<number, string>, narrative: string): AssessmentResult => {
  const profile = personalityProfile(answers);
  const baseNarrative = narrative.toLowerCase();
  const careerOptions = {
    structured: [
      {
        title: 'Operations Strategy Analyst',
        description: 'Build systems that turn uncertainty into clear, repeatable outcomes for teams and missions.',
        whyFits: 'Your disciplined thinking and respect for structure make you ideal for operational planning roles.',
        salaryRange: '₹6L - ₹12L',
      },
      {
        title: 'Quality Assurance Lead',
        description: 'Design process guardrails that keep complex projects running smoothly.',
        whyFits: 'You thrive when applying rules, detail, and consistency to deliver reliable results.',
        salaryRange: '₹5L - ₹10L',
      },
      {
        title: 'Project Management Specialist',
        description: 'Coordinate teams around deadlines, risks, and measurable milestones.',
        whyFits: 'Your methodical approach helps teams stay aligned and focused on outcomes.',
        salaryRange: '₹7L - ₹14L',
      },
    ],
    creative: [
      {
        title: 'Product Design Researcher',
        description: 'Turn human stories into digital products that feel meaningful and intuitive.',
        whyFits: 'Your ability to imagine new possibilities and empathize deeply is a strong asset.',
        salaryRange: '₹6L - ₹13L',
      },
      {
        title: 'Content Experience Planner',
        description: 'Craft compelling narratives that guide people through change and growth.',
        whyFits: 'You bring originality and emotional clarity to educational and career stories.',
        salaryRange: '₹5L - ₹11L',
      },
      {
        title: 'Innovation Operations Coordinator',
        description: 'Turn creative ideas into practical pilots that prove value fast.',
        whyFits: 'You can bridge imagination with execution in evolving teams.',
        salaryRange: '₹6.5L - ₹12L',
      },
    ],
    analytical: [
      {
        title: 'Data-Driven Career Strategist',
        description: 'Use evidence and patterns to recommend the next best move for learners.',
        whyFits: 'You naturally break problems into data and logical pathways.',
        salaryRange: '₹7L - ₹15L',
      },
      {
        title: 'Business Intelligence Analyst',
        description: 'Translate metrics into actionable recommendations for fast-changing teams.',
        whyFits: 'Your analytical lens helps organizations see what matters most.',
        salaryRange: '₹8L - ₹16L',
      },
      {
        title: 'Risk Assessment Consultant',
        description: 'Identify pitfalls and plans to keep projects on track under uncertainty.',
        whyFits: 'Your logic-focused mindset excels at spotting issues before they become problems.',
        salaryRange: '₹7L - ₹14L',
      },
    ],
    empathetic: [
      {
        title: 'Student Success Coach',
        description: 'Guide learners through setbacks with empathy-based growth plans.',
        whyFits: 'You are driven by helping others feel capable and seen.',
        salaryRange: '₹5L - ₹10L',
      },
      {
        title: 'Community Programs Designer',
        description: 'Shape supportive experiences for groups that need direction and trust.',
        whyFits: 'You understand people and can design systems that care for them.',
        salaryRange: '₹6L - ₹12L',
      },
      {
        title: 'Ethical Product Advisor',
        description: 'Combine human needs with product strategy to keep solutions grounded.',
        whyFits: 'Your compassion makes you a strong partner for responsible teams.',
        salaryRange: '₹7L - ₹13L',
      },
    ],
    social: [
      {
        title: 'Partnership Development Lead',
        description: 'Build bridges between teams, clients, and learning ecosystems.',
        whyFits: 'You enjoy collaboration and thrive when interacting with many stakeholders.',
        salaryRange: '₹7L - ₹14L',
      },
      {
        title: 'Community Growth Strategist',
        description: 'Design and scale experiences that bring people together around purpose.',
        whyFits: 'Your social energy helps communities feel energised and connected.',
        salaryRange: '₹6L - ₹13L',
      },
      {
        title: 'People Operations Specialist',
        description: 'Help teams perform better by improving communication and support systems.',
        whyFits: 'You are motivated by people and effective ways to help them succeed.',
        salaryRange: '₹7L - ₹12L',
      },
    ],
    independent: [
      {
        title: 'Freelance Digital Consultant',
        description: 'Help startups and students pivot with focused, self-directed support.',
        whyFits: 'You are comfortable owning work and steering it independently.',
        salaryRange: '₹5L - ₹11L',
      },
      {
        title: 'Remote Research Specialist',
        description: 'Deliver in-depth insights while working autonomously across teams.',
        whyFits: 'You prefer quiet, focused environments and self-paced progress.',
        salaryRange: '₹6L - ₹12L',
      },
      {
        title: 'Technical Content Author',
        description: 'Create structured learning materials, guides, and roadmaps from home.',
        whyFits: 'You bring independent discipline to long-form, high-value work.',
        salaryRange: '₹6L - ₹11L',
      },
    ],
    dynamic: [
      {
        title: 'Operations Growth Specialist',
        description: 'Move fast and keep complex team projects aligned as they scale.',
        whyFits: 'You love high-energy settings and responding quickly to change.',
        salaryRange: '₹8L - ₹15L',
      },
      {
        title: 'Product Launch Coordinator',
        description: 'Help new initiatives ship with speed, precision, and adaptability.',
        whyFits: 'Your energy fits roles that need fast, smart execution.',
        salaryRange: '₹7.5L - ₹14L',
      },
      {
        title: 'Growth Operations Partner',
        description: 'Support teams through rapid expansion with practical systems.',
        whyFits: 'You thrive when solving hard problems under tight timelines.',
        salaryRange: '₹8L - ₹16L',
      },
    ],
    stable: [
      {
        title: 'Compliance Program Analyst',
        description: 'Create dependable systems that keep businesses steady and secure.',
        whyFits: 'You prefer environments with consistency and well-defined expectations.',
        salaryRange: '₹6L - ₹13L',
      },
      {
        title: 'Operations Support Specialist',
        description: 'Make processes reliable for teams that depend on consistency.',
        whyFits: 'Your steady mindset is a strong fit for support-focused roles.',
        salaryRange: '₹5.5L - ₹11L',
      },
      {
        title: 'Data Validation Coordinator',
        description: 'Ensure information is accurate and ready for confident decision-making.',
        whyFits: 'You are at your best when keeping workflows stable and orderly.',
        salaryRange: '₹6L - ₹12L',
      },
    ],
    achievement: [
      {
        title: 'Competitive Operations Lead',
        description: 'Drive teams toward measurable wins and sharpened performance.',
        whyFits: 'You want work that rewards success and visible impact.',
        salaryRange: '₹8L - ₹16L',
      },
      {
        title: 'Sales Enablement Analyst',
        description: 'Create tools and training that boost performance across teams.',
        whyFits: 'You enjoy building systems that help people win consistently.',
        salaryRange: '₹7L - ₹14L',
      },
      {
        title: 'Performance Operations Strategist',
        description: 'Design frameworks for achieving ambitious goals reliably.',
        whyFits: 'Your drive for achievement makes you a natural match for growth roles.',
        salaryRange: '₹8L - ₹15L',
      },
    ],
    purpose: [
      {
        title: 'Impact Program Coordinator',
        description: 'Shape programs that make a measurable difference in people’s lives.',
        whyFits: 'You want work that feels meaningful and connected to others.',
        salaryRange: '₹6L - ₹13L',
      },
      {
        title: 'Learning Experience Designer',
        description: 'Build journeys that help students grow through real-world skill building.',
        whyFits: 'Your work is driven by helping others develop and thrive.',
        salaryRange: '₹7L - ₹14L',
      },
      {
        title: 'Talent Development Analyst',
        description: 'Create systems that support people as they discover their strongest paths.',
        whyFits: 'You’re motivated by supporting progress and purpose in others.',
        salaryRange: '₹7L - ₹14L',
      },
    ],
    intellectual: [
      {
        title: 'Strategy Research Analyst',
        description: 'Dig into problems and deliver insight-driven recommendations.',
        whyFits: 'You enjoy solving puzzles with evidence and careful reasoning.',
        salaryRange: '₹7L - ₹15L',
      },
      {
        title: 'Technical Writer',
        description: 'Explain complex systems clearly for teams and learners.',
        whyFits: 'Your curiosity and precision make you an effective communicator.',
        salaryRange: '₹6L - ₹12L',
      },
      {
        title: 'Market Insight Specialist',
        description: 'Use research to uncover the next strategic opportunity.',
        whyFits: 'You’re naturally drawn to thoughtful, evidence-based work.',
        salaryRange: '₹7L - ₹14L',
      },
    ],
    security: [
      {
        title: 'Risk Management Coordinator',
        description: 'Find and mitigate the risks that keep projects stable and trusted.',
        whyFits: 'You value safety, preparation, and reliable outcomes.',
        salaryRange: '₹6L - ₹13L',
      },
      {
        title: 'Compliance Operations Analyst',
        description: 'Create dependable controls that keep teams aligned and compliant.',
        whyFits: 'Your careful, steady approach is ideal for stability-focused work.',
        salaryRange: '₹6.5L - ₹13L',
      },
      {
        title: 'Workflow Integrity Specialist',
        description: 'Keep processes consistent and error-free through strong checks.',
        whyFits: 'You are strongest when helping teams avoid costly mistakes.',
        salaryRange: '₹5.5L - ₹12L',
      },
    ],
  };

  const selected = careerOptions[profile] ?? careerOptions.analytical;
  const topCareers = selected.slice(0, 3);

  const legacyVault: LegacySkill[] = [
    {
      oldSkill: baseNarrative.includes('army') || baseNarrative.includes('soldier') ? 'Discipline under pressure' : 'Focused execution',
      newApplication: baseNarrative.includes('army') || baseNarrative.includes('soldier')
        ? 'Use your high-pressure focus to lead operations or quality initiatives.'
        : 'Turn your ability to execute complex plans into process-driven roles.',
      icon: 'shield',
    },
    {
      oldSkill: baseNarrative.includes('pilot') || baseNarrative.includes('aviation') ? 'Spatial precision' : 'Strategic problem solving',
      newApplication: baseNarrative.includes('pilot') || baseNarrative.includes('aviation')
        ? 'Apply precise planning to logistics, research, or product operations.'
        : 'Use your ability to break problems down into clear steps for growth roles.',
      icon: 'target',
    },
    {
      oldSkill: baseNarrative.includes('failed') || baseNarrative.includes('exam') ? 'Resilience after setbacks' : 'Learning from experience',
      newApplication: baseNarrative.includes('failed') || baseNarrative.includes('exam')
        ? 'Channel your resilience into coaching, training, or operations recovery roles.'
        : 'Use your hard-earned lessons to support others facing transition.',
      icon: 'heart',
    },
  ];

  return { topCareers, legacyVault };
};

const createLocalRoadmap = (career: Career, narrative: string): DetailedRoadmap => {
  const isAnalytical = career.title.toLowerCase().includes('analyst') || career.title.toLowerCase().includes('strategist');
  const isCreative = career.title.toLowerCase().includes('designer') || career.title.toLowerCase().includes('creative');
  const isSupport = career.title.toLowerCase().includes('coach') || career.title.toLowerCase().includes('community');

  const baseSteps: RoadmapStep[] = [
    {
      step: 'Clarify the new direction',
      timeline: 'Month 1',
      action: `Define what success looks like in ${career.title} and map your current strengths to that path.`,
    },
    {
      step: 'Build relevant skills',
      timeline: 'Month 2-3',
      action: `Learn one core tool or framework used by ${career.title} professionals and practice it on a real example.`,
    },
    {
      step: 'Create a showcase',
      timeline: 'Month 3-4',
      action: `Develop a portfolio item or case study that reflects the mindset behind ${career.title}.`,
    },
    {
      step: 'Network with purpose',
      timeline: 'Month 4-5',
      action: `Reach out to people already doing similar work and ask for feedback on your new direction.`,
    },
    {
      step: 'Gain practical momentum',
      timeline: 'Month 5',
      action: `Volunteer, freelance, or contribute to a project that directly uses your new skills.`,
    },
    {
      step: 'Launch your pivot',
      timeline: 'Month 6',
      action: `Turn your learning and experience into a clear next step: an application, a pilot, or a portfolio review.`,
    },
  ];

  let mentorAdvice = 'Stay curious and keep building momentum by turning every setback into a stronger next step.';

  if (isAnalytical) {
    mentorAdvice = 'Leverage your logical strength to build confidence through repeatable systems and measurable progress.';
  } else if (isCreative) {
    mentorAdvice = 'Trust your curiosity and keep iterating until your ideas land in a concrete, valuable way.';
  } else if (isSupport) {
    mentorAdvice = 'Your empathy is a superpower; use it to connect your story to the people you want to help.';
  }

  return {
    careerTitle: career.title,
    steps: baseSteps,
    mentorAdvice,
  };
};

export default function App() {
  const [step, setStep] = useState<'welcome' | 'test' | 'narrative' | 'loading_analysis' | 'results' | 'loading_roadmap' | 'final_path'>('welcome');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [narrative, setNarrative] = useState('');
  const [analysis, setAnalysis] = useState<AssessmentResult | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [detailedRoadmap, setDetailedRoadmap] = useState<DetailedRoadmap | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

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

  const startAnalysis = () => {
    setStep('loading_analysis');

    const localAnalysis = createLocalAnalysis(answers, narrative);
    setAnalysis(localAnalysis);
    setStep('results');
  };

  const generateDedicatedPathway = (career: Career) => {
    setSelectedCareer(career);
    setStep('loading_roadmap');

    const roadmap = createLocalRoadmap(career, narrative);
    setDetailedRoadmap(roadmap);
    setStep('final_path');
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
