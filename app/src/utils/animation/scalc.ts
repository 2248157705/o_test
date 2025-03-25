import { reative, computed } from "vue";

export function Scalc() {
  let timer = null;
  const scalcData = reative({
    toggle: false,
  });

  const scalcStyle = computed(() => {
    if (scalcData.toggle) {
      return {
        transform: "scale(1.2)",
        transitionProperty: "transform",
        transitionDuration: "1s",
      };
    } else {
      return {
        transform: "scale(1)",
        transition: "transform 1s",
      };
    }
  });

  const start = () => {
    clear();
    timer = setInterval(() => {
      scalcData.toggle = !scalcData.toggle;
    }, 1000);
  };

  const clear = () => {
    timer && clearInterval(timer);
  };

  return {
    scalcStyle,
    start,
    clear,
  };
}
