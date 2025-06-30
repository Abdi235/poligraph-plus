// Placeholder for keyword extraction service
// Will be implemented with distilbert-base-uncased + keyword-rank or keybert

class KeywordExtractionService {
  private static instance: KeywordExtractionService;

  private constructor() {}

  public static getInstance(): KeywordExtractionService {
    if (!KeywordExtractionService.instance) {
      KeywordExtractionService.instance = new KeywordExtractionService();
    }
    return KeywordExtractionService.instance;
  }

  public async extract(text: string): Promise<string[]> {
    // Placeholder implementation
    console.log('Keyword extraction service called with text:', text);
    // Simulate keyword extraction
    const keywords = text.toLowerCase().split(/\s+/).filter(word => word.length > 4);
    return Promise.resolve(keywords.slice(0, 5)); // Return top 5 simple keywords
  }
}

export default KeywordExtractionService;
