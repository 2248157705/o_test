// import transaction_notification from "@/static/images/im/my/transaction_notification_avatar.png"
// import customer_service_avatar from "@/static/images/im/my/customer_service_avatar.png"
// import sys_notifications_avatar from "@/static/images/im/my/sys_notifications_avatar.png"

const env = import.meta.env.VITE_APP_ENV;

export const emptyList = [
  {
    id: "customer_service",
    sessionId: "customer_service",
    empty: true,
    scene: "team",
    to: "",
    lastMsg: {
      scene: "team",
      to: "23970497551",
      from: "test@role_cs_c@17177469303529",
      fromClientType: "Web",
      fromDeviceId: "fe9142c3345f054cb4266408f1c1a8b5",
      fromNick: "专属客服",
      // "time": 1718590392877,
      type: "text",
      body: "有问题可咨询哦~",
      idClient: "fd1acfaace4b6a17bf3b92f1fe3d9195",
      idServer: "1608632860162392248",
      userUpdateTime: 1717746930512,
      ext: '{"env":"test"}',
      flow: "in",
      target: "23970497551",
      sessionId: "team-23970497551",
      status: "unread",
      feature: "default",
    },
    // "updateTime": 1718590392877,
    unread: 0,
    teamId: "",
    name: "team@consultation@621",
    type: "advanced",
    owner: "test@role_u@1717746760704",
    level: 500,
    valid: true,
    memberNum: 2,
    memberUpdateTime: 1717758987917,
    createTime: 1717751911558,
    validToCurrentUser: true,
    joinMode: "noVerify",
    serverExt:
      '{"team":{"type":1},"user":{"id":621,"accid":"test@role_u@1717746760704"},"ticket":{"id":2,"type":1,"status":1,"param_id":""},"customer_service":{"id":1,"nickname":"\\u5ba2\\u670d-\\u963f\\u86cb","accid":"test@role_cs_c@17177469303529"}}',
    updateTeamMode: "manager",
    updateExtMode: "manager",
    mute: false,
    muteType: "none",
    renderKey: "team-239704975511",
    avatar:
      "https://static-gamehub-backend.wuhanxiaoli.cn/avatar/im_cs_avatar.jpg",
  },
  {
    id: "p2p-test@system_notification_test",
    sessionId: "p2p-test@system_notification_test",
    empty: true,
    scene: "p2p",
    to: `${env}@system_notification`,
    lastMsg: {
      scene: "p2p",
      to: "test@role_u@1717746760704",
      from: "test@system_notification",
      fromClientType: "Server",
      fromNick: "系统通知",
      // "time": 1718163316261,
      type: "text",
      body: "第一时间为你提供服务信息",
      userUpdateTime: 1716545394007,
      flow: "in",
      target: "test@system_notification",
      sessionId: "p2p-test@system_notification",
      status: "read",
      feature: "roam",
    },
    // "updateTime": 1718163316261,
    unread: 0,
    unreadMsgs: [],
    ack: 1718163316261,
    beMentioned: false,
    isMute: false,
    renderKey: "p2p-test@system_notification0",
    avatar:
      "https://static-gamehub-backend.wuhanxiaoli.cn/avatar/im_system_avatar.jpg",
  },
  {
    id: "p2p-test@trade_notification_test",
    sessionId: "p2p-test@trade_notification_test",
    empty: true,
    scene: "p2p",
    to: `${env}@trade_notification`,
    lastMsg: {
      scene: "p2p",
      to: "test@role_u@1717746760704",
      from: "test@system_notification",
      fromClientType: "Server",
      fromNick: "交易通知",
      // "time": 1718163316261,
      type: "text",
      body: "暂无新通知",
      userUpdateTime: 1716545394007,
      flow: "in",
      target: "test@system_notification",
      sessionId: "p2p-test@system_notification",
      status: "read",
      feature: "roam",
    },
    // "updateTime": 1718163316261,
    unread: 0,
    unreadMsgs: [],
    ack: 1718163316261,
    beMentioned: false,
    isMute: false,
    renderKey: "p2p-test@system_notification0",
    avatar:
      "https://static-gamehub-client.sh28.vip/assets/avatar/trade_avatar.png",
  },
];
