// services/geminiService.ts

// از آنجایی که API Key و شیء ai در سمت کلاینت حذف شده‌اند، فقط Modality و Types را وارد می‌کنیم.
import { Modality } from '@google/genai';
import { VocabularyData } from '../types';

// تعریف نقطه اتصال امن (Endpoint) ما
const API_ENDPOINT = '/api/gemini';

// ==========================================================
// تابع ۱: استخراج متن از تصویر (Extract Text From Image)
// ==========================================================
export async function extractTextFromImage(base64Image: string): Promise<string> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // مدل و محتوا را برای واسط امن ارسال می‌کنیم
      model: 'gemini-2.5-flash', 
      contents: [
        { 
          parts: [
            { text: "Extract the English text from this image:" },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('خطا در ارتباط با واسط امن.');
  }

  const data = await response.json();
  return data.text; 
}


// ==========================================================
// تابع ۲: تحلیل متن و ساده‌سازی (Analyze Text)
// ==========================================================
export async function analyzeText(text: string): Promise<VocabularyData> {
  const analysisPrompt = `You are an expert in basic sciences. For each technical term you will provide:
  1. **word**: The English term.
  2. **pronunciation**: A simple, intuitive pronunciation guide.
  3. **literalMeaning**: The direct, one or two-word Persian translation.
  4. **definition**: A more detailed explanation of the term in Persian.
  5. **example**: A clear, simple example sentence in English using the term.
  6. **exampleTranslation**: The Persian translation of the example sentence.
  Return the result as a single JSON object with three keys: 'اختصاصی', 'متوسط', 'پیشرفته'.
  Do not return an empty array for any level. If no words are found for a level, return null.
  Text for analysis: ${text}`;

  try {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gemini-2.5-flash', 
            contents: [{ text: analysisPrompt }],
            config: { responseMimeType: "application/json" } // تنظیم خروجی JSON
        })
    });
    
    if (!response.ok) {
        throw new Error('خطا در تحلیل متن توسط واسط امن.');
    }

    const jsonText = (await response.json()).text.trim();
    const parsedData = JSON.parse(jsonText);

    // Ensure all keys exist to prevent runtime errors
    const fullData: VocabularyData = {
        'اختصاصی': parsedData['اختصاصی'] || [],
        'متوسط': parsedData['متوسط'] || [],
        'پیشرفته': parsedData['پیشرفته'] || [],
    };

    return fullData;

  } catch (error) {
    console.error("Error analyzing text:", error);
    throw new Error("خطا در تحلیل متن توسط هوش مصنوعی.");
  }
}

// ==========================================================
// تابع ۳: تبدیل متن به گفتار (Text To Speech - TTS)
// ==========================================================
export async function getTextToSpeech(word: string): Promise<Promise<any>> {
  try {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gemini-2.5-flash-preview-tts', // مدل TTS را به واسط امن می‌فرستیم
            contents: [{ parts: [{ text: `Pronounce the following term clearly: ${word}` }] }],
            config: { responseModality: [Modality.AUDIO] } // درخواست خروجی صوتی
        })
    });
    
    if (!response.ok) {
        throw new Error("خطا در تولید صوت توسط واسط امن.");
    }

    const audioPart = (await response.json()).candidates?.[0]?.content?.parts?.[0];

    if (audioPart && audioPart.inlineData) {
      return {
        audioData: audioPart.inlineData.data,
        mimeType: audioPart.inlineData.mimeType,
      };
    }

    throw new Error("پاسخ صوتی نامعتبر دریافت شد.");

  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("خطا در تولید صوت.");
  }
}