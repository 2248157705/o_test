import { ref } from "vue";
import { cloneDeep } from "lodash-es";
import { useReportStore } from "@/stores/report";
import Events, { report, ReportStatus } from "@/utils/report/report";

// IM事件列表
export const allEventList = [
  // 登录相关
  "logined", // IM 登录成功事件
  "multiPortLogin", // 多个设备端使用相同 IM 账号（accid）登录的事件
  "kicked", // 被使用相同 IM 账号（accid）登录的其他设备端踢下线的事件
  "willReconnect", // 即将自动重连的事件
  "disconnect", // NIM 实例与云信服务端断开长连接的事件
  "syncdone", // 从云信服务端同步数据完成的事件

  // 消息相关
  "msg", // 在线消息到达事件
  "proxyMsg", // 代理消息（透传的）到达事件的事件
  "syncRoamingMsgs", // 初始化时从云信服务端同步漫游消息的事件
  "syncOfflineMsgs", // 初始化时从云信服务端同步离线消息的事件
  "broadcastMsgs", // 广播消息到达事件的事件（在线或者离线同步收到均会触发）
  "deleteSelfMsgs", // 单向删除某条消息的事件
  "clearServerHistoryMsgs", // 清除历史消息的事件（初始化同步或多端同步触发）
  "msgReceipts", // 消息已读事件，包括单聊和群聊消息
  "sysMsgUnread", // 注册/注销系统消息未读数变化事件

  // 会话相关
  "sessions", // 初始化时从云信服务端同步会话的事件
  "updateSession", // 会话更新的事件

  // 系统通知相关
  "sysMsg", // 在线系统通知到达事件的事件
  "syncSysMsgs", // 初始化时从云信服务端同步漫游/离线系统的事件
  "updateSystemMessages", // 系统通知更新的事件

  // 群组相关
  "teams", // 初始化时从云信服务端同步群组的事件
  "createTeam", // 创建群组的事件
  "updateTeamMember", // 群成员更新的事件
  "updateTeam", // 群组信息更新的事件
  "addTeamMembers", // 添加群成员的事件
  "updateTeamManagers", // 群管理更新的事件
  "transferTeam", // 群组转让的事件
  "removeTeamMembers", // 成员离群的事件，例如成员 A 调用了 leaveTeam 离群，其他成员会收到这个事件
  "dismissTeam", // 群组解散的事件
  "updateTeamMembersMute", // 群成员静音列表更新的事件
  "teamMsgReceipts", // 接收端到群消息已读回执的事件
  "myTeamMembers", // 当前账户所在的所有高级群中的成员信息变更的事件

  // 用户资料相关
  "syncMyNameCard", // 初始化时从云信服务端同步个人资料的事件
  "updateMyNameCard", // 个人资料更新的事件
  "users", // 初始化时从云信服务端同步其他用户相关资料的事件

  // 好友关系相关
  "updateBlackList", // 黑名单更新的事件
  "updateMuteList", // 静音列表更新的事件
  "syncFriend", // 好友相关资料进行多端同步的事件
  "friends", // 好友资料初始化同步的事件
  "relations", // 黑名单或静音列表初始化同步的事件

  // 事件订阅相关
  "pushEvents",
];

//  IM事件监听
export const onIMEvent = [
  "logined",
  "syncdone",
  "willReconnect",
  "kicked",
  "disconnect",
  "teams",
  "syncOfflineMsgs",
  "msg",
  "updateSession",
];

