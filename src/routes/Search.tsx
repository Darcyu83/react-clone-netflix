import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { constSelector } from "recoil";
import { ISearchResult, ISearchResults, searchKeyword } from "../api";

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const { isLoading, data } = useQuery<ISearchResults>("search", () =>
    searchKeyword(search.get("keyword") || "")
  );

  console.log("data", data?.results);
  console.log(
    "Promise",
    data
      ? Promise.all(data.results).then((result) =>
          console.log(
            "machedResult",
            Object.keys(result).map((i) => console.log("i", i))
          )
        )
      : null
  );

  return <div> Search </div>;
}

export default Search;
