const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// Add Type to imports
if (!content.includes('Type')) {
  content = content.replace('ThinkingLevel } from "@google/genai";', 'ThinkingLevel, Type } from "@google/genai";');
  if (!content.includes('Type')) {
     content = content.replace('ThinkingLevel } from "@google/genai";', 'ThinkingLevel, Type } from "@google/genai";');
     content = content.replace('Modality, ThinkingLevel', 'Modality, ThinkingLevel, Type');
  }
}

const oldPost = `app.post('/api/thinking-chat', async (req, res) => {`;
const oldStrictPrompt = `const strictPrompt = \`You are Sunoo AI, the virtual assistant for the Sunoo music app. 
CRITICAL INSTRUCTION: You MUST ONLY answer questions related to the Sunoo app, its music, artists, genres, playlists, or AI music generation within the app. 
If the user asks about ANYTHING unrelated to the Sunoo app or music, you MUST politely decline to answer and state that you can only answer questions related to the Sunoo app.

User question: \${prompt}\`;`;

const newStrictPrompt = `const strictPrompt = \`You are Sunoo AI, the virtual assistant for the Sunoo music app. 
CRITICAL INSTRUCTION: You MUST ONLY answer questions related to the Sunoo app, its music, artists, genres, playlists, or AI music generation within the app. 
If the user asks about ANYTHING unrelated to the Sunoo app or music, you MUST politely decline to answer and state that you can only answer questions related to the Sunoo app.

Additionally, if the user asks to navigate to a specific view or open something (like a playlist, home, library, search, upload/creator, premium, profile, etc.), provide the corresponding view name in the 'navigate_to' field. If no navigation is requested, leave 'navigate_to' empty.

Valid views for 'navigate_to': 'home', 'search', 'library', 'creator', 'premium', 'profile', 'settings', 'chill', 'workout', 'focus', 'my-ai'.

User question: \${prompt}\`;`;

const oldResponse1 = `        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: strictPrompt,
        });`;

const newResponse1 = `        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: strictPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: { type: Type.STRING },
                navigate_to: { type: Type.STRING }
              },
              required: ["reply", "navigate_to"]
            }
          }
        });`;

const oldResponse2 = `          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: strictPrompt,
          });`;

const newResponse2 = `          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: strictPrompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  reply: { type: Type.STRING },
                  navigate_to: { type: Type.STRING }
                },
                required: ["reply", "navigate_to"]
              }
            }
          });`;

const oldResJson = `res.json({ output: response.text, thoughts: "" });`;
const newResJson = `      const jsonStr = response.text || "{}";
      let parsed = { reply: "I didn't understand that.", navigate_to: "" };
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
      res.json({ output: parsed.reply, navigate_to: parsed.navigate_to, thoughts: "" });`;

content = content.replace(oldStrictPrompt, newStrictPrompt);
content = content.replace(oldResponse1, newResponse1);
content = content.replace(oldResponse2, newResponse2);
content = content.replace(oldResJson, newResJson);

fs.writeFileSync('server.ts', content);
