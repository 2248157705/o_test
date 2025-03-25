import type { GameState } from "@/types/store";
import { defineStore } from "pinia";

import { getGameList } from "@/api/game";
import { assembleGameForm } from "@/gameData";

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    gameList: [],
    gameAllList: [],
    buyGameList: [],
    gameDetail: {},
    detailLoad: {},
  }),
  actions: {
    async getGameList() {
      const { data } = await getGameList({ page: 1, per_page: 8 });
      this.gameList = data;
    },
    async getGameAllList(category_id, game_name, per_page = 30) {
      const { data } = await getGameList({
        category_id,
        game_name,
        is_group: 1,
        per_page,
      });
      this.gameAllList = data;
    },
    async getBuyGameList() {
      const { data } = await getGameList();
      this.buyGameList = data;
    },
    async assembleGameForm(gameId: string | number) {
      if (this.detailLoad[gameId])
        return Promise.resolve(this.gameDetail[gameId]);
      this.detailLoad = {
        ...this.detailLoad,
        [gameId]: true,
      };
      const data = await assembleGameForm(gameId);
      this.gameDetail = {
        ...this.gameDetail,
        [gameId]: data,
      };
      this.detailLoad = {
        ...this.detailLoad,
        [gameId]: false,
      };
      return Promise.resolve(data);
    },
  },
});
