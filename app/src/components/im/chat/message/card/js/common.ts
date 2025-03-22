import { computed } from "vue";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";
import { useMainStore } from "@/stores/main";
import { CardBtnType } from "@/components/im/utils/enums";
import { includeNotification } from "@/components/im/conversation-list/";
import dayjs from "dayjs";

export const useCard = (options: any) => {
  const { clickable_by, idClient, to } = options;
  const messageStore = useMessageStore();

  const getBtnTypeKey = (type: CardBtnType = CardBtnType.PRIMARY) => {
    return `${to}_${idClient}_${type}`;
  };

  const disabled = computed(() => (type: string = CardBtnType.PRIMARY) => {
    const operationPermissions = messageStore.getOperationPermissions(
      getBtnTypeKey(type)
    );

    const data: any = messageStore.loginCredential;

    if (operationPermissions === false) {
      return true;
    } else if (clickable_by && clickable_by.length < 1) {
      return false;
    } else {
      return clickable_by.indexOf(data?.accid) !== -1 ? false : true;
    }
  });

  return {
    disabled,
    getBtnTypeKey,
  };
};

export const useCardUtil = (options?: {
  clickable_by: string[];
  idClient: string;
  to: string;
  from?: string;
}) => {
  const invalidMaxDay = 10; // 失效天数
  const { clickable_by, idClient, to, time, from } = options;
  const messageStore = useMessageStore();
  const userStore = useUserStore();
  const mainStore = useMainStore();

  // 是否实名认证;
  const isCertified = computed(() => Boolean(userStore?.userInfo?.identifyNum));

  // 是否失效 超过10天失效
  const isInvalid = computed(() => {
    if (time) {
      const diff = dayjs().diff(dayjs(time), "day");
      return diff > invalidMaxDay;
    }
    return false;
  });

  // 是否买家
  const isBuyerByAccid = computed(() => {
    const { loginCredential, teamExt } = messageStore.loginCredential;
    return loginCredential?.accid === teamExt?.buyer?.accid;
  });

  // 样式
  const classList = computed(() => {
    const arr = ["card-messsage-wrapper"];
    if (includeNotification(from)) {
      arr.push("notification-box");
    }
    return arr;
  });

  // 获取操作key
  const getKey = (type: CardBtnType = CardBtnType.PRIMARY) => {
    return `${to}_${idClient}_${type}`;
  };

  // 是否有操作历史记录
  const isOperated = (type: CardBtnType = CardBtnType.PRIMARY) => {
    const key = getKey(type);
    console.log("key--", key);
    return messageStore.getOperationPermissions(key);
  };

  // 是否有操作权限
  const isCanClickable = () => {
    const data = messageStore.loginCredential;
    if (clickable_by && clickable_by.length > 0 && data?.accid) {
      return clickable_by.includes(data?.accid);
    } else {
      return false;
    }
  };

  // 是否禁用
  const checkIsDisabled = (type: CardBtnType = CardBtnType.PRIMARY) => {
    return !isCanClickable() || isOperated(type);
  };

  // 更新操作权限历史记录
  const updateOperationPermissions = (key: string) => {
    key = key || getKey();
    messageStore.setSessionMsgBtnKey(key);
    messageStore.setOperationPermissions(true);
  };

  // 记录操作key
  const setOperationKey = (key: string) => {
    key = key || getKey();
    messageStore.setSessionMsgBtnKey(key);
  };

  // 跳转
  const navigateTo = (url: string) => {
    uni.navigateTo({
      url: url,
      complete() {
        setOperationKey();
      },
    });
  };

  // 显示实名认证弹窗
  const showRealPopup = () => {
    mainStore.toggleRealPopup(true);
  };

  // 验证规则
  const validationRule = (cb) => {
    if (!isCertified.value) {
      showRealPopup();
    } else {
      cb && cb();
    }
  };

  return {
    classList,
    isCertified,
    isInvalid,
    isBuyerByAccid,
    getKey,
    isOperated,
    isCanClickable,
    checkIsDisabled,
    setOperationKey,
    updateOperationPermissions,
    navigateTo,
    validationRule,
    showRealPopup,
  };
};
