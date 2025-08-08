import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/Card';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { config } from '../config';

// --- TYPES AND INTERFACES ---
interface AnalysisResult {
    originalText: string;
    decision: 'ALLOW' | 'FLAG' | 'BLOCK';
    reason: string;
    categories: string[];
    problematicPhrase?: string;
}

interface Rule {
    id: string;
    category: string;
    action: 'FLAG' | 'BLOCK';
}

interface SimulatedAction {
    originalText: string;
    action: 'FLAG' | 'BLOCK';
    reason: string;
    matchedRule: Rule;
    analysis: AnalysisResult;
}

const SAMPLE_DATA = [
    "Check out my new website for free stuff! my-cool-site.gg",
    "This is a wonderful community, so glad I found it.",
    "You're an idiot and nobody likes you.",
    "I'm feeling a bit down today.",
    "URGENT: Your account is compromised, click here to fix it fast-secure-login.info",
    "I disagree with your point, but I respect your opinion.",
    "This is just vile hate speech.",
].join('\n');

const BACKEND_URL = config.API_URL;

// --- HELPER FUNCTIONS ---

const getDecisionAppearance = (decision: 'ALLOW' | 'FLAG' | 'BLOCK' | 'ERROR') => {
    switch (decision) {
        case 'BLOCK': return { color: 'red', badge: 'bg-red-500/20 text-red-400', border: 'border-red-500/50' };
        case 'FLAG': return { color: 'amber', badge: 'bg-amber-500/20 text-amber-400', border: 'border-amber-500/50' };
        case 'ALLOW': return { color: 'green', badge: 'bg-green-500/20 text-green-400', border: 'border-green-500/50' };
        default: return { color: 'zinc', badge: 'bg-zinc-600/20 text-zinc-400', border: 'border-zinc-600/50' };
    }
};

