import { useGameStore } from "@/stores/game";
import { isEqual, uniqWith } from "lodash-es";

export const useProduct = async () => {
  const gameStore = useGameStore();

  await gameStore.getGameList();

  return {
    gameListData: gameStore.gameList.slice(0, 8),
    tabColumnsData: uniqWith(
      gameStore.gameList.slice(0, 8).map((game) => {
        return {
          name: game.game_name,
          value: game.id,
        };
      }),
      isEqual
    ),
  };
};
