import { Zap, Clock, Globe, Terminal, Shield } from "lucide-react";

export const standardPieces = [
  {
    id: "http_request",
    displayName: "HTTP Request",
    description: "Send a request to any URL.",
    icon: Globe,
    color: "text-blue-500",
    props: [
      { name: "url", label: "URL", type: "text", placeholder: "https://api.example.com" },
      { name: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] },
      { name: "headers", label: "Headers (JSON)", type: "textarea" },
      { name: "body", label: "Body (JSON)", type: "textarea" }
    ],
    run: async ({ config }: any) => {
      const response = await fetch(config.url, {
        method: config.method || "POST",
        headers: config.headers ? JSON.parse(config.headers) : { "Content-Type": "application/json" },
        body: config.method !== "GET" ? (config.body || "{}") : undefined
      });
      return await response.json();
    }
  },
  {
    id: "delay",
    displayName: "Wait (Delay)",
    description: "Wait for a specified amount of time.",
    icon: Clock,
    color: "text-orange-500",
    props: [{ name: "seconds", label: "Seconds", type: "number" }],
    run: async ({ config }: any) => {
      await new Promise(res => setTimeout(res, (config.seconds || 1) * 1000));
      return { waited: config.seconds };
    }
  }
];

export const piecesMap = standardPieces.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as any);
export const pieces = standardPieces;
