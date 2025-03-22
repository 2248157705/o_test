export function FontUtil() {
  const domModule = uni.requireNativePlugin("dom");
  domModule.addRule("fontFace", {
    fontFamily: "Barlow-SemiBold",
    src: "url('/static/iconFont/Barlow-SemiBold.otf')",
  });
  domModule.addRule("fontFace", {
    fontFamily: "Barlow-Medium",
    src: "url('/static/iconFont/Barlow-Medium.otf')",
  });
  domModule.addRule("fontFace", {
    fontFamily: "Barlow-Bold",
    src: "url('/static/iconFont/Barlow-Bold.otf')",
  });
  domModule.addRule("fontFace", {
    fontFamily: "Barlow-ExtraBold",
    src: "url('/static/iconFont/Barlow-ExtraBold.otf')",
  });
  domModule.addRule("fontFace", {
    fontFamily: "Barlow-Regular",
    src: "url('/static/iconFont/Barlow-Regular.otf')",
  });
}
