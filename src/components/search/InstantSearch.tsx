import React, { useState, useEffect, ChangeEvent } from "react";
import algoliasearch from "algoliasearch/lite";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import { Configure, Hits, InstantSearch, SearchBox } from "react-instantsearch";

import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from "instantsearch.js/es/lib/utils";

const searchClient = algoliasearch(
  "OYGQK96V5O",
  "46810e96a8854fc2b54d095bc05d3329"
);

const Hit = ({ hit }: { hit: any }) => {
  return (
    <article>
      <div className="hit-foodName">
        <Highlight attribute="foodName" hit={hit} />
      </div>
      <div className="flex flex-row gap-2">
        <div className="hit-fat">
          <span>{getPropertyByPath(hit, "fat")}</span>
        </div>
        <div className="hit-carbs">
          <span>{getPropertyByPath(hit, "carbs")}</span>
        </div>
        <div className="hit-proteins">
          <span>{getPropertyByPath(hit, "proteins")}</span>
        </div>
      </div>
    </article>
  );
};

export const SearchTwo = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="foods">
      <Configure hitsPerPage={5} />
      <div className="ais-InstantSearch">
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};

export default SearchTwo;
