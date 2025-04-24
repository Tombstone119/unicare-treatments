"use client";

import { cn } from "@/libs/utils";
import { Button } from "@/shadcn/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { FaHandPointRight } from "react-icons/fa";

export default function Page() {
  const [history, setHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);

  const { complete, completion, isLoading } = useCompletion();

  console.log("completion: =-->", completion);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    setImageUrl(
      "https://files.edgestore.dev/7nkrwkt3m5fglcd3/publicFiles/_public/c032743a-f32c-4e12-a2dc-32c7ab38dcda.jpeg"
    );
  }, []);

  const handleSubmit = async () => {
    if (!imageUrl.trim() || isLoading) return;
    const result = await complete(imageUrl);

    if (result) {
      const aiMessage = { role: "assistant", content: result };
      setHistory((prev) => [...prev, aiMessage]);
    }
  };

  const replaceFirstLetter = (str: string) => {
    if (str.startsWith("- ")) {
      return (
        <div className="flex items-center gap-2">
          <FaHandPointRight className="text-black/90" />{" "}
          {str.replace(/^- /, "")}
        </div>
      );
    }
    return str;
  };

  const generateContent = (message: { role: string; content: string }) => {
    const messageContent = message.content.split("\n");
    return (
      <>
        {messageContent.map((line, i) => (
          <div
            key={`lines-${i + 1}`}
            className={cn(
              i === messageContent.length - 1
                ? "p-5 border-2 border-green-900 bg-green-900/5 text-green-900 rounded-xl"
                : ""
            )}
          >
            {replaceFirstLetter(line)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 p-10 w-full">
      <div className="flex flex-col gap-2 p-10 border-2 border-dashed border-black leading-relaxed">
        {history.map((message, index) => (
          <div
            className="max-w-none flex flex-col gap-2"
            key={`user-${index + 1}`}
          >
            {generateContent(message)}
          </div>
        ))}
        {isLoading && <div className="text-gray-500">AI is thinking...</div>}
      </div>
      <div className="flex items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <Button type="submit" disabled={isLoading || !imageUrl.trim()}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
