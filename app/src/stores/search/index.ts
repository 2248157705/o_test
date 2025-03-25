import { defineStore } from "pinia";
import { find, take } from "lodash-es";

type SearchStore = {
  searchHistory: string[];
  searchKey: string;
};
export const useSearchStore = defineStore("search", {
  unistorage: true, // 是否持久化
  state: (): SearchStore => ({
    searchKey: "",
    searchHistory: [],
  }),
  actions: {
    setSearchKey(key: string) {
      this.searchKey = key;
    },
    setSearchHistory(key: string) {
      const item = find(this.searchHistory, (item) => item === key);
      if (item) {
        this.searchHistory.sort((a, b) => {
          if (a === item) return -1;
          if (b === item) return 1;
          return 0;
        });
      } else {
        this.searchHistory.unshift(key);
      }
      this.searchHistory = take(this.searchHistory, 10);
    },
    delSearchHistory() {
      this.searchHistory = [];
    },
  },
});
