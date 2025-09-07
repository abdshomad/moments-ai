export enum GenerationMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
}

export interface GenerationResult {
  id: string;
  prompt: string;
  imageUrl: string;
  revisedPrompt?: string;
  altText?: string;
  audioUrl?: string;
  audioPrompt?: string;
  videoUrl?: string;
}
