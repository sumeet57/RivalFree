import { getJson } from "serpapi";
import { ApiError } from "../utils/api-response.js";

export const executeSerpApiSearch = async (query) => {
  try {
    const response = await getJson({
      engine: "google",
      q: query,
      api_key: process.env.SERPAPI_API_KEY,
    });

    return {
      organicResults: response.organic_results?.slice(0, 10).map((item) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
      })) || [],
      relatedSearches: response.related_searches || [],
    };
  } catch (error) {
    throw new ApiError(500, `SerpApi execution failed: ${error.message}`);
  }
};