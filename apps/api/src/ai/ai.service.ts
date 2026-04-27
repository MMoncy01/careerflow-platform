import { Injectable } from '@nestjs/common';
import { AnalyzeJobDto } from './dto/analyze-job.dto';

type AiJobAnalysis = {
  summary: string;
  atsKeywords: string[];
  keySkills: string[];
  toolsAndTechnologies: string[];
  responsibilities: string[];
  qualifications: string[];
  resumeTips: string[];
  skillGaps: string[];
  followUpEmail: string;
  recruiterMessage: string;
  interviewQuestions: string[];
  projectTalkingPoints: string[];
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
You are an expert Canadian software engineering career coach and resume strategist.

Analyze the following job description for a junior/entry-level software developer candidate.

Return ONLY valid JSON. Do not include markdown. Do not include explanation outside JSON.

JSON structure:
{
  "summary": "3-4 sentence plain English summary of the job",
  "atsKeywords": ["important ATS keyword 1", "important ATS keyword 2"],
  "keySkills": ["skill1", "skill2"],
  "toolsAndTechnologies": ["tool1", "tool2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "qualifications": ["qualification1", "qualification2"],
  "resumeTips": ["specific resume tailoring tip1", "specific resume tailoring tip2"],
  "skillGaps": ["possible gap1", "possible gap2"],
  "followUpEmail": "professional follow-up email after applying",
  "recruiterMessage": "short LinkedIn recruiter/referral message",
  "interviewQuestions": ["question1", "question2", "question3"],
  "projectTalkingPoints": ["talking point1", "talking point2"]
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
      return this.parseJson(text);
    } catch (error: any) {
      console.error('Gemini AI Error:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
      });

      return this.fallbackAnalysis(dto.jobDescription);
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
      return this.fallbackAnalysis(text);
    }

    const jsonText = cleaned.slice(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(jsonText) as AiJobAnalysis;
    } catch {
      return this.fallbackAnalysis(text);
    }
  }

  private fallbackAnalysis(jobDescription: string): AiJobAnalysis {
    const lower = jobDescription.toLowerCase();

    const tools = [
      'React',
      'TypeScript',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'CI/CD',
      'AWS',
      'Azure',
      'REST APIs',
      'Agile',
      'SQL',
      'Python',
      'JavaScript',
    ].filter((tool) => lower.includes(tool.toLowerCase()));

    const detectedTools =
      tools.length > 0 ? tools : ['JavaScript', 'REST APIs', 'SQL', 'Agile'];

    return {
      summary:
        'This role focuses on contributing to software delivery by building, maintaining, and improving applications or data-driven systems. The job description emphasizes technical problem-solving, collaboration with cross-functional teams, and the ability to work with modern development tools and workflows. A strong application should highlight relevant project experience, practical implementation skills, and measurable technical impact.',

      atsKeywords: [
        ...detectedTools,
        'software development',
        'problem solving',
        'collaboration',
        'debugging',
        'application development',
      ],

      keySkills: [
        'Full-stack development',
        'API development',
        'Database design',
        'Debugging',
        'Version control',
        'Agile collaboration',
      ],

      toolsAndTechnologies: detectedTools,

      responsibilities: [
        'Build and maintain application features based on business requirements.',
        'Collaborate with developers, analysts, and stakeholders to deliver working software.',
        'Debug issues, improve reliability, and support production-ready workflows.',
        'Write clean, maintainable code and contribute to technical documentation.',
      ],

      qualifications: [
        'Hands-on experience with modern programming languages and web technologies.',
        'Understanding of databases, APIs, and software development lifecycle.',
        'Ability to learn quickly and work in an Agile team environment.',
      ],

      resumeTips: [
        'Highlight projects where you built secure full-stack features using React, Node/NestJS, and databases.',
        'Mention authentication, protected routes, API integration, and user-owned data if relevant.',
        'Use measurable wording such as “built”, “implemented”, “integrated”, “optimized”, and “tested”.',
        'Mirror important job keywords naturally in your project bullets and skills section.',
      ],

      skillGaps: [
        'Check whether the posting expects cloud deployment experience such as AWS or Azure.',
        'Check whether testing, CI/CD, or DevOps tools are required and prepare examples.',
        'Prepare a short explanation of how your projects match the role responsibilities.',
      ],

      followUpEmail:
        'Subject: Follow-Up on My Application\n\nHello,\n\nI hope you are doing well. I recently applied for this role and wanted to follow up to express my continued interest. My background includes hands-on experience with full-stack application development, API integration, database-backed systems, and project-based software delivery.\n\nI would welcome the opportunity to discuss how my skills and projects align with the requirements of this position.\n\nThank you for your time and consideration.\n\nBest regards,',

      recruiterMessage:
        'Hi, I came across this role and I’m very interested. I have hands-on project experience with full-stack development, REST APIs, authentication, database integration, and modern web technologies. I would appreciate the opportunity to connect and learn more about the position.',

      interviewQuestions: [
        'Can you explain a full-stack project you built and the architecture behind it?',
        'How do you handle authentication and protected routes in a web application?',
        'How would you debug an API endpoint that is returning an error?',
        'How do you design database relationships for user-owned data?',
        'Tell me about a time you learned a new technology quickly for a project.',
      ],

      projectTalkingPoints: [
        'Discuss CareerFlow as a secure multi-user job tracking platform with JWT authentication.',
        'Explain how protected APIs ensure users can only access their own application records.',
        'Highlight the analytics dashboard, follow-up tracking, and AI job description assistant.',
        'Mention the use of React, NestJS, Prisma, PostgreSQL, Docker, and Swagger documentation.',
      ],
    };
  }
}