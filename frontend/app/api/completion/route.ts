import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("messages: =-->", messages);

  const { text } = await generateText({
    system: "You are a image analysis assistant.",
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What's in this image? Provide a detailed summary.",
          },
          {
            type: "image",
            image:
              "https://files.edgestore.dev/7nkrwkt3m5fglcd3/publicFiles/_public/c032743a-f32c-4e12-a2dc-32c7ab38dcda.jpeg",
          },
        ],
      },
    ],
  });

  const result = streamText({
    model: openai("gpt-4"),
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `{Think like a doctor and analyze following report details. give a summary of the report with important diagnosis. here is the report ${text}}`,
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
