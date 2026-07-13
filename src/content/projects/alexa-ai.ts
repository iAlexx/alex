import type { PortfolioProject } from "./types";

export const alexaAi: PortfolioProject = {
  title: "Alexa AI — Local Intelligent Assistant",
  slug: "alexa-ai",
  shortDescription:
    "A privacy-focused local AI assistant with persistent memory, streaming responses, local language models, and integrated tools.",
  longDescription:
    "Alexa AI is built local-first: language models run through Ollama, structured memory lives in SQLite, semantic memory in ChromaDB, and a tools registry gives the assistant controlled access to files, system operations, projects, and terminal execution.",
  status: "functional-prototype",
  featured: false,
  priority: 3,
  world: "intelligence",
  role: ["Product Architect", "Full-Stack Developer", "AI Systems Designer"],
  technologies: ["FastAPI", "Next.js", "TypeScript", "Ollama", "Local LLMs", "SQLite", "ChromaDB"],
  capabilities: [
    "Streaming responses",
    "Short-term memory",
    "Long-term memory",
    "Project memory",
    "User preference memory",
    "Task memory",
    "Tools registry",
    "File tools",
    "System tools",
    "Project tools",
    "Controlled terminal execution",
    "Local-first architecture",
  ],
  // PLACEHOLDER ASSETS — replace with real UI screenshots and architecture
  // diagrams when available.
  gallery: [
    "/images/alexa-ai/placeholder-ui.webp",
    "/images/alexa-ai/placeholder-memory-architecture.webp",
    "/images/alexa-ai/placeholder-tools-diagram.webp",
  ],
  visibility: "public",
};
