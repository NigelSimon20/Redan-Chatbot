// components/ChatBot.tsx
"use client";

import { useState } from "react";
import responses from "../api/responses.json";

const ChatBot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string; link?: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "client", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botMessage = getResponse(input);
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    setInput("");
  };

  const getResponse = (input: string): { sender: string; text: string; link?: string } => {
    const messageLower = input.toLowerCase();

    // Check for fuel inquiries
    if (messageLower.includes("how much is your diesel")) {
      const response = responses.fuel_prices.find((item) => item.pattern.includes("diesel"));
      return { sender: "redan", text: response?.response || "Please provide your location for a specific price." };
    }

    if (messageLower.includes("how much is your petrol")) {
      const response = responses.fuel_prices.find((item) => item.pattern.includes("petrol"));
      return { sender: "redan", text: response?.response || "Please provide your location for a specific price." };
    }

    // General fallback for other inquiries
    for (const category of Object.values(responses)) {
      const matchedItem = (category as { pattern: string; response: string; link?: string }[]).find((item) =>
        messageLower.includes(item.pattern.toLowerCase())
      );

      if (matchedItem) {
        return { sender: "redan", text: matchedItem.response, link: matchedItem.link };
      }
    }

    return { sender: "redan", text: "I'm sorry, I don't understand. Could you rephrase?" };
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">Welcome to Redan Chat</h1>
      <div className="h-64 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 ${msg.sender === "client" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === "client" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {/* Check if the message has a link */}
              {msg.link ? (
                <span>
                  {msg.text.split("click here").map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < msg.text.split("click here").length - 1 && (
                        <a
                          href={msg.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline ml-1"
                        >
                          click here
                        </a>
                      )}
                    </span>
                  ))}
                </span>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="p-2 bg-blue-500 text-white rounded-r-lg" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
