import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AnalyzeJobDto } from './dto/analyze-job.dto';

type AiJobAnalysis = {
  summary: string;
  keySkills: string[];
  toolsAndTechnologies: string[];
  responsibilities: string[];
  resumeTips: string[];
  followUpEmail: string;
};

@Injectable()
export class AiService {
  private readonly model: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing required env variable: GEMINI_API_KEY');
    }

    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async analyzeJob(dto: AnalyzeJobDto): Promise<AiJobAnalysis> {
    const prompt = `
Analyze the following software job description.

Return ONLY valid JSON. Do not include markdown. Do not include explanation.

JSON structure:
{
  "summary": "3-4 sentence summary of the job",
  "keySkills": ["skill1", "skill2", "skill3"],
  "toolsAndTechnologies": ["tool1", "tool2", "tool3"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "resumeTips": ["tip1", "tip2", "tip3"],
  "followUpEmail": "professional follow-up email draft"
}

Job description:
${dto.jobDescription}
`;

    try {
      const { GoogleGenAI } = await import('@google/genai');

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
      });

      const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text ?? '';

      console.log('Gemini raw response:', text);

      return this.parseJson(text);
    } catch (error: any) {
      console.error('Gemini AI Error:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        details: error?.details,
        stack: error?.stack,
      });

      throw new InternalServerErrorException(
        error?.message ?? 'AI analysis failed. Check Gemini API key/model and try again.',
      );
    }
  }

  private parseJson(text: string): AiJobAnalysis {
    const cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new InternalServerErrorException('AI returned invalid JSON.');
    }

    const jsonText = cleaned.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(jsonText) as AiJobAnalysis;
    } catch {
      throw new InternalServerErrorException('AI returned invalid JSON.');
    }
  }
}