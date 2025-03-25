import { ref, computed, onBeforeUnmount } from "vue";
import { useMessageStore } from "@/stores/message";
import { includeNotification } from "@/components/im/conversation-list/";

export const MessageUtil = (props: {
  attach: any;
  from?: string;
  pick?: string[];
}) => {
  const messageStore = useMessageStore();

  const isPreview = ref(false);

  const template = computed(() => props.attach?.option?.template);

  const content = computed(() => props.attach?.option?.content || {});

  const classList = computed(() => {
    const arr = ["card-messsage-wrapper"];
    if (includeNotification(props.from)) {
      arr.push("notification-box");
    }
    return arr;
  });

  const content_labels = computed(() => {
    const arr = [];
    for (const key in content.value) {
      // 过滤掉不需要展示的字段
      if (!props.pick || props.pick.length === 0 || props.pick.includes(key)) {
        const record = messageStore.messageCardFieldLabel.find(
          (item) => item.field === key
        );
        if (record) {
          arr.push({
            label: record.label,
            value: content.value[record.field],
          });
        }
      }
    }
    return arr;
  });

  const previewPic = () => {
    if (content.value?.card_image) {
      isPreview.value = true;
      uni.previewImage({ urls: [content.value?.card_image] });
    }
  };

  onBeforeUnmount(() => {
    if (isPreview.value) {
      uni.closePreviewImage({
        fail: (err) => {
          console.log("图片预览关闭失败", err);
        },
      });
    }
  });

  return {
    template,
    content,
    content_labels,
    classList,
    previewPic,
  };
};
