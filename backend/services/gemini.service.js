import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ApiError } from "../utils/api-response.js";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.2,
});

const jsonParser = new JsonOutputParser();

export const generateQueryPlan = async (userPrompt) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 1 (Query Planner) for RivalFree.
Analyze the following user input and compress it into a single, highly-optimized SerpApi search query.
Use search operators (like site:, OR, quotes) where necessary to yield high-density market results.

{format_instructions}

User Input: "{userPrompt}"`
    );

    const chain = prompt.pipe(llm).pipe(jsonParser);

    return await chain.invoke({
      userPrompt,
      format_instructions: jsonParser.getFormatInstructions(),
    });
  } catch (error) {
    throw new ApiError(500, `Query Planning Failed: ${error.message}`);
  }
};

export const mapCompetitorsAndThreats = async (serpResults) => {
  try {
    const prompt = PromptTemplate.fromTemplate(
      `You are Agent 2 (Competitor & Threat Mapper) for RivalFree.
Analyze the provided web search data and extract direct/indirect competitors, market saturation, and potential threats.

{format_instructions}

SERP Data:
{serpResults}`
    );

    const chain = prompt.pipe(llm).pipe(jsonParser);

    return await chain.invoke({
      serpResults: JSON.stringify(serpResults),
      format_instructions: jsonParser.getFormatInstructions(),
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

{format_instructions}

SERP Data:
{serpResults}`
    );

    const chain = prompt.pipe(llm).pipe(jsonParser);

    return await chain.invoke({
      serpResults: JSON.stringify(serpResults),
      format_instructions: jsonParser.getFormatInstructions(),
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

{format_instructions}

Initial Idea: "{userPrompt}"
Competitor Analysis: {competitorData}
Feature Voids: {voidData}`
    );

    const chain = prompt.pipe(llm).pipe(jsonParser);

    return await chain.invoke({
      userPrompt,
      competitorData: JSON.stringify(competitorData),
      voidData: JSON.stringify(voidData),
      format_instructions: jsonParser.getFormatInstructions(),
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