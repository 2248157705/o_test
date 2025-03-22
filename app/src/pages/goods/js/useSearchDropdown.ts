import { useGameStore } from "@/stores/game";

export const useSearchDropdown = async (gameId) => {
  const gameStore = useGameStore();
  if (!gameId) {
    return [
      {
        label: "价格区间",
        type: "section",
        name: "price",
        value: [],
      },
    ];
  }
  if (!gameStore.gameDetail[gameId]) {
    await gameStore.assembleGameForm(gameId);
  }

  return gameStore.gameDetail[gameId]?.gameFormData.filter((data) => {
    data.value = "";
    return data.parentId == 3 && data.options;
  });
};
