# IM链路监控

### 更新的文件

```bash
@/components/im/chat/index.vue

@/components/im/conversation-list/index.ts

@/components/im/utils/connect.ts
```

### 上报JS

```js
import {
  addListenEvent,
  ReportStatus,
  Events,
  report,
} from "@/utils/report/module/im";

// 上报
report(Events.USER_LOGIN_PRE_STATUS, {});
```
