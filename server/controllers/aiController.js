
import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';

import FormData from "form-data";
import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";









const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req, res) => { 
    try{
        const{ userId } =req.auth();
        const { prompt,length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if(plan!=='premium' && free_usage >= 10){
            return res.json({ success: false, message: 'Free plan usage limit reached. Please upgrade to continue.' });
        }
        const response = await AI.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
        
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: length ,
});
        const content =response.choices[0].message.content

        await sql  `INSERT INTO Creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
         if(plan !== 'premium'){
            const new_free_usage = free_usage + 1;
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{free_usage:new_free_usage}
            })
         }
         res.json({ success: true, content })

    }catch(error){
        console.log(error.message)
        res.json({ success: false, message: error.message })   }

}


export const generateBlogTitles = async (req, res) => { 
    try{
        const{ userId } =req.auth();
        const { prompt} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        if(plan!=='premium' && free_usage >= 10){
            return res.json({ success: false, message: 'Free plan usage limit reached. Please upgrade to continue.' });
        }
        const response = await AI.chat.completions.create({
    model: "gemini-3-flash-preview",
    messages: [
        
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: 300,
});
        const content =response.choices[0].message.content

        await sql  `INSERT INTO Creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;
         if(plan !== 'premium'){
            const new_free_usage = free_usage + 1;
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{free_usage:new_free_usage}
            })
         }
         res.json({ success: true, content })

    }catch(error){
        console.log(error.message)
        res.json({ success: false, message: error.message })   }

}

export const generateImage = async (req, res) => { 
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: 'This feature is only available for premium subscription.' });
    }

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // ✅ CREATE FORMDATA
    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
        timeout: 60000,
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO Creations (user_id, prompt, content, type, publish)
              VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.json({ success: false, message: error.message });
  }
};
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ use file path, NOT buffer
    const imagePath = req.file.path;

    const { secure_url } = await cloudinary.uploader.upload(imagePath, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO Creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.log("ERROR 👉", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeImageObject = async (req, res) => { 
  try {
    const { userId } = req.auth();
    const { object } = req.body;
  const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: 'This feature is only available for premium subscription.' });
    }

   
     const { public_id } = await cloudinary.uploader.upload(image.path)

      const imageUrl=cloudinary.url(public_id, {
      transformation: [{
        effect: `gen_remove:${object}`
}],
   resource_type: 'image'
     });

    await sql`INSERT INTO Creations (user_id, prompt, content, type)
              VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Premium only feature" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resume required" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);

    const prompt = `
Review this resume thoroughly and complete ALL sections.
Do not stop mid-sentence.

Resume:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;

    // 🔥🔥🔥 THIS WAS MISSING 🔥🔥🔥
    await sql`
      INSERT INTO Creations (user_id, prompt, content, type, publish)
      VALUES (
        ${userId},
        'Resume Review',
        ${content},
        'resume',
        false
      )
    `;

    res.json({ success: true, content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
