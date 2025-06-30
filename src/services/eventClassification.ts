import { pipeline, Pipeline, PipelineType } from '@xenova/transformers';

// Using a zero-shot classification model for event classification.
// Model like 'facebook/bart-large-mnli' or a distilled version can work.
// Xenova/distilbert-base-uncased-mnli is a smaller alternative.
const EVENT_MODEL_NAME = 'Xenova/distilbert-base-mnli';
const EVENT_TASK: PipelineType = 'zero-shot-classification';
const CANDIDATE_LABELS = ['Sports', 'Politics', 'News', 'Technology', 'Entertainment', 'Finance', 'General'];

class EventClassificationService {
  private static instance: EventClassificationService;
  private classifier: Pipeline | null = null;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {
    this.loadingPromise = this.init();
  }

  public static getInstance(): EventClassificationService {
    if (!EventClassificationService.instance) {
      EventClassificationService.instance = new EventClassificationService();
    }
    return EventClassificationService.instance;
  }

  private async init(): Promise<void> {
    try {
      console.log(`Initializing event classification model: ${EVENT_MODEL_NAME}`);
      this.classifier = await pipeline(EVENT_TASK, EVENT_MODEL_NAME, {
        quantized: true, // Attempt to load a quantized version
        progress_callback: (progress: any) => {
          console.log(`Event model (${EVENT_MODEL_NAME}) loading:`, progress);
        },
      });
      console.log(`Event classification model ${EVENT_MODEL_NAME} loaded successfully.`);
    } catch (error) {
      console.error(`Failed to load event classification model ${EVENT_MODEL_NAME}:`, error);
      this.classifier = null;
      throw error;
    }
  }

  private async ensureModelLoaded(): Promise<void> {
    if (!this.classifier && this.loadingPromise) {
      await this.loadingPromise;
    }
    if (!this.classifier) {
        console.error("Event classification model not loaded. Attempting re-init.");
        this.loadingPromise = this.init();
        await this.loadingPromise;
        if(!this.classifier){
            throw new Error("Event classification model failed to load after re-attempt.");
        }
    }
  }

  public async classify(text: string): Promise<string> {
    await this.ensureModelLoaded();

    if (!this.classifier || !text.trim()) {
      console.warn('Event classifier not available or empty text provided.');
      return 'Other'; // Default category
    }

    try {
      const result = await this.classifier(text, CANDIDATE_LABELS);
      // The result for zero-shot classification typically includes a sequence (the input text),
      // labels (our candidate_labels), and scores.
      // We want the label with the highest score.
      if (result && result.labels && result.scores && result.labels.length > 0) {
        // Find the index of the highest score
        // let highestScore = 0;
        // let bestLabel = 'Other';
        // result.scores.forEach((score: number, index: number) => {
        //   if (score > highestScore) {
        //     highestScore = score;
        //     bestLabel = result.labels[index];
        //   }
        // });
        // The pipeline usually returns labels sorted by score.
        return result.labels[0];
      }
      return 'Other'; // Fallback
    } catch (error) {
      console.error(`Error during event classification for text "${text}":`, error);
      return 'Other'; // Fallback category
    }
  }
}

export default EventClassificationService;
