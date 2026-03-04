
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnalysisMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeBiologyContent = async (
  imagePrompt?: string,
  textPrompt?: string,
  mode: AnalysisMode = AnalysisMode.GENERAL
): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    أنت خبير تربوي ومساعد ذكي متخصص في منهاج الأحياء الأردني (التوجيهي).
    يجب أن تكون إجابتك باللغة العربية الفصحى وبأسلوب أكاديمي أردني رصين.
    
    يجب أن تعيد النتيجة بتنسيق JSON كالتالي:
    {
      "lessonTitle": "عنوان الدرس",
      "explanation": "شرح مفصل",
      "partsAndFunctions": "الأجزاء والوظائف",
      "examPoints": ["نقطة 1"],
      "ministerialTip": "فكرة وزارية",
      "reviewQuestion": "سؤال توجيهي مع خيارات",
      "summary": "ملخص (اختياري)",
      "presentation": [], (اختياري)
      "mindMap": "خريطة (اختياري)",
      "teacherPlan": "خطة درس مفصلة تشمل: الأهداف النتاجية، الاستراتيجيات (مثل التعلم بالاستقصاء)، والتقويم (فقط إذا طُلب)",
      "worksheet": "ورقة عمل تشمل أسئلة متنوعة (علل، قارن، ماذا يحدث) (فقط إذا طُلب)"
    }
  `;

  let specificTask = "";
  switch (mode) {
    case AnalysisMode.VIDEO: specificTask = "أضف سيناريو فيديو تعليمي 90 ثانية."; break;
    case AnalysisMode.INFOGRAPHIC: specificTask = "أضف بيانات لتصميم إنفوجرافيك تعليمي."; break;
    case AnalysisMode.SUMMARY: specificTask = "أضف ملخصاً تنفيذياً مركزاً."; break;
    case AnalysisMode.PRESENTATION: specificTask = "أضف هيكلاً لعرض تقديمي (5 شرائح)."; break;
    case AnalysisMode.MIND_MAP: specificTask = "أضف خريطة ذهنية هيكلية مفصلة."; break;
    case AnalysisMode.TEACHER_PLAN: specificTask = "صمم خطة درس نموذجية وفق معايير وزارة التربية والتعليم الأردنية (الأهداف، التمهيد، الإجراءات، التقويم)."; break;
    case AnalysisMode.WORKSHEET: specificTask = "صمم ورقة عمل تفاعلية للطلاب تشمل أسئلة مهارات تفكير عليا حول الموضوع."; break;
    default: specificTask = "تحليل شامل وكامل للدرس.";
  }

  const prompt = `
    حلل المحتوى التالي وقدم المخرجات العلمية المطلوبة:
    المحتوى: ${textPrompt || "صورة مرفقة"}
    المهمة: ${specificTask}
  `;

  const contents: any = { parts: [{ text: prompt }] };
  if (imagePrompt) {
    contents.parts.push({
      inlineData: { mimeType: "image/jpeg", data: imagePrompt.split(",")[1] },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction, responseMimeType: "application/json" },
  });

  return JSON.parse(response.text || "{}");
};
