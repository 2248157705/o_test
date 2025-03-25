import { ref, reactive } from "vue";
import { ProductConfirmStatus } from "@/components/im/utils/enums";

export const placeholderStyle = {
  fontSize: "24rpx",
  color: "#AFAFAF",
};

export const ReasonPopupUtil = () => {
  const reasonPopupRef = ref();
  const reasonPopupData = reactive({
    reason: "",
    status: ProductConfirmStatus.REJECTED,
  });

  const openReasonPopup = () => {
    reasonPopupRef.value?.open();
  };

  const closeReasonPopup = () => {
    reasonPopupRef.value?.close();
  };

  return {
    reasonPopupRef,
    reasonPopupData,
    openReasonPopup,
    closeReasonPopup,
  };
};

export { ProductConfirmStatus };
