import { ref, reactive } from "vue";

export function FilterList() {
  const ordersData = reactive({
    keyword: "",
    orders: [
      // {
      //   column: "sort",
      //   asc: true,
      // },
      {
        column: "create_time",
        asc: false,
      },
    ],
  });
  const menuList = ref([
    {
      title: "综合排序",
      type: "cell",
      value: "",
      options: [
        {
          label: "综合排序",
          value: "sort",
        },
        {
          label: "最新订单",
          value: "create_time",
        },
        {
          label: "价格降序",
          value: "actual_amount_desc",
        },
        {
          label: "价格升序",
          value: "actual_amount_asc",
        },
      ],
    },
    // {
    //   title: "排序",
    //   type: "sort",
    //   value: 0,
    // },
  ]);

  const onSortConfirm = (value, type) => {
    uni.log.info("确定事件", value, type);
    if (type === "cell") {
      if (value === "create_time") {
        ordersData.orders = [
          {
            column: value,
            asc: false,
          },
        ];
      } else if (value === "actual_amount_asc") {
        ordersData.orders = [
          {
            column: "actual_amount",
            asc: true,
          },
        ];
      } else if (value === "actual_amount_desc") {
        ordersData.orders = [
          {
            column: "actual_amount",
            asc: false,
          },
        ];
      } else {
        ordersData.orders = [
          {
            column: "sort",
            asc: true,
          },
        ];
      }
    }
    // if (type === "sort") {
    //   ordersData.asc = value === "asc" ? true : false;
    // }
  };

  return {
    ordersData,
    menuList,
    onSortConfirm,
  };
}