const highlightProblematicPhrase = (text: string, phrase?: string) => {
    if (!phrase || !text.includes(phrase)) {
        return text;
    }
    const parts = text.split(new RegExp(`(${phrase})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === phrase.toLowerCase() ? (
                    <mark key={i} className="bg-amber-500/30 text-amber-200 rounded px-1 py-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    );
};




// --- MAIN DASHBOARD COMPONENT ---
const Dashboard: React.FC = () => {
    const [textToAnalyze, setTextToAnalyze] = useState('');
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rules, setRules] = useState<Rule[]>([]);
    const [newRule, setNewRule] = useState({ category: '', action: 'FLAG' as 'FLAG' | 'BLOCK' });
    const [simulationReport, setSimulationReport] = useState<SimulatedAction[] | null>(null);

    // Fetch initial rules from backend on component mount
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/rules`);
                if (!response.ok) throw new Error('Failed to fetch rules.');
                const data = await response.json();
                setRules(data);
            } catch (err: any) {
                setError(`Failed to load rules: ${err.message}`);
            }
        };
        fetchRules();
    }, []);

    const handleAnalyze = async () => {
        if (!textToAnalyze.trim()) return;
        setIsLoading(true);
        setError(null);
        setResults([]);
        setSimulationReport(null);

        const lines = textToAnalyze.trim().split('\n').filter(line => line.trim() !== '');
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lines }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            }

            const { analysis, simulation } = await response.json();
            setResults(analysis);
            setSimulationReport(simulation);

        } catch (err: any) {
            setError(`An error occurred: ${err.message || 'Check if the backend server is running.'}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRule = async () => {
        if (!newRule.category.trim()) return;
        try {
            const response = await fetch(`${BACKEND_URL}/api/rules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: newRule.category.trim().toUpperCase(),
                    action: newRule.action,
                }),
            });
            if (!response.ok) throw new Error('Failed to add rule.');
            const addedRule = await response.json();
            setRules([...rules, addedRule]);
            setNewRule({ category: '', action: 'FLAG' });
        } catch (err: any) {
            setError(`Error adding rule: ${err.message}`);
        }
    };

    const handleDeleteRule = async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/rules/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete rule.');
            setRules(rules.filter(rule => rule.id !== id));
        } catch (err: any) {
            setError(`Error deleting rule: ${err.message}`);
        }
    };
    
    const simulationStats = simulationReport ? {
        blocked: simulationReport.filter(r => r.action === 'BLOCK').length,
        flagged: simulationReport.filter(r => r.action === 'FLAG').length,
    } : null;
    
    const analysisSummary = useMemo(() => {
        if (results.length === 0) return null;
        return results.reduce((acc, r) => {
            acc[r.decision] = (acc[r.decision] || 0) + 1;
            return acc;
        }, {} as Record<'ALLOW' | 'FLAG' | 'BLOCK', number>);
    }, [results]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                
                {/* --- LEFT COLUMN --- */}
                <div className="xl:col-span-2 flex flex-col gap-8 sticky top-24">
                    <Card title="Moderator's Co-pilot" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <textarea
                                    value={textToAnalyze}
                                    onChange={(e) => setTextToAnalyze(e.target.value)}
                                    className="w-full h-40 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                    placeholder="Paste comments here, one per line..."
                                    aria-label="Content to analyze"
                                />
                                {textToAnalyze.length === 0 && (
                                    <button 
                                        onClick={() => setTextToAnalyze(SAMPLE_DATA)}
                                        className="absolute bottom-3 right-3 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold px-2 py-1 rounded-md transition-colors"
                                    >
                                        Load Sample Data
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || textToAnalyze.trim().length === 0}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center self-start transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                     Analyzing...
                                    </>
                                ) : 'Analyze Content'}
                            </button>
                            {error && <p className="text-red-400 text-sm mt-2 bg-red-500/10 p-2 rounded-md">{error}</p>}
                        </div>
                    </Card>

                    <Card title="Automation Engine (The Guard)" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3.414A1 1 0 0110 3h4a1 1 0 011 1v2.586A1 1 0 0114.586 7L12 9.586 9.414 7A1 1 0 019 6.586V3.414z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>}>
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 -mr-2">
                             {rules.map(rule => {
                                const actionAppearance = getDecisionAppearance(rule.action);
                                return (
                                <div key={rule.id} className="flex justify-between items-center bg-zinc-950/70 p-2 rounded-md text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${actionAppearance.badge}`}>{rule.action}</span>
                                        <span>if category is <strong>{rule.category}</strong></span>
                                    </div>
                                    <button onClick={() => handleDeleteRule(rule.id)} className="text-zinc-500 hover:text-red-400 transition-colors" aria-label={`Delete rule for ${rule.category}`}>
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            )})}
                        </div>
                        <div className="flex gap-2 items-stretch bg-zinc-950/70 p-2 rounded-md">
                            <input 
                                type="text" 
                                value={newRule.category}
                                onChange={e => setNewRule({...newRule, category: e.target.value})}
                                placeholder="New Category (e.g., INSULT)"
                                className="flex-grow bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                            />
                            <select value={newRule.action} onChange={e => setNewRule({...newRule, action: e.target.value as 'FLAG' | 'BLOCK'})} className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none">
                                <option value="FLAG">Flag</option>
                                <option value="BLOCK">Block</option>
                            </select>
                            <button onClick={handleAddRule} disabled={!newRule.category.trim()} className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-md text-sm font-medium disabled:bg-zinc-600 flex items-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </Card>
                </div>
                
                {/* --- RIGHT COLUMN --- */}
                <div className="xl:col-span-3 flex flex-col gap-8">
                    <Card title="Triage Results" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
                        {isLoading ? (
                             <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-zinc-900/70 p-4 rounded-lg animate-pulse">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                                            <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                                        </div>
                                        <div className="h-5 bg-zinc-700 rounded w-full mb-2"></div>
                                        <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                {analysisSummary && (
                                    <div className="flex justify-around text-center mb-4 border-b border-zinc-700 pb-4">
                                        <div><p className="text-2xl font-bold text-green-400">{analysisSummary.ALLOW || 0}</p><p className="text-xs text-zinc-400">Allowed by AI</p></div>
                                        <div><p className="text-2xl font-bold text-amber-400">{analysisSummary.FLAG || 0}</p><p className="text-xs text-zinc-400">Flagged by AI</p></div>
                                        <div><p className="text-2xl font-bold text-red-400">{analysisSummary.BLOCK || 0}</p><p className="text-xs text-zinc-400">Blocked by AI</p></div>
                                    </div>
                                )}
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 -mr-2">
                                    {results.map((r, i) => {
                                        const appearance = getDecisionAppearance(r.decision);
                                        return (
                                            <div key={i} className={`bg-zinc-950/70 p-4 rounded-lg border-l-4 ${appearance.border} transition-all`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${appearance.badge}`}>{r.decision}</span>
                                                    <div className="flex gap-1 flex-wrap justify-end">
                                                        {r.categories.map(cat => <span key={cat} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{cat}</span>)}
                                                    </div>
                                                </div>
                                                <p className="text-zinc-200 mb-2 leading-relaxed">{highlightProblematicPhrase(r.originalText, r.problematicPhrase)}</p>
                                                <p className="text-xs text-zinc-400"><strong>Reason:</strong> {r.reason}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 text-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.75-1-2.402l-.547-.547z" /></svg>
                                <p className="mt-2 font-semibold">Analysis results will appear here.</p>
                                <p className="text-sm">Enter content and click "Analyze" to begin.</p>
                            </div>
                        )}
                    </Card>

                    <Card title="Analytics Summary" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
                        {simulationReport && simulationReport.length > 0 ? (
                            <div className="space-y-4">
                                {simulationStats && (
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-red-500/10 p-4 rounded-lg">
                                        <AnimatedCounter value={simulationStats.blocked} className="text-3xl font-bold text-red-400" />
                                        <p className="text-sm font-semibold text-red-400/80">Blocked by Rules</p>
                                    </div>
                                    <div className="bg-amber-500/10 p-4 rounded-lg">
                                        <AnimatedCounter value={simulationStats.flagged} className="text-3xl font-bold text-amber-400" />
                                        <p className="text-sm font-semibold text-amber-400/80">Flagged by Rules</p>
                                    </div>
                                </div>
                                )}
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 -mr-2">
                                     <h3 className="font-bold text-lg text-zinc-300 pt-2">{simulationReport.length} Action(s) Simulated</h3>
                                     {simulationReport.map((item, i) => {
                                         const actionAppearance = getDecisionAppearance(item.action);
                                         return (
                                            <div key={i} className={`bg-zinc-950/70 p-3 rounded-md text-sm border-l-2 ${actionAppearance.border}`}>
                                                <p><strong className={`font-bold ${actionAppearance.badge} px-1.5 py-0.5 rounded`}>{item.action}:</strong> <span className="text-zinc-300">"{item.originalText}"</span></p>
                                                <p className="text-zinc-400 mt-1 pl-1 border-l border-zinc-700"><strong>Rule Matched:</strong> Category <span className="font-semibold text-zinc-300">{item.matchedRule.category}</span></p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-10 text-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <p className="mt-2 font-semibold">Simulation report will appear here.</p>
                                <p className="text-sm">Click "Analyze Content" to generate a report.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;