

export interface ExamPaper {
  id: string
  exam_id: string
  subject: {
    id: string
    name: string
    display_name: string
  }
  grade: {
    id: string
    name: string
  }
  paper_code?: string
  duration_minutes?: number
  total_marks: number
  questions_count: number
  paper_questions: ExamPaperQuestion[]
}

export interface ExamPaperQuestion {
  id: string
  exam_paper_id: string
  question_id: string
  order: number
  marks: number
  question: {
    id: string
    question_text: string
    question_type: string
    difficulty: string
    options?: string[]
    correct_answer?: number
  }
}

export interface ExamTypeInfo {
  key: string
  label: string
  description: string
  color: string
  icon: string
}


export type ExamPaperLite = {
  id: number;
  subject: { name: string; display_name: string };
  paper_code: string;                
  duration_minutes: number | null;   
  total_marks: number;
  questions_count: number;
};

export type ExamLite = {
  id: number;
  title: string;
  year: number;
  level: "JUNIOR" | "SENIOR";
  exam_type: "MAIN" | "MOCK" | "CAT" | "REVISION";
  source: string | null;              
  is_official: boolean;
  papers: ExamPaperLite[];           
};

export type ExamDetail = {
  id: number;
  title: string;
  year: number;
  level: "JUNIOR" | "SENIOR";
  exam_type: "MAIN" | "MOCK" | "CAT" | "REVISION";
  source: string | null;
  is_official: boolean;
  slug: string;
  papers: Array<{
    id: number;
    subject: number | { id: number; name: string; display_name: string };
    grade: number | { id: number; name: string; display_name: string } ;
    paper_code: string;
    duration_minutes: number | null;
    total_marks: number;
    questions_count: number;
  }>;
};

export type TakingQuestion = {
  id: number;
  question_text: string;
  question_type: string;
  difficulty: string;
  options: string[] | Record<string, string>;
  correct_answer: number | null;
  explanation: string | null;
  tips: string | null; // topic mapped to tips
};

export type PaperQuestionForTaking = {
  id: string; // you send str(pq.id)
  order: number;
  marks: number;
  question: TakingQuestion;
};

export type ExamPaperTaking = {
  id: number;
  exam: { title: string; year: number; exam_type: string; source: string | null };
  subject: { display_name: string };
  paper_code: string;
  duration_minutes: number | null;
  total_marks: number;
  paper_questions: PaperQuestionForTaking[];
};