import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import { URLSearchParams } from "node:url";
import { NaverTypeaheadSearchResult, SearchResult, validate } from "./schema";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const url =
    "https://ac.search.naver.com/nx/ac?" +
    // send the search query to the API
    new URLSearchParams({
      q: searchText.length === 0 ? "" : `${searchText}`,
      con: "1",
      frm: "nv",
      ans: "2",
      r_format: "json",
      r_enc: "UTF-8",
      r_unicode: "0",
      t_koreng: "1",
      run: "2",
      rev: "4",
      q_enc: "UTF-8",
      st: "100",
    });
  const { data, isLoading } = useFetch(url, {
    parseResponse: parseFetchResponse,
  });

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} searchBarPlaceholder="Search Naver..." throttle>
      <List.Section title="Results" subtitle={data?.length + ""}>
        {searchText === "" ? null : (
          <SearchListItem
            key="search_now"
            searchResult={{ text: searchText, url: naverSearchUrl(searchText) }}
            icon="list-icon.png"
          />
        )}
        {data?.map((searchResult) => (
          <SearchListItem key={searchResult.text} searchResult={searchResult} icon="naver.png" />
        ))}
      </List.Section>
    </List>
  );
}

function SearchListItem({ searchResult, icon }: { searchResult: SearchResult; icon: string }) {
  return (
    <List.Item
      title={searchResult.text}
      icon={{ source: icon }}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser title="Open in Browser" url={searchResult.url} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

function naverSearchUrl(query: string) {
  return `${new URL("/search.naver", "https://search.naver.com").href}?${new URLSearchParams({
    where: "nexearch",
    sm: "top_hty",
    fbm: "0",
    ie: "utf8",
    query,
  })}`;
}

/** Parse the response from the fetch query into something we can display */
async function parseFetchResponse(response: Response) {
  const json = (await response.json()) as NaverTypeaheadSearchResult;
  const isValid = validate(json);
  if (!isValid) return [];
  const {
    items: [result],
  } = json;
  return result.map((item) => {
    const [text] = item;
    return { text, url: naverSearchUrl(text) } as SearchResult;
  });
}
