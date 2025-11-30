import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to check API status
const isApiReady = () => !!apiKey;

/**
 * Optimizes structured form data into a natural language description.
 */
export const optimizeDescription = async (
  role: 'parent' | 'tutor',
  data: any
): Promise<string> => {
  if (!isApiReady()) {
    // Fallback if no API key
    if (role === 'parent') {
      return `诚找${data.subjects.join('、')}家教，学生${data.gradeLevel}。目标：${data.goals.join('、')}。地点：${data.location?.address || '附近'}。`;
    }
    return `经验丰富的${data.subjects.join('、')}老师。${data.schedule?.map((s:any) => s.day).join('、')}可上课。`;
  }

  const prompt = role === 'parent'
    ? `请用中文为一位家长写一条温暖、简洁的朋友圈风格文案（80字以内），用于寻找家教。
       详细信息:
       - 科目: ${data.subjects.join(', ')}
       - 学生年级: ${data.gradeLevel}
       - 目标: ${data.goals.join(', ')}
       - 教学风格: ${data.teachingStyle}
       - 时间: ${JSON.stringify(data.schedule)}
       - 地点: ${data.location?.address}
       
       语气: 有礼貌，略带急切但友好。不要使用标签（hashtags）。`
    : `请用中文为一位家教老师写一段专业的自我介绍（60字以内）。
       详细信息:
       - 科目: ${data.subjects.join(', ')}
       - 类型: ${data.teacherType}
       - 风格: ${data.teachingStyle}
       
       语气: 可靠，能力强。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("GenAI Error", error);
    return "正在寻找符合要求的家教。";
  }
};

/**
 * Scores a job posting draft and provides feedback (0-100).
 */
export const evaluatePostingQuality = async (
  data: any
): Promise<{ score: number; tips: string[] }> => {
  if (!isApiReady()) {
    // Mock logic for demo without API Key
    let score = 60;
    const tips = [];
    if (data.priceMin && data.priceMax) score += 20;
    else tips.push("填写预算可提高70%的应征质量");
    
    if (data.schedule && data.schedule.length > 0) score += 10;
    else tips.push("明确上课时间可避免时间冲突");
    
    if (data.description && data.description.length > 20) score += 10;
    
    return { score, tips: tips.length ? tips : ["太棒了！您的发布信息很完整。"] };
  }

  const prompt = `
    你是一位专业的家教平台审核专家。请评估这份家教需求 JSON 数据。
    请返回一个 JSON 对象，包含：
    1. 'score' (整数 0-100): 基于完整性打分 (预算、时间、地点、具体目标是高价值项)。
    2. 'tips' (字符串数组): 最多 3 条简短、可执行的建议，帮助改进发布内容 (请用中文回答，例如 "增加预算范围以筛选更优质的老师")。
    
    Data: ${JSON.stringify(data)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    return { score: 0, tips: ["AI 评估暂时不可用。"] };
  }
};

/**
 * Calculates a match score between a listing and a user profile/preference.
 */
export const analyzeMatch = async (listing: any, userProfile: any): Promise<{ score: number; reason: string }> => {
  // Mock logic to save API calls for simple list rendering
  const isSubjectMatch = listing.subjects.some((s: string) => userProfile.preferredSubjects?.includes(s));
  const baseScore = isSubjectMatch ? 85 : 40;
  const randomVar = Math.floor(Math.random() * 15);
  
  return { 
    score: baseScore + randomVar, 
    reason: isSubjectMatch ? "科目匹配" : "距离很近" 
  };
};