import { ref, reactive, watch } from "vue";
import { find, isEmpty, has, cloneDeep } from "lodash-es";
import { useSearchDropdown } from "@/pages/goods/js/useSearchDropdown";

export function SearchDropdown(onRefresh, opts = {}) {
  const gameId = ref(null);
  const defaultMenuList = [
    {
      title: "综合排序",
      dropdownKey: "price",
      value: "",
      options: [
        {
          label: "综合排序",
          value: "",
        },
        {
          label: "发布时间",
          value: "created_at",
        },
        {
          label: "价格高低",
          value: "product_price",
        },
      ],
    },
    {
      title: "排序",
      dropdownKey: "sort",
      value: 0,
    },
  ];
  const menuData = opts.menus || defaultMenuList;
  const clickData = reactive({
    type: "",
    checked: false,
  });
  const queryData = reactive({
    orderByKey: "",
    sort: "",
    filter: {},
  });
  let filter = reactive({});
  const menuList = ref(menuData);
  const copyMenuList = ref([]);
  watch(
    () => menuList.value,
    (value) => {
      if (value) {
        queryData.orderByKey = value[0]?.value;
      }
    },
    { deep: true }
  );
  watch(
    () => menuList.value,
    (value) => {
      if (value) {
        copyMenuList.value = cloneDeep(value);
      }
    },
    { immediate: true }
  );

  const onSortConfirm = (type, value, title) => {
    // 查找
    const item = find(menuList.value, (f) => f.dropdownKey == type);
    // 修改值
    if (item) {
      if (["filter", "classification"].includes(type)) {
        item.options.forEach((option) => {
          // 检查新数据对象是否包含选项类型

          if (has(value.value, option.name)) {
            // 更新 keys 数组中的值
            option.value = value.value[option.name];
          }
        });
      } else if (type == "priceFilter") {
        item.value = value.value; // 你需要设置的新值
      } else if (type == "click") {
        item.value = value.value; // 你需要设置的新值
      } else {
        item.value = value; // 你需要设置的新值
        if (title) {
          item.title = title; // 你需要设置的新值
        }
      }
    }
    if (type === "price") {
      queryData.orderByKey = value;
    }
    if (type === "sort") {
      queryData.sort = value;
    }

    if (type == "priceFilter") {
      if (isEmpty(value.value)) {
        delete queryData.filter?.priceEnd;
        delete queryData.filter?.priceStart;
      }
      queryData.filter = {
        ...queryData.filter,
        ...value.value,
      };
    }
    if (type == "click") {
      if (value.type == "reset") {
        menuList.value = cloneDeep(copyMenuList.value);
        gameId.value = null;
        delete queryData.filter;
        onRefresh && onRefresh();
      } else {
        clickData.type = value.type;
        clickData.checked = !clickData.checked;
      }
      return;
    }
    if (["filter", "classification"].includes(type)) {
      filter = Object.assign(
        JSON.parse(queryData.filter?.filterData || "{}"),
        {}
      );
      for (const f in value.value) {
        if (has(filter, f) && isEmpty(value.value[f])) {
          delete filter[f];
          continue;
        }
        if (isEmpty(value.value[f])) continue;
        filter[f] = value.value[f];
      }

      if (!isEmpty(filter)) {
        queryData.filter.filterData = JSON.stringify(filter);
      } else {
        delete queryData.filter.filterData;
      }
    }

    onRefresh && onRefresh();
  };

  const setDropdown = async (id) => {
    queryData.filter = {};
    queryData.orderByKey = "";
    queryData.sort = "";
    gameId.value = id;
    const filterList = await useSearchDropdown(id).catch((e) => {
      console.log("useSearchDropdown error:", e);
    });
    menuList.value.forEach((menu) => {
      menu.disabled = false;
    });
    const end =
      menuList.value.length == 5
        ? menuList.value.length - 2
        : menuList.value.length - 1;
    if (filterList) {
      menuList.value[end].options = filterList.filter(
        (item) => item.type != "radio"
      );
      menuList.value[1].options = filterList.filter(
        (item) => item.type == "radio"
      );
    }
  };

  return {
    gameId,
    queryData,
    clickData,
    menuList,
    onSortConfirm,
    setDropdown,
  };
}