export const addListenEvent = (nim) => {
  if (nim) {
    const reportStore = useReportStore();
    const idClientMap = {};
    const reportIdClientItems = [];
    const isWillReconnect = ref(false);
    const launch_time = reportStore.userImData.launch_time;

    onIMEvent.forEach((key: any) => {
      nim.on(key, (res) => {
        const data = res ? cloneDeep(res) : {};

        // console.log(
        //   `++++++++++++++report im Receive ${key} event ++++++++++`,
        //   data
        // );
        switch (key) {
          case "logined":
            if (isWillReconnect.value) {
              // 断线重连
              report(Events.IM_RECONNECT_STATUS, {
                status: ReportStatus.SUCCESS,
                dur: new Date().getTime() - launch_time.disconnect,
              });
              isWillReconnect.value = false;
            } else {
              // 登录连接
              const now = new Date().getTime();
              reportStore.setIMLaunchTime({
                login_success: now,
              });
              report(Events.IM_LOGIN_STATUS, {
                status: ReportStatus.SUCCESS,
                dur: now - launch_time.init_success,
              });
            }
            break;
          case "syncdone":
            // 同步数据
            report(Events.IM_SYNCDONE, {
              dur: new Date().getTime() - launch_time.login_success,
            });
            break;
          case "willReconnect":
            // 重连
            isWillReconnect.value = true;
            report(Events.IM_RECONNECT, data);
            break;
          case "kicked":
            // 被踢下线
            report(Events.IM_KICKED);
            break;
          case "disconnect":
            // 断开连接
            reportStore.setIMLaunchTime({
              disconnect: new Date().getTime(),
            });
            report(Events.IM_DISCONNECTED, {
              code: data?.code,
            });
            break;
          case "teams":
            // 加载消息列表
            report(Events.IM_TEAMS, {
              dur: new Date().getTime() - launch_time.login_success,
            });
            break;
          case "syncOfflineMsgs":
            // 拉取离线消息
            data.msgs.forEach((msg) => {
              if (!reportIdClientItems.includes(msg?.idClient)) {
                report(Events.IM_MESSAGE_RECEIVE, {
                  sessionId: msg?.sessionId,
                  idClient: msg?.idClient,
                  idServer: msg?.idServer,
                  msgStatus: msg?.status,
                  msgType: msg?.type,
                  msgTo: msg?.to,
                  msgScene: msg?.scene,
                  fromClientType: msg?.fromClientType,
                  time: msg?.time,
                  dur: new Date().getTime() - msg?.time,
                });
                reportIdClientItems.push(msg?.idClient);
              }
            });
            break;
          case "msg":
            // 消息到达
            if (!reportIdClientItems.includes(data?.idClient)) {
              report(Events.IM_MESSAGE_RECEIVE, {
                sessionId: data?.sessionId,
                idClient: data?.idClient,
                idServer: data?.idServer,
                msgStatus: data?.status,
                msgType: data?.type,
                msgTo: data?.to,
                msgScene: data?.scene,
                fromClientType: data?.fromClientType,
                time: data?.time,
                dur: new Date().getTime() - data?.time,
              });
              reportIdClientItems.push(data?.idClient);
            }
            break;
          case "updateSession":
            // 发送消息
            if (data?.lastMsg?.idClient) {
              const idClient = data?.lastMsg?.idClient;
              const idServer = data?.lastMsg?.idServer;
              const status = data?.lastMsg?.status;
              const sessionId = data?.lastMsg?.sessionId;

              if (status === "sending") {
                // 发送消息
                idClientMap[idClient] = {
                  start_time: new Date().getTime(),
                };
              } else if (["sent", "success", "fail"].includes(status)) {
                // 发送消息结果
                if (!reportIdClientItems.includes(idClient)) {
                  // 请求耗时
                  const dur = idClientMap[idClient]
                    ? new Date().getTime() - idClientMap[idClient].start_time
                    : null;
                  report(Events.IM_MESSAGE_SEND, {
                    sessionId: sessionId,
                    idClient: idClient,
                    idServer: idServer,
                    msgStatus: status,
                    msgType: data?.lastMsg?.type,
                    msgTo: data?.lastMsg?.to,
                    msgScene: data?.lastMsg?.scene,
                    fromClientType: data?.lastMsg?.fromClientType,
                    dur: dur,
                    // userIds: [],
                  });
                  reportIdClientItems.push(idClient);
                }
              }
            }
            break;
        }
      });
    });
  }
};

export function NimReport() {
  return {};
}

export { ReportStatus, Events, report };
