// place files you want to import through the `$lib` alias in this folder.

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

export async function getCompletion(prompt: string): Promise<string | null> {
    try{
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: prompt
        }],
        model: "gpt-4",
      });
    
      return completion.choices[0].message.content
    } catch(e) {
        console.error(e)
        return null
    }
}