import type { GameListRes, GameCategoryRes } from "@/types/game";
import { request } from "../fetch";

export const getGameList = (data) => {
  return request.post<GameListRes>("/client/game/getGameList", data);
};
export const getGameListByInitial = (data) => {
  return request.post<GameListRes>("/client/game/getGameListByInitial", data, {
    showLoading: false,
  });
};
export const getGameCategory = () => {
  return request.post<GameCategoryRes[]>("/client/game/getGameCategory", null, {
    showLoading: false,
  });
};
export const getGameDetail = (gameId: number, estimate: number) => {
  return request.post<GameCategoryRes[]>(
    "/client/game/getGameDetail",
    { gameId, estimate },
    {
      showLoading: false,
    }
  );
};
