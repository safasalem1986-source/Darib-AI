
export interface Slide {
  title: string;
  bullets: string[];
}

export interface AnalysisResult {
  lessonTitle: string;
  explanation: string;
  partsAndFunctions: string;
  examPoints: string[];
  ministerialTip: string;
  reviewQuestion: string;
  videoScenario?: string;
  infographicData?: string;
  summary?: string;
  presentation?: Slide[];
  mindMap?: string;
  teacherPlan?: string; // جديد: خطة درس
  worksheet?: string;   // جديد: ورقة عمل
}

export enum AnalysisMode {
  GENERAL = 'GENERAL',
  VIDEO = 'VIDEO',
  INFOGRAPHIC = 'INFOGRAPHIC',
  SUMMARY = 'SUMMARY',
  PRESENTATION = 'PRESENTATION',
  MIND_MAP = 'MIND_MAP',
  TEACHER_PLAN = 'TEACHER_PLAN',
  WORKSHEET = 'WORKSHEET'
}
