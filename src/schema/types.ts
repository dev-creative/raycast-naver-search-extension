export interface NaverTypeaheadSearchResult {
  query: string[];
  answer: string[][];
  intend: unknown[];
  items: string[][][];
}

export interface SearchResult {
  text: string;
  url: string;
}
