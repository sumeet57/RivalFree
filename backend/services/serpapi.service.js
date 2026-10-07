import { getJson } from "serpapi";
import { ApiError } from "../utils/api-response.js";
import { env } from "../config/env.js";

export const executeSerpApiSearch = async (queryInput) => {
  try {
    let searchQuery = "";

    if (typeof queryInput === "string") {
      searchQuery = queryInput;
    } else if (typeof queryInput === "object" && queryInput !== null) {
      searchQuery = queryInput.query || queryInput.searchQuery || queryInput.q || "";
    }

    searchQuery = searchQuery.trim();

    if (!searchQuery) {
      throw new ApiError(400, `Search query string is missing or invalid. Received: ${JSON.stringify(queryInput)}`);
    }

    if (!env.SERPAPI_API_KEY) {
      throw new ApiError(500, "SERPAPI_API_KEY environment variable is not defined");
    }

    const response = await getJson({
      engine: "google",
      q: searchQuery,
      api_key: env.SERPAPI_API_KEY,
      timeout: 60000,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return {
      organicResults: response.organic_results?.slice(0, 10).map((item) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
      })) || [],
      relatedSearches: response.related_searches || [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new ApiError(500, `SerpApi execution failed: ${message}`);
  }
};