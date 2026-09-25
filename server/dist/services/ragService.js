import { POLICY_CHUNKS } from "../data/approvalPolicyNote.js";
export class RAGService {
    chunks;
    constructor(chunks = POLICY_CHUNKS) {
        this.chunks = chunks;
    }
    search(query, topK = 2) {
        const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/g, " ");
        const queryTokens = new Set(normalizedQuery
            .split(/\s+/)
            .filter((t) => t.length > 2));
        const scored = this.chunks.map((chunk) => {
            let score = 0;
            const matchedKeywords = [];
            for (const kw of chunk.keywords) {
                if (queryTokens.has(kw) || normalizedQuery.includes(kw)) {
                    score += 3;
                    matchedKeywords.push(kw);
                }
            }
            const titleTokens = chunk.title.toLowerCase().split(/\s+/);
            for (const tt of titleTokens) {
                if (queryTokens.has(tt)) {
                    score += 2;
                }
            }
            const contentTokens = chunk.content.toLowerCase().split(/\s+/);
            for (const ct of contentTokens) {
                if (queryTokens.has(ct)) {
                    score += 0.5;
                }
            }
            return {
                chunk,
                score,
                matchedKeywords: Array.from(new Set(matchedKeywords))
            };
        });
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK);
    }
    getChunkById(id) {
        return this.chunks.find((c) => c.id === id);
    }
}
export const ragService = new RAGService();
