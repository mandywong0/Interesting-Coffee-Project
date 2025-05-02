import { Cafe } from "../pages/Home/Home";

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
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing. Please add it to your .env file as REACT_APP_OPENAI_API_KEY");
      throw new Error("API key missing");
    }

    const useMockAPI = 
      process.env.REACT_APP_MOCK_API === 'true' || 
      (window as any).REACT_APP_MOCK_API === 'true' ||
      localStorage.getItem('MOCK_API') === 'true';
      
    if (useMockAPI) {
      console.log("Using mock search response (from env or localStorage setting)");
      return mockSearchResponse(query, cafes);
    }

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

    console.log(`Sending search request to OpenAI for query: "${query}"`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a cafe recommendation assistant. 
            Your job is to match user queries with cafe information and return relevant cafes.
            You'll receive a user query, a list of cafes with their details, and user preferences.
            
            IMPORTANT: Return ONLY raw JSON without any markdown, explanation, or code blocks.
            
            For each cafe, assign a relevance score from 0-100, with 100 being the most relevant.
            Base your scoring on how well the cafe matches the user's query, considering:
            - Cafe name, about section, and tags
            - Vibe tags that describe the cafe atmosphere
            - Reviews that might mention what the user is looking for
            - Unique menu items and regular menu items
            
            Response format (return ONLY this JSON array, no other text):
            [{"cafeId": 1, "relevanceScore": 85}, {"cafeId": 2, "relevanceScore": 42}]`,
          },
          {
            role: "user",
            content: `Query: "${query}"
            User Preferences: ${JSON.stringify(userPreferences)}
            Cafe data: ${JSON.stringify(cafeInfo)}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`Failed to fetch from OpenAI API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Received response from OpenAI");
    
    let jsonContent = content;
    try {
      if (content.includes("```json") || content.includes("```")) {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1].trim();
        }
      }
      
      if (!jsonContent.startsWith('[')) {
        const arrayRegex = new RegExp('\\[(.|\n|\r)*?\\]');
        const jsonMatch = content.match(arrayRegex);
        if (jsonMatch) {
          jsonContent = jsonMatch[0];
        }
      }
      
      jsonContent = jsonContent.replace(/[^\x20-\x7E]/g, '');
      
      let searchResults: SearchResult[];
      try {
        searchResults = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.log("Falling back to mock search for query:", query);
        return mockSearchResponse(query, cafes);
      }
      
      const weightedResults = searchResults.map(result => {
        const cafe = cafes.find(c => c.id === result.cafeId);
        if (!cafe) return result;
        
        let preferenceBonus = 0;
        
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
        
        const weightedScore = Math.min(result.relevanceScore + Math.min(preferenceBonus, 30), 100);
        
        return {
          ...result,
          relevanceScore: weightedScore
        };
      });
      
      weightedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      const relevantResults = weightedResults.filter(result => result.relevanceScore > 30);
      
      const scoresMap = new Map<number, number>();
      relevantResults.forEach(result => {
        const scoreOutOfTen = Math.round((result.relevanceScore / 10) * 10) / 10;
        scoresMap.set(result.cafeId, scoreOutOfTen);
      });
      
      const matchedCafes = relevantResults.map(result => 
        cafes.find(cafe => cafe.id === result.cafeId)
      ).filter(Boolean) as Cafe[];
      
      return {
        cafes: matchedCafes,
        scores: scoresMap
      };
    } catch (error) {
      console.error("Error parsing response from OpenAI:", error);
      console.log("Raw response content:", content);
      throw error;
    }
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

const mockSearchResponse = (query: string, cafes: Cafe[]): { cafes: Cafe[], scores: Map<number, number> } => {
  console.log("Using mock search response for:", query);
  
  const keywords = query.toLowerCase().split(/\s+/);
  const matches = cafes.slice(0, 10).map(cafe => {
    let score = 5;
    
    keywords.forEach(keyword => {
      if (cafe.name.toLowerCase().includes(keyword)) score += 2;
      
      if (cafe.about && cafe.about.toLowerCase().includes(keyword)) score += 1.5;
      
      if (cafe.tags.some(tag => tag.toLowerCase().includes(keyword))) score += 1;
      
      if (cafe.vibeTags.some(tag => tag.toLowerCase().includes(keyword))) score += 2;
      
      if (cafe.uniqueItems.some(item => item.toLowerCase().includes(keyword))) score += 1;
    });
    
    score = Math.min(score, 10);
    
    return {
      cafe,
      score
    };
  });
  
  const sortedMatches = matches
    .sort((a, b) => b.score - a.score)
    .filter(match => match.score > 5);
  
  const scoresMap = new Map<number, number>();
  sortedMatches.forEach(match => {
    scoresMap.set(match.cafe.id, match.score);
  });
  
  return {
    cafes: sortedMatches.map(match => match.cafe),
    scores: scoresMap
  };
}; 