const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldBlock = `      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: strictPrompt,
        });
      } catch (e: any) {
        if (e?.message?.includes('503') || e?.message?.includes('high demand') || e?.message?.includes('UNAVAILABLE')) {
          console.log("Falling back to gemini-2.5-flash due to 503 error...");
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: strictPrompt,
          });
        } else {
          throw e;
        }
      }`;

const newBlock = `      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: strictPrompt,
        });
      } catch (e: any) {
        if (e?.message?.includes('503') || e?.message?.includes('high demand') || e?.message?.includes('UNAVAILABLE')) {
          console.log("Retrying gemini-2.5-flash due to 503 error...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: strictPrompt,
          });
        } else {
          throw e;
        }
      }`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
} else {
  console.log("Block not found.");
}

fs.writeFileSync('server.ts', content);
