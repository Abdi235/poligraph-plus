import { pipeline, Pipeline } from '@xenova/transformers';

class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;
  private classifier: Pipeline | null = null;

  private constructor() {}

  public static async getInstance(): Promise<SentimentAnalysisService> {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
      await SentimentAnalysisService.instance.init();
    }
    return SentimentAnalysisService.instance;
  }

  private async init() {
    // Load the sentiment analysis model
    // Using a more general model for now, will update to cardiffnlp/twitter-roberta-base-sentiment
    // if direct compatibility with transformers.js is confirmed.
    // For now, 'sentiment-analysis' will use a default model like distilbert-base-uncased-finetuned-sst-2-english
    this.classifier = await pipeline('sentiment-analysis');
  }

  public async analyze(text: string): Promise<any> {
    if (!this.classifier) {
      await this.init();
    }
    if (this.classifier) {
      return this.classifier(text);
    }
    return null;
  }
}

export default SentimentAnalysisService;
