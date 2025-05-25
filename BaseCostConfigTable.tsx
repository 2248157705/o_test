import TBaseCostInfo from "../../model/TBaseCostInfo.ts";
import {
  ActionType,
  EditableProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import TBaseCostConfig from "../../model/TBaseCostConfig.ts";
import { useMemo, useRef, useState } from "react";
import { useRequest } from "ahooks";
import TBaseCostInfoApi from "../../service/TBaseCostInfoApi.ts";
import _ from "lodash";
import { Button, Space, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TBaseChannelApi from "../../service/TBaseChannelApi.ts";
import TBaseChannel from "../../model/TBaseChannel.ts";

export interface BaseCostConfigTableProps {
  record: TBaseCostInfo;
}

export default ({ record }: BaseCostConfigTableProps) => {
  const actionRef = useRef<ActionType>(null);
  const [keywords, setKeywords] = useState("");
  const [editableKeys, setEditableRowKeys] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<TBaseCostConfig[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [treeData, setTreeData] = useState<TBaseChannel[]>([]);

  function treeToList(tree: TBaseChannel[], key = "children") {
    const result: TBaseChannel[] = [];

    //tree转list
    function traverse(node: TBaseChannel) {
      if (node) {
        result.push(node);
        const nodeKey = (node as any)[key] as any;
        if (nodeKey && nodeKey.length > 0) {
          nodeKey.forEach((child: TBaseChannel) => traverse(child));
        }
      }
    }
    if (Array.isArray(tree)) {
      tree.forEach((root) => traverse(root));
    } else if (tree) {
      traverse(tree);
    }

    return result;
  }

  const { run: searchChannel } = useRequest(
    async (channelName: string) => {
      if (channelName) {
        const res = await TBaseChannelApi.queryAll({ channelName });
        const list = treeToList(res);
        console.log("list", list);
        const channelList = list
          .filter(
            (item) =>
              item &&
              item.channelName &&
              item.channelName.indexOf(channelName) > -1,
          )
          .map((item) => ({
            value: item.id,
            parentChannelId: item.parentChannelId,
            label: item.channelName,
          }));
        console.log("channelList", channelList, list);
        setTreeData(channelList);
      }
    },
    { manual: true, debounceWait: 300 },
  );

  const columns: ProTableProps<TBaseCostConfig, number>["columns"] = [
    { title: "关键字", dataIndex: "keywords", hideInTable: true },
    { title: "渠道", dataIndex: "channelName", hideInTable: isEdit },
    {
      title: "渠道",
      dataIndex: "channelId",
      hideInTable: !isEdit,
      hideInSearch: true,
      valueType: "select",
      fieldProps: {
        showSearch: true,
        onSearch: searchChannel,
        options: treeData,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请选择渠道",
          },
        ],
      },
    },
    {
      title: "价格段开始",
      dataIndex: "priceRangStart",
      hideInSearch: true,
      valueType: "digit",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入价格段开始",
          },
          {
            type: 'number',
            min: 10,
            message: "价格段开始必须大于10",
          },
        ],
      },
    },
    {
      title: "价格段结束",
      dataIndex: "priceRangeEnd",
      valueType: "digit",
      hideInSearch: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入价格段结束",
          },
          {
            min: 0,
            message: "价格段结束必须大于0",
          },
        ],
      },
    },
    {
      title: "成本率",
      dataIndex: "rate",
      hideInSearch: true,
      valueType: "percent",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入成本率",
          },
          {
            pattern: /^-?\d+(\.\d{1,2})?$/,
            message: "请输入合法的数字（可包含负号和最多两位小数）",
          },
          {
            min: -100,
            message: "成本率必须大于-100",
          },
          {
            max: 100,
            message: "成本率必须小于100",
          },
        ],
      },
      render: (_, record) => {
        return record.rate + "%";
      },
    },
    {
      title: "固定值",
      dataIndex: "fixedValue",
      hideInSearch: true,
      valueType: "money",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入固定值",
          },
          {
            pattern: /^-?\d+(\.\d{1,2})?$/,
            message: "请输入合法的数字（可包含负号和最多两位小数）",
          },
          {
            min: -20000,
          },
        ],
      },
    },
    {
      title: "最大值",
      dataIndex: "maxValue",
      hideInSearch: true,
      valueType: "digit",
      tooltip: "计算后的值应在 [-最大值, 最大值]之间",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入最大值",
          },
          {
            type: 'number',
            min: 0,
            message: "最大值必须大于0",
          },
        ],
      },
    },
    {
      title: "操作人",
      dataIndex: "operator",
      hideInSearch: true,
      ellipsis: true,
      hideInTable: isEdit,
    },
  ];

  const {
    data: ___ = [],
    loading: dataSourceLoading,
    refresh: reloadDataSource,
  } = useRequest(async () => {
    const list = await TBaseCostInfoApi.queryConfigByCode({
      costCode: record.costCode!,
    });
    list.forEach((item: TBaseCostConfig) => {
      item.key = item.id;
    });
    setDataSource(list);
    return list;
  });
  const filterDataSource = useMemo(() => {
    return dataSource.filter((item: TBaseCostConfig) => {
      return (
        !keywords ||
        _.includes(item.channelName?.toLowerCase(), keywords.toLowerCase()) ||
        _.includes(item.priceRangStart?.toString(), keywords.toLowerCase()) ||
        _.includes(item.priceRangeEnd?.toString(), keywords.toLowerCase())
      );
    });
  }, [dataSource, keywords]);

  function checkForm(dataSource: TBaseCostConfig[]) {



    for (let idx = 0; idx < dataSource.length; idx++) {
      const item = dataSource[idx];
      if (!item.channelId || item.channelId < 0) {
        message.error(`第${idx + 1}行渠道为空`);
        return false;
      }
      if (
        item.priceRangStart == null ||
        item.priceRangStart < 0 ||
        !item.priceRangeEnd ||
        item.priceRangeEnd < 0
      ) {
        message.error(`第${idx + 1}行价格段为空`);
        return false;
      }
      if (item.priceRangeEnd < item.priceRangStart) {
        message.error(`第${idx + 1}行价格段结束必须大于价格段开始`);
        return false;
      }
      if (!item.rate && !item.fixedValue) {
        message.error(`第${idx + 1}行成本率或固定值为空`);
        return false;
      }
      if (item.maxValue == null || item.maxValue < 0) {
        message.error(`第${idx + 1}行最大值为空`);
        return false;
      }
    }


    const sorted = [...dataSource].sort((a, b) => a.priceRangStart - b.priceRangStart);
    console.log('00000',sorted,dataSource)
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      if (i < sorted.length - 1) {
        const next = sorted[i + 1];
        console.log('next',next,current.priceRangeEnd,next.priceRangStart,current.priceRangeEnd >= next.priceRangStart)
        if (current.priceRangeEnd >= next.priceRangStart) {
          console.log('error',`第 ${i+1} 档与第 ${i+2} 档价格区间重叠`)
          message.error(`第 ${i+1} 档与第 ${i+2} 档价格区间重叠`);
          return false;
          // return { valid: false, message: `第 ${i+1} 档与第 ${i+2} 档价格区间重叠` };
        }
      }
    }



    // for(let i=0;i<dataSource.length;i++){
    //   for(let j=i+1;j<dataSource.length;j++){
    //     if (dataSource[i].priceRangeEnd >= dataSource[j].priceRangStart) {
    //       message.error(`第 ${i} 档与第 ${j} 档价格区间重叠`);
    //     }
    //   }
    // }

    return true;
  }

  return (
    <EditableProTable<TBaseCostConfig>
      columns={columns}
      actionRef={actionRef}
      loading={dataSourceLoading}
      rowKey="key"
      pagination={false}
      maxLength={10000}
      value={filterDataSource}
      editable={{
        type: "multiple",
        editableKeys,
        onValuesChange: (_, rows) => {
          setDataSource(rows as TBaseCostConfig[]);
        },
      }}
      // 关闭默认的新建按钮
      recordCreatorProps={false}
      toolBarRender={() => {
        return [
          <div
            key={"tool"}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: 500,
            }}
          >
            <div>
              <Input.Search
                placeholder="关键字搜索：渠道，价格段"
                onChange={(value) => {
                  setKeywords(value.target.value);
                }}
              />
            </div>
            <div>
              <Space>
                {isEdit && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        const key = Math.random() * 10000;
                        setDataSource([
                          ...dataSource,
                          {
                            key,
                            channelName: keywords,
                          },
                        ]);
                        setEditableRowKeys([...editableKeys, key]);
                        setIsEdit(true);
                      }}
                      icon={<PlusOutlined />}
                    >
                      新建一行
                    </Button>
                    <Button
                      type={"primary"}
                      onClick={async () => {
                        if (checkForm(filterDataSource)) {
                          await TBaseCostInfoApi.saveCostConfig(
                            dataSource.map((item: TBaseCostConfig) => {
                              item.costCode = record.costCode;
                              return item;
                            }),
                          );
                          reloadDataSource();
                          setIsEdit(false);
                          setEditableRowKeys([]);
                        } else {
                          console.log(filterDataSource);
                        }
                      }}
                    >
                      保存
                    </Button>
                  </>
                )}
                <Button
                  type={"primary"}
                  onClick={() => {
                    setIsEdit(true);
                    setEditableRowKeys(
                      filterDataSource.map(
                        (item: TBaseCostConfig) => item.key!,
                      ),
                    );
                  }}
                >
                  编辑
                </Button>
              </Space>
            </div>
          </div>,
        ];
      }}
    ></EditableProTable>
  );
};
