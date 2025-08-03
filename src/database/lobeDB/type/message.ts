export interface ModelReasoning {
  content?: string;
  duration?: number;
  signature?: string;
}

export interface CitationItem {
    favicon?: string;
    id?: string;
    title?: string;
    url: string;
  }
  
  export interface GroundingSearch {
    citations?: CitationItem[];
    searchQueries?: string[];
  }