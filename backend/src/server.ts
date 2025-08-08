
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Initialize rules array
let rules: Rule[] = [];

// --- TYPES ---
interface Rule {
    id: string;
    category: string;
    action: 'FLAG' | 'BLOCK';
}

interface AnalysisResult {
    originalText: string;
    decision: 'ALLOW' | 'FLAG' | 'BLOCK';
    reason: string;
    categories: string[];
    problematicPhrase?: string;
}

interface SimulatedAction {
    originalText: string;
    action: 'FLAG' | 'BLOCK';
    reason: string;
    matchedRule: Rule;
    analysis: AnalysisResult;
}

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- "THE GUARD" API ENDPOINTS ---

app.get('/api/rules', (req: ExpressRequest, res: ExpressResponse) => {
    res.status(200).json(rules);
});

app.post('/api/rules', (req: ExpressRequest, res: ExpressResponse) => {
    const { category, action } = req.body;
    if (!category || !action || !['FLAG', 'BLOCK'].includes(action)) {
        return res.status(400).json({ error: 'Invalid rule data. "category" and "action" ("FLAG" or "BLOCK") are required.' });
    }
    const newRule: Rule = {
        id: Date.now().toString(),
        category: category.trim().toUpperCase(),
        action,
    };
    rules.push(newRule);
    res.status(201).json(newRule);
});

app.delete('/api/rules/:id', (req: ExpressRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const initialLength = rules.length;
    rules = rules.filter(rule => rule.id !== id);
    if (rules.length === initialLength) {
        return res.status(404).json({ error: 'Rule not found.' });
    }
    res.status(204).send(); // No content
});


// --- CORE ANALYSIS API ENDPOINT ---
app.post('/api/analyze', async (req: ExpressRequest, res: ExpressResponse) => {
    const { lines } = req.body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({ error: 'Request body must be an array of strings called "lines".' });
    }
    
    if (!process.env.API_KEY) {
        console.error('API_KEY is not configured on the server.');
        return res.status(500).json({ error: 'API key is not configured on the server. Please check your .env file.' });
    }

    try {
        const analysisPromises = lines.map(line =>
            model.generateContent({
                contents: [{
                    role: 'user',
                    parts: [{
                        text: `Analyze the following user comment for guideline violations. Your response must be a single JSON object. The comment is: "${line}".
                        Format your response as a JSON with:
                        {
                            "decision": "ALLOW" | "FLAG" | "BLOCK",
                            "reason": "brief explanation",
                            "categories": ["category1", "category2"],
                            "problematicPhrase": "optional problematic text"
                        }`
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 1000,
                }
            })
        );

        const responses = await Promise.all(analysisPromises);
        
        const analysisResults: AnalysisResult[] = await Promise.all(
            responses.map(async (response, index: number) => {
                try {
                    const result = await response.response;
                    const text = result.text();
                    const parsed = JSON.parse(text.trim());
                    return { ...parsed, originalText: lines[index] };
                } catch (e) {
                    console.error(`Error parsing JSON for line: ${lines[index]}`, e);
                    return { 
                        originalText: lines[index], 
                        decision: 'FLAG' as const, 
                        reason: 'Failed to parse AI response.', 
                        categories: ['ERROR'], 
                        problematicPhrase: '' 
                    };
                }
            })
        );

        // --- SERVER-SIDE SIMULATION ---
        const simulationReport: SimulatedAction[] = [];
        analysisResults.forEach(result => {
            for (const category of result.categories) {
                const matchingRule = rules.find(rule => rule.category === category);
                if (matchingRule) {
                    simulationReport.push({
                        originalText: result.originalText,
                        action: matchingRule.action,
                        reason: result.reason,
                        matchedRule: matchingRule,
                        analysis: result
                    });
                    break; 
                }
            }
        });
        
        // --- COMBINED RESPONSE ---
        res.status(200).json({
            analysis: analysisResults,
            simulation: simulationReport
        });

    } catch (err: any) {
        console.error('Error calling Gemini API:', err);
        res.status(500).json({ error: `An error occurred during analysis: ${err.message || 'Unknown server error'}` });
    }
});


// --- START SERVER ---
app.listen(port, () => {
    console.log(`Nirabhi AI backend server listening on http://localhost:${port}`);
});