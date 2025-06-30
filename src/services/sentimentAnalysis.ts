import { pipeline, Pipeline, PipelineType } from '@xenova/transformers';

// Specify the model for sentiment analysis
const SENTIMENT_MODEL_NAME = 'cardiffnlp/twitter-roberta-base-sentiment';
// It's good practice to explicitly define the task if known, though pipeline often infers it.
const SENTIMENT_TASK: PipelineType = 'text-classification';

interface PipelineProgressStatus {
  status: string;
  name: string;
  file: string;
  progress: number;
  loaded: number;
  total: number;
}

class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;
  private classifier: Pipeline | null = null;
  private loadingPromise: Promise<void> | null = null;


  private constructor() {
    // Start initialization, but don't block constructor
    this.loadingPromise = this.init();
  }

  public static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
    }
    return SentimentAnalysisService.instance;
  }

  private async init(): Promise<void> {
    try {
      console.log(`Initializing sentiment analysis model: ${SENTIMENT_MODEL_NAME}`);
      // Load the specific sentiment analysis model
      this.classifier = await pipeline(SENTIMENT_TASK, SENTIMENT_MODEL_NAME, {
        quantized: true, // Attempt to load a quantized version
        progress_callback: (progress: PipelineProgressStatus) => {
          console.log(`Sentiment model (${SENTIMENT_MODEL_NAME}) loading: status: ${progress.status}, file: ${progress.file}, progress: ${progress.progress}%`);
        },
      });
      console.log(`Sentiment analysis model ${SENTIMENT_MODEL_NAME} loaded successfully.`);
    } catch (error) {
      console.error(`Failed to load sentiment analysis model ${SENTIMENT_MODEL_NAME}:`, error);
      // Depending on requirements, you might want to throw the error
      // or set classifier to null and handle it in the analyze method.
      this.classifier = null;
      throw error; // Propagate error to inform getInstance or analyze calls
    }
  }

  // Ensure the model is loaded before analyzing
  private async ensureModelLoaded(): Promise<void> {
    if (!this.classifier && this.loadingPromise) {
      await this.loadingPromise; // Wait for the initial loading attempt
    }
    if (!this.classifier) {
        // This means initial loading failed or was never called (should not happen with current getInstance)
        console.error("Sentiment model is not loaded and no loading process is active. Attempting re-init.");
        this.loadingPromise = this.init(); // Attempt to re-initialize
        await this.loadingPromise;
        if(!this.classifier){
            throw new Error("Sentiment analysis model failed to load after re-attempt.");
        }
    }
  }


  public async analyze(text: string): Promise<any> {
    await this.ensureModelLoaded();

    if (!this.classifier) {
      console.error('Sentiment analysis classifier is not available.');
      // Return a structured error or throw, depending on desired error handling
      return { error: 'Sentiment model not loaded', label: 'neutral', score: 0 };
    }

    try {
      const result = await this.classifier(text);
      return result;
    } catch (error) {
      console.error(`Error during sentiment analysis for text "${text}":`, error);
      // Fallback or re-throw
      return { error: 'Analysis failed', label: 'neutral', score: 0 };
    }
  }
}

export default SentimentAnalysisService;
