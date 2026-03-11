import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

const FeedbackAnalysisSchema = z.object({
    category: z
        .enum(['Bug', 'Feature Request', 'Performance', 'UX', 'Security', 'General'])
        .describe('The category of the feedback'),
    priority: z
        .enum(['Low', 'Medium', 'High', 'Critical'])
        .describe('The priority level of the feedback'),
    sentiment: z
        .enum(['Positive', 'Neutral', 'Negative'])
        .describe('The emotional sentiment expressed in the feedback'),
    team: z
        .enum(['Frontend', 'Backend', 'DevOps', 'Design', 'Product', 'Security'])
        .describe('The engineering/product team best suited to handle this feedback'),
});

export type FeedbackAnalysis = z.infer<typeof FeedbackAnalysisSchema>;

const prompt = PromptTemplate.fromTemplate(`
You are an intelligent feedback triage assistant for a software product company.

Analyze the following user feedback and extract structured metadata.

Feedback Title: {title}
Feedback Description: {description}

Instructions:
- category: Choose the most fitting category from: Bug, Feature Request, Performance, UX, Security, General
- priority: Assess urgency. Critical = system-breaking or security issue, High = major impact, Medium = moderate impact, Low = minor/cosmetic
- sentiment: Determine if the user sounds Positive, Neutral, or Negative
- team: Route to the best team: Frontend (UI/visual), Backend (API/data), DevOps (infra/deployment), Design (UX/design), Product (features/strategy), Security (auth/vulnerabilities)

Return a JSON object with these four fields only.
`);

let llmChain: ReturnType<typeof createChain> | null = null;

function createChain() {
    const modelName = 'gemini-2.5-flash';
    console.log(`[LLM] Initializing with model: ${modelName}`);

    const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY!,
        temperature: 0,
    });

    const structuredModel = model.withStructuredOutput(FeedbackAnalysisSchema);
    return prompt.pipe(structuredModel);
}

export async function analyzeFeedback(
    title: string,
    description: string
): Promise<FeedbackAnalysis> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('[LLM] GOOGLE_API_KEY not set or is placeholder — using default fallback values');
        return {
            category: 'General',
            priority: 'Medium',
            sentiment: 'Neutral',
            team: 'Product',
        };
    }

    try {
        if (!llmChain) {
            llmChain = createChain();
        }

        const result = await llmChain.invoke({ title, description });
        console.log('[LLM] Analysis result:', result);
        return result;
    } catch (error: any) {
        console.error('[LLM] Analysis failed EXCEPTION:');
        console.error('Status:', error?.status);
        console.error('Message:', error?.message);

        // Some errors are wrapped in a response object
        if (error?.response) {
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }

        if (error?.errorDetails) {
            console.error('Details:', JSON.stringify(error.errorDetails, null, 2));
        }

        // Return safe defaults on failure
        return {
            category: 'General',
            priority: 'Medium',
            sentiment: 'Neutral',
            team: 'Product',
        };
    }
}
