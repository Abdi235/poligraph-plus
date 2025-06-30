import { pipeline, Pipeline, PipelineType } from '@xenova/transformers';

// Using a Named Entity Recognition (NER) model as a proxy for keyword extraction
// This model identifies entities, which can often serve as keywords.
const KEYWORD_MODEL_NAME = 'Xenova/bert-base-NER';
const KEYWORD_TASK: PipelineType = 'token-classification';

interface PipelineProgressStatus {
  status: string;
  name: string;
  file: string;
  progress: number;
  loaded: number;
  total: number;
}

interface NerToken {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

class KeywordExtractionService {
  private static instance: KeywordExtractionService;
  private extractor: Pipeline | null = null;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {
    this.loadingPromise = this.init();
  }

  public static getInstance(): KeywordExtractionService {
    if (!KeywordExtractionService.instance) {
      KeywordExtractionService.instance = new KeywordExtractionService();
    }
    return KeywordExtractionService.instance;
  }

  private async init(): Promise<void> {
    try {
      console.log(`Initializing keyword extraction model: ${KEYWORD_MODEL_NAME}`);
      this.extractor = await pipeline(KEYWORD_TASK, KEYWORD_MODEL_NAME, {
        quantized: true, // Attempt to load a quantized version
        progress_callback: (progress: PipelineProgressStatus) => {
          console.log(`Keyword model (${KEYWORD_MODEL_NAME}) loading: status: ${progress.status}, file: ${progress.file}, progress: ${progress.progress}%`);
        },
      });
      console.log(`Keyword extraction model ${KEYWORD_MODEL_NAME} loaded successfully.`);
    } catch (error) {
      console.error(`Failed to load keyword extraction model ${KEYWORD_MODEL_NAME}:`, error);
      this.extractor = null;
      throw error;
    }
  }

  private async ensureModelLoaded(): Promise<void> {
    if (!this.extractor && this.loadingPromise) {
      await this.loadingPromise;
    }
     if (!this.extractor) {
      console.error("Keyword model is not loaded. Attempting re-init.");
      this.loadingPromise = this.init();
      await this.loadingPromise;
      if(!this.extractor){
          throw new Error("Keyword extraction model failed to load after re-attempt.");
      }
    }
  }

  public async extract(text: string): Promise<string[]> {
    await this.ensureModelLoaded();

    if (!this.extractor || !text.trim()) {
      console.warn('Keyword extractor not available or empty text provided.');
      return [];
    }

    try {
      const results: NerToken[] = await this.extractor(text, {
        // Group entities to get multi-word keywords if the model supports it well
        // For some NER models, you might need to process sub-word tokens.
        // This model seems to handle grouping fairly well.
      });

      // Filter and format results
      // We might want to filter by entity type (e.g., ORG, PER, LOC, MISC) or score
      const keywords = results
        .filter(token => token.score > 0.85 && token.entity_group !== 'O') // Filter out non-entities and low confidence
        .map(token => token.word)
        // Remove duplicates that might arise from sub-word tokens if not grouped well
        .filter((value, index, self) => self.indexOf(value) === index);

      // A simple way to merge sub-tokens into phrases if not done by pipeline:
      // This NER pipeline usually groups recognized entities.
      // If it didn't, one would iterate through tokens, identify sequences of B-TAG then I-TAG, and merge their 'word' parts.

      return keywords.slice(0, 7); // Return top N keywords
    } catch (error) {
      console.error(`Error during keyword extraction for text "${text}":`, error);
      return []; // Fallback to empty list
    }
  }
}

export default KeywordExtractionService;
