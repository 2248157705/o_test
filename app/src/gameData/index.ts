import game2 from "@/static/gameData/game_2.json";
import game4 from "@/static/gameData/game_4.json";
import game5 from "@/static/gameData/game_5.json";
import game6 from "@/static/gameData/game_6.json";
import gameDefault from "@/static/gameData/game_default.json";
import gameGuarantee from "@/static/gameData/game_guarantee.json";
import gameValuation from "@/static/gameData/game_valuation.json";
import gameRecycle from "@/static/gameData/game_recycle.json";
import { getGameDetail } from "@/api/game";
import { cloneDeep, includes, isArray } from "lodash-es";
import { ProductTypeEnum } from "@/enums/product";

export const gameFormJson = {
  game2,
  game4,
  game5,
  game6,
  gameDefault,
  gameGuarantee,
  gameValuation,
  gameRecycle,
};

const gameFormItemParent = [
  {
    name: "基本信息",
    id: 2,
    child: [],
  },
  {
    name: "账号信息",
    id: 3,
    isGoodsInfo: true,
    child: [],
  },
  {
    name: "交易信息",
    id: 4,
    child: [],
  },
];

export const filterDot = [
  "系统",
  "区服",
  "战区",
  "大区",
  "实名",
  "防沉迷",
  "营地",
];

export const assembleGameForm = async (
  game_id,
  type = ProductTypeEnum.ACCOUNT,
  isEnter = false
) => {
  let gameFormData = [];
  let data = {};
  if (type == ProductTypeEnum.ACCOUNT) {
    data = cloneDeep(gameFormJson.gameDefault);
  }
  if (type == ProductTypeEnum.RECYCLE) {
    data = cloneDeep(gameFormJson.gameRecycle);
  }

  if (type == ProductTypeEnum.VALUATION) {
    data = cloneDeep(gameFormJson.gameValuation);
  }

  if (type == ProductTypeEnum.GUARANTEE) {
    data = cloneDeep(gameFormJson.gameGuarantee);
  }

  if ([ProductTypeEnum.ACCOUNT, ProductTypeEnum.VALUATION].includes(type - 0)) {
    const detail = await getGameDetail(
      game_id,
      ProductTypeEnum.VALUATION == type ? 1 : 0
    );
    if (!isArray(detail)) return;
    const list = detail.map((item) => {
      if (isEnter && item.options && item.options[0].label == "全部") {
        item.options.splice(0, 1);
      }
      if (
        ["系统", "区服", "战区", "大区", "实名", "防沉迷"].some((word) =>
          item.label.includes(word)
        )
      ) {
        item.required = true;
      }
      item.parentId = 3;
      item.errTips = "请选择" + item.label;
      return item;
    });
    gameFormData = gameFormData.concat(list);
  }
  data.gameFormId = game_id;
  data.gameFormItemParent.push(...gameFormItemParent);
  data.gameFormData.push(...gameFormData);
  return new Promise((resolve) => {
    resolve(data);
  });
};

export const parseGoodsInfo = (goodsInfo, gameFormData = []) => {
  const infos = [];
  try {
    const goods_info = goodsInfo ? JSON.parse(goodsInfo) : {};
    for (const i of gameFormData) {
      // 查找formData 里面的项 找出icon
      const item = goods_info[i.name] ? i : null;
      const key = i.name;
      if (item && item.type == "checkbox") {
        infos.push({
          type: "checkbox",
          label: item.label,
          value: item.options
            .filter((item) => {
              return includes(
                goods_info[key]?.map((v) => {
                  v = v + "";
                  return v;
                }),
                item.value + ""
              );
            })
            .map((i) => i.label),
        });
      }
      if (item && item.type != "checkbox") {
        let name = null;
        if (goods_info[key] && !item.options) {
          name = {
            label: goods_info[key],
          };
        } else {
          name = item.options?.find((op) => op.value == goods_info[key]);
        }
        name &&
          infos.push({
            type: item.type,
            label: item.label,
            value: name.label,
          });
      }
    }
  } catch (error) {
    uni.log.info(error);
  }
  return infos;
};
