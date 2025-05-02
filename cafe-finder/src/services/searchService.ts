import { Cafe } from "../pages/Home/Home";

// Your OpenAI API key should be stored securely, preferably in an environment variable
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

interface SearchResult {
  cafeId: number;
  relevanceScore: number;
}

interface UserPreferences {
  preferredSeating: "indoor" | "outdoor";
  preferredPayment: "cash" | "creditCard";
  preferredNoise: "quiet" | "cafeSounds";
  pricePreference: "$" | "$$";
  wheelchairAccessible: boolean;
}

export const searchCafesWithNaturalLanguage = async (
  query: string,
  cafes: Cafe[],
  userPreferences: UserPreferences
): Promise<{ cafes: Cafe[], scores: Map<number, number> }> => {
  try {
    // Prepare cafe data for the API
    const cafeInfo = cafes.map((cafe) => ({
      id: cafe.id,
      name: cafe.name,
      about: cafe.about,
      tags: cafe.tags,
      vibeTags: cafe.vibeTags,
      reviews: cafe.reviews,
      uniqueItems: cafe.uniqueItems,
      menuItems: cafe.menuItems,
      priceRange: cafe.priceRange,
      amenities: cafe.amenities,
    }));

    // Prepare the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // You can upgrade to gpt-4 for better results
        messages: [
          {
            role: "system",
            content: `You are a cafe recommendation assistant. 
            Your job is to match user queries with cafe information and return relevant cafes.
            You'll receive a user query, a list of cafes with their details, and user preferences.
            For each cafe, assign a relevance score from A positive number between 0-100, with 100 being the most relevant.
            Base your scoring on how well the cafe matches the user's query, considering the following:
            - Cafe name, about section, and tags
            - Vibe tags that describe the cafe atmosphere
            - Reviews that might mention what the user is looking for
            - Unique menu items and regular menu items
            Return only JSON in this format: [{"cafeId": 1, "relevanceScore": 85}, {"cafeId": 2, "relevanceScore": 42}]`,
          },
          {
            role: "user",
            content: `Query: "${query}"
            User Preferences: ${JSON.stringify(userPreferences)}
            Cafe data: ${JSON.stringify(cafeInfo)}`,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent results
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from OpenAI API");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the response to get cafe IDs and scores
    const searchResults: SearchResult[] = JSON.parse(content);
    
    // Apply additional weighting based on user preferences
    const weightedResults = searchResults.map(result => {
      const cafe = cafes.find(c => c.id === result.cafeId);
      if (!cafe) return result;
      
      let preferenceBonus = 0;
      
      // Add preference bonuses
      if (userPreferences.preferredSeating === "outdoor" && cafe.amenities.outdoorSeating) {
        preferenceBonus += 10;
      } else if (userPreferences.preferredSeating === "indoor" && cafe.amenities.indoorSeating) {
        preferenceBonus += 10;
      }
      
      if (userPreferences.preferredPayment === "creditCard" && cafe.amenities.creditCards) {
        preferenceBonus += 10;
      }
      
      if (userPreferences.preferredNoise === "quiet" && 
          (cafe.vibeTags.includes("quiet") || cafe.vibeTags.includes("peaceful") || cafe.vibeTags.includes("calm"))) {
        preferenceBonus += 10;
      }
      
      if (userPreferences.pricePreference === cafe.priceRange) {
        preferenceBonus += 10;
      }
      
      if (userPreferences.wheelchairAccessible === true && cafe.amenities.wheelchairAccessible) {
        preferenceBonus += 10;
      }
      
      // Apply the preference bonus (capped at 30 points)
      const weightedScore = Math.min(result.relevanceScore + Math.min(preferenceBonus, 30), 100);
      
      return {
        ...result,
        relevanceScore: weightedScore
      };
    });
    
    // Sort by relevance score (highest first)
    weightedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Filter out cafes with low relevance (optional, adjust threshold as needed)
    const relevantResults = weightedResults.filter(result => result.relevanceScore > 30);
    
    // Create a scores map to convert to 0-10 scale
    const scoresMap = new Map<number, number>();
    relevantResults.forEach(result => {
      // Convert the 0-100 scale to 0-10 scale, rounded to 1 decimal place
      const scoreOutOfTen = Math.round((result.relevanceScore / 10) * 10) / 10;
      scoresMap.set(result.cafeId, scoreOutOfTen);
    });
    
    // Map results back to full cafe objects
    const matchedCafes = relevantResults.map(result => 
      cafes.find(cafe => cafe.id === result.cafeId)
    ).filter(Boolean) as Cafe[];
    
    return {
      cafes: matchedCafes,
      scores: scoresMap
    };
  } catch (error) {
    console.error("Search error:", error);
    return { cafes: [], scores: new Map() };
  }
}; 