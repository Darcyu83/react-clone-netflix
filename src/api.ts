const API_KEY = "72caad34e2c43d870d78d98ae9a0980b";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface IGetMoviesResult {
  dates: { minimum: string; maximum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  name: string;
  id: number;
}
export interface ISearchResults {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export function searchKeyword(keyword: string) {
  return fetch(`
  https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=${keyword}&page=1`).then(
    (response) => response.json()
  );
}
