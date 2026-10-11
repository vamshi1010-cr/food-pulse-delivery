import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Calculator, 
  GitBranch, 
  ShieldCheck, 
  Play, 
  FileText
} from 'lucide-react';
import { 
  PROCESS_MODELS_DATA, 
  SRS_IEEE_DOCUMENT, 
  AGILE_USER_STORIES, 
  DFD_LEVEL_0, 
  DFD_LEVEL_1, 
  TEST_CASES_DATA, 
  QUALITY_METRICS_DATA 
} from '../../data/mockSEData';
import type { COCOMOInputs, COCOMOResult, FPInputs } from '../../types/se';

export const SEStudio: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Unit III: Interactive COCOMO state
  const [cocomoInputs, setCocomoInputs] = useState<COCOMOInputs>({
    kloc: 24,
    mode: 'Semi-Detached',
    costPerPersonMonth: 85000
  });

  // Unit III: Interactive Function Point state
  const [fpInputs] = useState<FPInputs>({
    eiCount: 12,
    eoCount: 15,
    eqCount: 8,
    ilfCount: 6,
    eifCount: 4,
    vaf: 1.12
  });

  // Unit IV: DFD Level state
  const [dfdLevel, setDfdLevel] = useState<0 | 1>(0);

  // Unit V: Interactive Test Runner state
  const [activeTestCase, setActiveTestCase] = useState<string>(TEST_CASES_DATA[0].id);
  const [testExecutionLogs, setTestExecutionLogs] = useState<string[]>([]);

  // COCOMO Calculation formulas
  const calculateCOCOMO = (inputs: COCOMOInputs): COCOMOResult => {
    let a = 3.0, b = 1.12, c = 2.5, d = 0.35;
    if (inputs.mode === 'Organic') {
      a = 2.4; b = 1.05; c = 2.5; d = 0.38;
    } else if (inputs.mode === 'Embedded') {
      a = 3.6; b = 1.20; c = 2.5; d = 0.32;
    }

    const effort = a * Math.pow(inputs.kloc, b);
    const devTime = c * Math.pow(effort, d);
    const staff = effort / devTime;
    const totalCost = effort * inputs.costPerPersonMonth;
    const productivity = inputs.kloc / effort;

    return {
      effortPersonMonths: Math.round(effort * 10) / 10,
      developmentTimeMonths: Math.round(devTime * 10) / 10,
      averageStaffSize: Math.round(staff * 10) / 10,
      totalCostINR: Math.round(totalCost),
      productivityKLOCPerPM: Math.round(productivity * 1000) / 1000
    };
  };

  const cocomoResult = calculateCOCOMO(cocomoInputs);

  // Function Point Calculation formula
  const unadjustedFP = 
    fpInputs.eiCount * 4 + 
    fpInputs.eoCount * 5 + 
    fpInputs.eqCount * 4 + 
    fpInputs.ilfCount * 10 + 
    fpInputs.eifCount * 7;
  
  const finalFP = Math.round(unadjustedFP * fpInputs.vaf);
  const estimatedLOCJavaTS = finalFP * 50;

  const handleRunTestCase = (tcId: string) => {
    setTestExecutionLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Executing Test ${tcId}...`,
      `[ASSERTION] Inputs passed boundary parameters. Output matched expected.`,
      `[COVERAGE] 100% Branch & Statement condition verified.`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* SE Course Header */}
      <div className="bg-[#161b22] p-6 rounded-xl border border-[#21262d] space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#21262d] text-[#3fb950] border border-[#30363d] text-[11px] font-medium px-2.5 py-0.5 rounded flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" /> Course Code: 22CSC21N
          </span>
          <span className="bg-[#0d1117] text-[#8b949e] text-[11px] font-normal px-2.5 py-0.5 rounded border border-[#21262d]">
            Credits: 3 | CIE: 40 | SEE: 60 Marks
          </span>
          <span className="bg-[#0d1117] text-[#8b949e] text-[11px] font-normal px-2.5 py-0.5 rounded border border-[#21262d]">
            Chaitanya Bharathi Institute of Technology (A)
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-medium text-[#f0f6fc]">
          SOFTWARE ENGINEERING ACADEMIC STUDIO
        </h1>
        <p className="text-xs text-[#8b949e] max-w-3xl leading-relaxed">
          Applied software engineering case study workbench mapping 22CSC21N syllabus requirements (Units I to V) to the FoodPulse delivery platform architecture.
        </p>
      </div>

      {/* Syllabus Unit Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none bg-[#0d1117] p-1.5 rounded-lg border border-[#21262d]">
        {[
          { unit: 1, title: 'UNIT I: Process Models', icon: Layers },
          { unit: 2, title: 'UNIT II: Agile & SRS', icon: FileText },
          { unit: 3, title: 'UNIT III: Cost Estimation', icon: Calculator },
          { unit: 4, title: 'UNIT IV: Architecture & DFDs', icon: GitBranch },
          { unit: 5, title: 'UNIT V: Testing & Quality', icon: ShieldCheck }
        ].map((u) => {
          const Icon = u.icon;
          const isSel = activeUnit === u.unit;
          return (
            <button
              key={u.unit}
              onClick={() => setActiveUnit(u.unit as any)}
              className={`px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap flex items-center space-x-2 transition ${
                isSel
                  ? 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#f0f6fc]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{u.title}</span>
            </button>
          );
        })}
      </div>

      {/* UNIT I: PROCESS MODELS */}
      {activeUnit === 1 && (
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3">
            <h2 className="text-base font-medium text-[#f0f6fc] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#3fb950]" /> UNIT - I: Generic Process Model & Framework Activities
            </h2>
            <p className="text-xs text-[#8b949e]">
              Process framework activities: Communication ➔ Planning ➔ Modeling ➔ Construction ➔ Deployment.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {[
                { step: '1. Communication', desc: 'Eliciting requirements' },
                { step: '2. Planning', desc: 'COCOMO & Risk matrix' },
                { step: '3. Modeling', desc: 'DFD diagrams & design' },
                { step: '4. Construction', desc: 'Coding & unit testing' },
                { step: '5. Deployment', desc: 'CI/CD pipeline release' }
              ].map((fw, idx) => (
                <div key={idx} className="bg-[#0d1117] p-2.5 rounded-lg border border-[#21262d] text-center space-y-0.5">
                  <div className="text-xs font-medium text-[#3fb950]">{fw.step}</div>
                  <div className="text-[10px] text-[#8b949e]">{fw.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROCESS_MODELS_DATA.map((pm) => (
              <div key={pm.id} className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-medium text-[#3fb950] uppercase tracking-wider bg-[#238636]/10 px-2 py-0.5 rounded border border-[#238636]/30">
                      {pm.category} • {pm.syllabusUnit}
                    </span>
                    <h3 className="text-sm font-medium text-[#f0f6fc] mt-1">{pm.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#3fb950]">
                    {pm.suitabilityForFoodDelivery.score} / 10
                  </span>
                </div>

                <p className="text-xs text-[#8b949e]">{pm.description}</p>

                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#21262d] text-xs text-[#c9d1d9] space-y-0.5">
                  <span className="text-[10px] uppercase font-medium text-[#8b949e] block">Food Delivery Evaluation</span>
                  <p className="text-xs italic">{pm.suitabilityForFoodDelivery.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UNIT II: AGILE & SRS */}
      {activeUnit === 2 && (
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-medium text-[#f0f6fc] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3fb950]" /> UNIT - II: IEEE Std 830-1998 Software Requirements Specification (SRS)
            </h2>

            <div className="space-y-3">
              {SRS_IEEE_DOCUMENT.map((sec) => (
                <div key={sec.id} className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-medium text-[#3fb950]">
                      Section {sec.sectionNumber}
                    </span>
                    <h3 className="font-medium text-[#f0f6fc] text-xs">{sec.title}</h3>
                  </div>
                  <p className="text-xs text-[#8b949e]">{sec.content}</p>

                  {sec.subsections && (
                    <div className="space-y-1.5 pt-1">
                      {sec.subsections.map((sub, i) => (
                        <div key={i} className="bg-[#161b22] p-2.5 rounded border border-[#21262d] text-xs">
                          <span className="font-medium text-[#d29922] block">{sub.title}</span>
                          <span className="text-[#8b949e] text-[11px]">{sub.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-[#f0f6fc]">Agile Scrum User Stories Backlog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AGILE_USER_STORIES.map((story) => (
                <div key={story.id} className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-[#f97316] uppercase tracking-wider">
                      {story.epic}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#3fb950]">
                      {story.storyPoints} Points
                    </span>
                  </div>

                  <h4 className="font-medium text-[#f0f6fc] text-xs">{story.title}</h4>

                  <div className="bg-[#161b22] p-2.5 rounded border border-[#21262d] text-[11px] text-[#8b949e] space-y-0.5">
                    <p><strong className="text-[#c9d1d9]">As a:</strong> {story.asA}</p>
                    <p><strong className="text-[#c9d1d9]">I want:</strong> {story.iWantTo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UNIT III: COCOMO & FP COST ESTIMATION */}
      {activeUnit === 3 && (
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-medium text-[#f0f6fc] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#3fb950]" /> UNIT - III: COCOMO Model Software Cost Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-4">
                <h3 className="font-medium text-[#f0f6fc] text-xs uppercase tracking-wider">Input Parameters</h3>
                
                <div>
                  <div className="flex justify-between text-xs font-medium text-[#c9d1d9] mb-1">
                    <span>Codebase Size (KLOC)</span>
                    <span className="text-[#3fb950] font-mono">{cocomoInputs.kloc} KLOC</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={120}
                    value={cocomoInputs.kloc}
                    onChange={(e) => setCocomoInputs({ ...cocomoInputs, kloc: Number(e.target.value) })}
                    className="w-full accent-[#f97316]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c9d1d9] uppercase tracking-wider mb-1">
                    COCOMO Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Organic', 'Semi-Detached', 'Embedded'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setCocomoInputs({ ...cocomoInputs, mode: m as any })}
                        className={`p-2 rounded text-xs font-medium border transition ${
                          cocomoInputs.mode === m
                            ? 'bg-[#21262d] border-[#30363d] text-[#f0f6fc]'
                            : 'bg-[#0d1117] border-[#21262d] text-[#8b949e]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-3 flex flex-col justify-between">
                <h3 className="font-medium text-[#f0f6fc] text-xs uppercase tracking-wider">COCOMO Estimation Outputs</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#161b22] p-3 rounded border border-[#21262d]">
                    <span className="text-[10px] text-[#8b949e] font-medium">Effort</span>
                    <p className="text-lg font-mono font-medium text-[#3fb950]">{cocomoResult.effortPersonMonths} PM</p>
                  </div>
                  <div className="bg-[#161b22] p-3 rounded border border-[#21262d]">
                    <span className="text-[10px] text-[#8b949e] font-medium">Schedule</span>
                    <p className="text-lg font-mono font-medium text-[#d29922]">{cocomoResult.developmentTimeMonths} Months</p>
                  </div>
                </div>

                <div className="bg-[#161b22] p-3 rounded border border-[#21262d] text-center">
                  <span className="text-[10px] text-[#8b949e] uppercase font-medium">Estimated Project Budget</span>
                  <p className="text-xl font-mono font-medium text-[#3fb950]">₹{cocomoResult.totalCostINR.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-[#f0f6fc]">Function Point (FP) Sizing</h3>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] text-center space-y-1">
              <span className="text-xs text-[#8b949e]">Calculated Function Points</span>
              <p className="text-3xl font-mono font-medium text-[#d29922]">{finalFP} FP</p>
              <p className="text-xs text-[#8b949e]">Equivalent to ~<strong className="text-[#f0f6fc] font-mono">{estimatedLOCJavaTS}</strong> lines of TypeScript backend/frontend code.</p>
            </div>
          </div>
        </div>
      )}

      {/* UNIT IV: ARCHITECTURE & DFDS */}
      {activeUnit === 4 && (
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-medium text-[#f0f6fc] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#3fb950]" /> UNIT - IV: Data Flow Diagrams (DFD) & Architectural Style
              </h2>

              <div className="flex items-center space-x-1 bg-[#0d1117] p-1 rounded-lg border border-[#21262d]">
                <button
                  onClick={() => setDfdLevel(0)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    dfdLevel === 0 ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e]'
                  }`}
                >
                  Level 0 Context
                </button>
                <button
                  onClick={() => setDfdLevel(1)}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    dfdLevel === 1 ? 'bg-[#21262d] text-[#f0f6fc]' : 'text-[#8b949e]'
                  }`}
                >
                  Level 1 Subsystem
                </button>
              </div>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-3">
              <h3 className="text-xs font-medium text-[#c9d1d9]">
                {dfdLevel === 0 ? DFD_LEVEL_0.title : DFD_LEVEL_1.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(dfdLevel === 0 ? DFD_LEVEL_0.nodes : DFD_LEVEL_1.nodes).map((node) => (
                  <div 
                    key={node.id}
                    className="bg-[#161b22] p-3 rounded-lg border border-[#21262d] space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center text-[#8b949e]">
                      <span className="text-[10px] uppercase font-medium">{node.type}</span>
                      <span className="font-mono">{node.id}</span>
                    </div>
                    <h4 className="font-medium text-[#f0f6fc]">{node.name}</h4>
                    <p className="text-[11px] text-[#8b949e]">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNIT V: TESTING & QUALITY */}
      {activeUnit === 5 && (
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-medium text-[#f0f6fc] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3fb950]" /> UNIT - V: Black-Box & White-Box Testing Runner
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {TEST_CASES_DATA.map((tc) => (
                  <div
                    key={tc.id}
                    onClick={() => setActiveTestCase(tc.id)}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                      activeTestCase === tc.id
                        ? 'bg-[#21262d] border-[#30363d] text-[#f0f6fc]'
                        : 'bg-[#0d1117] border-[#21262d] text-[#8b949e]'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] font-medium text-[#3fb950] uppercase">{tc.type}</span>
                      <span className="text-[#3fb950] font-medium">✓ {tc.actualStatus}</span>
                    </div>
                    <h4 className="font-medium text-[#f0f6fc] mt-0.5">{tc.testCaseName}</h4>
                  </div>
                ))}
              </div>

              {(() => {
                const selTc = TEST_CASES_DATA.find((t) => t.id === activeTestCase) || TEST_CASES_DATA[0];
                return (
                  <div className="bg-[#0d1117] p-4 rounded-lg border border-[#21262d] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#d29922]">{selTc.module}</span>
                        <button
                          onClick={() => handleRunTestCase(selTc.id)}
                          className="bg-[#238636] hover:bg-[#2ea043] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Run Assertion
                        </button>
                      </div>

                      {selTc.codeSnippet && (
                        <pre className="bg-[#161b22] p-2.5 rounded border border-[#21262d] text-[11px] font-mono text-[#3fb950] overflow-x-auto">
                          {selTc.codeSnippet}
                        </pre>
                      )}
                    </div>

                    <div className="bg-black p-2.5 rounded border border-[#21262d] font-mono text-[11px] h-28 overflow-y-auto space-y-0.5">
                      <span className="text-[#8b949e]">$ test-runner --exec {selTc.id}</span>
                      {testExecutionLogs.map((log, i) => (
                        <p key={i} className="text-[#3fb950]">{log}</p>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] p-5 rounded-xl space-y-3">
            <h3 className="text-sm font-medium text-[#f0f6fc]">McCall's & HP FURPS Quality Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {QUALITY_METRICS_DATA.map((qm, idx) => (
                <div key={idx} className="bg-[#0d1117] p-3.5 rounded-lg border border-[#21262d] space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#3fb950] uppercase font-medium">{qm.model}</span>
                    <span className="font-mono font-medium text-[#3fb950]">{qm.score}/100</span>
                  </div>
                  <h4 className="font-medium text-[#f0f6fc]">{qm.attribute}</h4>
                  <p className="text-[11px] text-[#8b949e]">{qm.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
