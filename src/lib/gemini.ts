import { GoogleGenerativeAI } from "@google/generative-ai";
import { Chapter } from '../types';

// Dummy Content (Fallback)
export const DUMMY_CHAPTERS: Chapter[] = [
  { id: 'c1', title: 'Introduction', subject: 'Physics', isLocked: false, content: 'Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force. ## Core Concepts \n - **Energy**: The capacity to do work. \n - **Matter**: Anything that has mass and takes up space. \n $$E=mc^2$$' },
  { id: 'c2', title: 'Core Principles', subject: 'Physics', isLocked: true, content: 'Newtonian mechanics, Thermodynamics, Electromagnetism...' },
  { id: 'c3', title: 'The Cell', subject: 'Biology', isLocked: false, content: 'The cell is the basic structural, functional, and biological unit of all known organisms.' },
  { id: 'c4', title: 'Mughal Empire', subject: 'History', isLocked: false, content: 'The Mughal Empire was an early modern empire in South Asia.' },
  { id: 'c5', title: 'Chemical Reactions', subject: 'Chemistry', isLocked: true, content: 'A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.' },
  { id: 'c6', title: 'Algebra', subject: 'Math', isLocked: false, content: 'Algebra is one of the broad parts of mathematics, together with number theory, geometry and analysis.' },
  { id: 'c7', title: 'Hindi Vyakaran', subject: 'Hindi', isLocked: false, content: 'Hindi grammar is the set of rules that describe the structure of the Hindi language.' }
];

export const generateDummyContent = (): Chapter[] => {
  return DUMMY_CHAPTERS;
};

// Real AI Generation (Low Level)
const callGeminiAPI = async (topic: string, subject: string, systemPrompt: string): Promise<string> => {
  const apiKey = localStorage.getItem('nst_gemini_api_key');

  if (!apiKey) {
    console.warn("No API Key found. Using dummy content.");
    throw new Error("API Key missing");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `
      ${systemPrompt}
      
      Subject: ${subject}
      Topic: ${topic}
      
      Please generate comprehensive study notes for this topic. 
      Include:
      1. Definition
      2. Key Concepts (bullet points)
      3. At least one mathematical formula (if applicable) using LaTeX format wrapped in $$ (e.g., $$E=mc^2$$).
      4. Real-world example.
      
      Format the output in Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Smart Caching Wrapper (The "Global Memory")
export const getOrGenerateChapterContent = async (
  chapterId: string, 
  topic: string, 
  subject: string, 
  systemPrompt: string,
  forceRegenerate: boolean = false
): Promise<string> => {
  
  const cacheKey = `nst_content_${chapterId}`;
  
  // 1. Check Cache (Database)
  if (!forceRegenerate) {
    const cachedContent = localStorage.getItem(cacheKey);
    if (cachedContent) {
      console.log("Serving from Cache (Database):", chapterId);
      return cachedContent;
    }
  }

  // 2. If not found or forced, Generate
  console.log("Generating fresh content via AI...", chapterId);
  const newContent = await callGeminiAPI(topic, subject, systemPrompt);

  // 3. Save to Cache (Database)
  localStorage.setItem(cacheKey, newContent);
  console.log("Saved content to Database:", chapterId);

  return newContent;
};

export const MOCK_MCQS = [
  { id: 1, question: "What is the unit of Force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: 0 },
  { id: 2, question: "Powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"], correct: 1 },
];
