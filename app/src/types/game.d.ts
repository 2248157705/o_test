import { GameItem } from "./store";

export interface GameListRes {
  data: GameItem[];
  page: number;
  per_page: number;
  total: number;
}

export interface GameCategoryRes {
  id: number;
  category_name: string;
  sort: number;
}
