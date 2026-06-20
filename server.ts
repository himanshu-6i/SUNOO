import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Setup GenAI
  const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

  // Set up local temp directory for uploads
  const UPLOAD_DIR = path.join('/tmp', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  const upload = multer({ storage: storage });

  // Serve the uploaded files statically
  app.use('/uploads', express.static(UPLOAD_DIR));

  // The upload API route
  app.post('/api/upload', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const audioFile = files && files['audio'] ? files['audio'][0] : null;
      const coverFile = files && files['cover'] ? files['cover'][0] : null;

      res.json({
        audioUrl: audioFile ? `/uploads/${audioFile.filename}` : null,
        coverUrl: coverFile ? `/uploads/${coverFile.filename}` : null
      });
    } catch (e: any) {
      console.error("Upload error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/generate-music', async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing. Please configure it in AI Studio settings.' });
    }
    const { prompt, duration } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Ensure we use the correct Lyria model based on duration
    const modelStr = duration === 'full' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    try {
      // Lyria music generation via generateContentStream
      const response = await ai.models.generateContentStream({
        model: modelStr,
        contents: prompt
      });

      let audioBase64 = "";
      let lyrics = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics += part.text + " ";
          }
        }
      }

      res.json({ audioBase64, mimeType, lyrics: lyrics.trim() });
    } catch (e: any) {
      console.error("AI Music Generation err:", e);
      let errorMessage = e?.message || "An unexpected error occurred.";
      if (errorMessage.includes('429') || errorMessage.includes('free tier') || errorMessage.includes('limit: 0') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
         errorMessage = "Music generation with the Lyria model requires a paid API key. The free tier does not support this feature at this time. Please upgrade your API key to generate music.";
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  app.post('/api/thinking-chat', async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
    }
    try {
      const { prompt } = req.body;
      
      const strictPrompt = `You are Sunoo AI, the virtual assistant for the Sunoo music app. 
CRITICAL INSTRUCTION: You MUST ONLY answer questions related to the Sunoo app, its music, artists, genres, playlists, or AI music generation within the app. 
If the user asks about ANYTHING unrelated to the Sunoo app or music, you MUST politely decline to answer and state that you can only answer questions related to the Sunoo app.

User question: ${prompt}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: strictPrompt,
      });

      res.json({ output: response.text, thoughts: "" });
    } catch (error: any) {
      console.error("Thinking chat err:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Provide Express v5 compatible catch-all
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
