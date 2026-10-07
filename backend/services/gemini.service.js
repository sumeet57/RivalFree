import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ApiError } from "../utils/api-response.js";
import { env } from "../config/env.js";
import { z } from "zod";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: env.GEMINI_API_KEY,
  temperature: 0.2,
});

const queryPlanSchema = z.object({
  query: z.string().describe("The highly-optimized SerpApi search query"),
  reasoning: z.string().optional().describe("Brief reasoning for the search strategy"),
});

const competitorSchema = z.object({
  directCompetitors: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      link: z.string().optional(),
    })
  ),
  indirectCompetitors: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  threatLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  summary: z.string(),
});

const featureVoidSchema = z.object({
  missingFeatures: z.array(
    z.object({
      feature: z.string(),
      painPoint: z.string(),
      opportunityScore: z.number().min(1).max(10),
    })
  ),
  marketGaps: z.array(z.string()),
});

const roadmapSchema = z.object({
  positioningStrategy: z.string(),
  coreMVPFeatures: z.array(z.string()),
  differentiator: z.string(),
  recommendedSpec: z.string(),
});

export const generateQueryPlan = async (userPrompt) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 1 (Query Planner) for RivalFree.
Analyze the following user input and compress it into a single, highly-optimized SerpApi search query under 6 words.
Avoid over-constraining the query with too many complex site operators or nested OR statements.

User Input: "{userPrompt}"`
    );

    const structuredLlm = llm.withStructuredOutput(queryPlanSchema);
    const chain = prompt.pipe(structuredLlm);

    return await chain.invoke({ userPrompt });
  } catch (error) {
    throw new ApiError(500, `Query Planning Failed: ${error.message}`);
  }
};

export const mapCompetitorsAndThreats = async (serpResults) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 2 (Competitor & Threat Mapper) for RivalFree.
Analyze the provided web search data and extract direct/indirect competitors, market saturation, and potential threats.

SERP Data:
{serpResults}`
    );

    const structuredLlm = llm.withStructuredOutput(competitorSchema);
    const chain = prompt.pipe(structuredLlm);

    return await chain.invoke({
      serpResults: JSON.stringify(serpResults),
    });
  } catch (error) {
    throw new ApiError(500, `Competitor Mapping Failed: ${error.message}`);
  }
};

export const identifyFeatureVoids = async (serpResults) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 3 (Feature Void & Gap Identifier) for RivalFree.
Analyze the search results, user complaints, forum discussions, and review snippets to find what current market tools are missing.

SERP Data:
{serpResults}`
    );

    const structuredLlm = llm.withStructuredOutput(featureVoidSchema);
    const chain = prompt.pipe(structuredLlm);

    return await chain.invoke({
      serpResults: JSON.stringify(serpResults),
    });
  } catch (error) {
    throw new ApiError(500, `Feature Void Analysis Failed: ${error.message}`);
  }
};

export const generateExecutiveRoadmap = async (userPrompt, competitorData, voidData) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 4 (Executive Roadmap & Spec Draft) for RivalFree.
Based on the initial idea, competitor mapping, and feature voids, draft a positioning strategy and feature spec.

Initial Idea: "{userPrompt}"
Competitor Analysis: {competitorData}
Feature Voids: {voidData}`
    );

    const structuredLlm = llm.withStructuredOutput(roadmapSchema);
    const chain = prompt.pipe(structuredLlm);

    return await chain.invoke({
      userPrompt,
      competitorData: JSON.stringify(competitorData),
      voidData: JSON.stringify(voidData),
    });
  } catch (error) {
    throw new ApiError(500, `Roadmap Generation Failed: ${error.message}`);
  }
};

export const runParallelSynthesis = async (serpResults, userPrompt) => {
  try {
    const [competitors, voids] = await Promise.all([
      mapCompetitorsAndThreats(serpResults),
      identifyFeatureVoids(serpResults),
    ]);

    const roadmap = await generateExecutiveRoadmap(userPrompt, competitors, voids);

    return {
      competitors,
      voids,
      roadmap,
    };
  } catch (error) {
    throw new ApiError(500, `Parallel Multi-Agent Synthesis Failed: ${error.message}`);
  }
};