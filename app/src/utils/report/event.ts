// 系统事件
export const APP_LAUNCH = "APP_LAUNCH"; // app启动
export const APP_EXIT = "APP_EXIT"; // app退出
export const APP_INSTALL = " APP_INSTALL"; // 安装
export const PAGE_VIEW = "PAGE_VIEW"; // 页面访问
export const PAGE_VIEW_DUR = "PAGE_VIEW_DUR"; // 页面加载耗时
export const PAGE_VIEW_STAY = "PAGE_VIEW_STAY"; // 页面停留时长
export const REQUEST_NETWORK = "REQUEST_NETWORK"; // 网络请求
export const CODE_ERROR = "CODE_ERROR"; // 代码错误

// 更新应用
export const APP_CHECK_UPDATE = "APP_CHECK_UPDATE"; // 检查更新应用
export const APP_CHECK_UPDATE_STATUS = "APP_CHECK_UPDATE_STATUS"; // 检查更新应用状态
export const APP_UPDATE_PAGE = "APP_UPDATE_PAGE"; // 更新应用页
export const APP_UPDATE_STATUS = "APP_UPDATE_STATUS"; // 更新应用状态
export const APP_DOWNLOAD_STATUS = "APP_DOWNLOAD_STATUS"; // 下载应用状态
export const APP_STORE_OPEN_STATUS = "APP_STORE_OPEN_STATUS"; // 跳转应用商店状态
export const APP_UPDATE_CANCEL = "APP_UPDATE_CANCEL"; // 稍后再说

// 用户事件
export const USER_LOGIN = "USER_LOGIN"; // 用户登录
export const USER_LOGIN_STATUS = "USER_LOGIN_STATUS"; // 用户登录状态
export const USER_LOGIN_PRE = "USER_LOGIN_PRE"; // 发送验证码/唤起APP
export const USER_LOGIN_PRE_STATUS = "USER_LOGIN_PRE_STATUS"; // 发送验证码/唤起APP状态
export const USER_INFO = "USER_INFO"; // 用户信息

// 订单交易事件
export const ORDER_VIEW = "ORDER_VIEW"; // 确认订单访问
export const ORDER_PURCHASE_PREVIEW = "ORDER_PURCHASE_PREVIEW"; // 预下单
export const ORDER_PURCHASE_PREVIEW_STATUS = "ORDER_PURCHASE_PREVIEW_STATUS"; // 预下单状态
export const ORDER_PURCHASE = "ORDER_PURCHASE"; // 确认下单
export const ORDER_PURCHASE_STATUS = "ORDER_PURCHASE_STATUS"; // 确认下单状态
export const ORDER_PURCHASE_PAYMENT = "ORDER_PURCHASE_PAYMENT"; // 发起付款
export const ORDER_PURCHASE_PAYMENT_STATUS = "ORDER_PURCHASE_PAYMENT_STATUS"; // 发起付款状态
export const ORDER_PURCHASE_AFTERSALE_APPLY = "ORDER_PURCHASE_AFTERSALE_APPLY"; // 申请售后
export const ORDER_PURCHASE_AFTERSALE_CLAIMS =
  "ORDER_PURCHASE_AFTERSALE_CLAIMS"; // 申请理赔
export const ORDER_PURCHASE_REFUND_APPLY = "ORDER_PURCHASE_REFUND_APPLY"; // 退款申请
export const ORDER_ENTER_CHAT = "ORDER_ENTER_CHAT"; // 支付进入群聊
export const ORDER_ENTER_CHAT_STATUS = "ORDER_ENTER_CHAT_STATUS"; // 支付进入群聊状态

// 商品事件
export const PRODUCT_BUY = "PRODUCT_BUY"; // 立即购买
export const PRODUCT_VIEW = "PRODUCT_VIEW"; // 商品访问
export const PRODUCT_COLLECT_STATUS = "PRODUCT_COLLECT_STATUS"; // 商品收藏状态
export const PRODUCT_UP = "PRODUCT_UP"; // 商品上架
export const PRODUCT_UP_STATUS = "PRODUCT_UP_STATUS"; // 商品上架状态
export const PRODUCT_DOWN = "PRODUCT_DOWN"; // 商品下架
export const PRODUCT_DOWN_STATUS = "PRODUCT_DOWN_STATUS"; // 商品下架状态
export const PRODUCT_TRANSACTION_FLOW = "PRODUCT_TRANSACTION_FLOW"; // 交易流程
export const PRODUCT_CS = "PRODUCT_CS"; // 客服
export const PRODUCT_NEGOTIATE_PRICE = "PRODUCT_NEGOTIATE_PRICE"; // 议价
export const PRODUCT_NEGOTIATE_PRICE_SUBMIT = "PRODUCT_NEGOTIATE_PRICE_SUBMIT"; // 提交议价

// 首页
export const HOME_APPRAISE = "HOME_APPRAISE"; // 一键估价
export const HOME_APPRAISE_GAME = "HOME_APPRAISE_GAME"; // 选择游戏
export const HOME_APPRAISE_SUBMIT = "HOME_APPRAISE_SUBMIT"; // 提交
export const HOME_APPRAISE_CONSIGN = "HOME_APPRAISE_CONSIGN"; // 一键寄售
export const HOME_RECYCLE = "HOME_RECYCLE"; // 闪电回收
export const HOME_GUARANTEE = "HOME_GUARANTEE"; // 中介担保
export const HOME_RANKING = "HOME_RANKING"; // 更多排行
export const HOME_RANKING_BUY = "HOME_RANKING_BUY"; // 我要买号
export const HOME_BONUS = "HOME_BONUS"; // 主播福利
export const HOME_BONUS_DRAW = "HOME_BONUS_DRAW"; // 参与抽奖
export const HOME_PICKLEAK = "HOME_PICKLEAK"; // 捡漏
export const HOME_ALL_GAMES = "HOME_ALL_GAMES"; // 全部游戏ICON

// 买号BUY
export const BUY_SELECT_GAME = "BUY_SELECT_GAME"; // 选择游戏

// 官方寄售
export const SELL_CONSIGN = "SELL_CONSIGN"; // 官方寄售
export const SELL_RECYCLE = "SELL_RECYCLE"; // 闪电回收
export const SELL_GUARANTEE = "SELL_GUARANTEE"; // 中介担保

export const SELL_CONSIGN_SELECT_GAME = "SELL_CONSIGN_SELECT_GAME"; // 官方寄售 选择游戏
export const SELL_CONSIGN_PUBLISH = "SELL_CONSIGN_PUBLISH"; // 立即发布按钮
export const SELL_CONSIGN_VIEW_PRODUCT = "SELL_CONSIGN_VIEW_PRODUCT"; // 查看商品按钮
export const SELL_CONSIGN_CONTINUE_PUBLISH = "SELL_CONSIGN_CONTINUE_PUBLISH"; // 继续发布

export const SELL_RECYCLE_SELECT_GAME = "SELL_RECYCLE_SELECT_GAME"; // 闪电回收 选择游戏
export const SELL_RECYCLE_CS = "SELL_RECYCLE_CS"; // 联系号商
export const SELL_RECYCLE_SUBMIT = "SELL_RECYCLE_SUBMIT"; // 提交商品录入

export const SELL_GUARANTEE_SELECT_GAME = "SELL_GUARANTEE_SELECT_GAME"; // 中介担保 选择游戏
export const SELL_GUARANTEE_CS = "SELL_GUARANTEE_CS"; // 咨询客服
export const SELL_GUARANTEE_SUBMIT = "SELL_GUARANTEE_SUBMIT"; // 提交商品录入

// 我的
export const MY_CONTRACT = "MY_CONTRACT"; // 合同
export const MY_COLLECT = "MY_COLLECT"; // 收藏
export const MY_FOOTMARK = "MY_FOOTMARK"; // 足迹
export const MY_CONSULTATION_RECORD = "MY_CONSULTATION_RECORD"; // 咨询记录
export const MY_HELP = "MY_HELP"; // 帮助中心
export const MY_SAFETY = "MY_SAFETY"; // 安全中心
export const MY_RULE = "MY_RULE"; // 平台规则
export const MY_CS = "MY_CS"; // 专属客服

export const MY_COMPLAINT_FEEDBACK = "MY_COMPLAINT_FEEDBACK"; // 投诉与反馈
export const MY_COMPLAINT = "MY_COMPLAINT"; // 投诉服务
export const MY_COMPLAINT_SUBMIT = "MY_COMPLAINT_SUBMIT"; // 投诉提交
export const MY_FEEDBACK = "MY_FEEDBACK"; // 意见反馈
export const MY_FEEDBACK_SUBMIT = "MY_FEEDBACK_SUBMIT"; // 意见反馈提交

export const MY_BALANCE = "MY_BALANCE"; // 我的余额
export const MY_BALANCE_WITHDRAW = "MY_BALANCE_WITHDRAW"; // 提现
export const MY_BALANCE_WITHDRAW_STATUS = "MY_BALANCE_WITHDRAW_STATUS"; // 提现状态

// IM指标
export const IM_INIT = "IM_INIT"; // IM初始化
export const IM_INIT_STATUS = "IM_INIT_STATUS"; // IM初始化状态
export const IM_LOGIN = "IM_LOGIN"; // IM登录
export const IM_LOGIN_STATUS = "IM_LOGIN_STATUS"; // IM登录状态
export const IM_TEAMS = "IM_TEAMS"; // 群聊列表
export const IM_TEAMS_HISTORY_MSG_STATUS = "IM_TEAMS_HISTORY_MSG_STATUS"; // 群聊历史消息列表
export const IM_TEAM_CREATE = "IM_TEAM_CREATE"; // 群聊创建(不埋)
export const IM_TEAM_CREAT_STATUS = "IM_TEAM_CREAT_STATUS"; // 群聊创建状态(不埋)
export const IM_TEAM_ENTER = "IM_TEAM_ENTER"; // 打开群聊
export const IM_TEAM_ENTER_STAUTS = "IM_TEAM_ENTER_STAUTS"; // 打开群聊状态
export const IM_MESSAGE_SEND = "IM_MESSAGE_SEND"; // 消息发送
export const IM_MESSAGE_RECEIVE = "IM_MESSAGE_RECEIVE"; // 消息到达
export const IM_DISCONNECTED = "IM_DISCONNECTED"; // IM断开连接
export const IM_RECONNECT = "IM_RECONNECT"; // // IM重连
export const IM_RECONNECT_STATUS = "IM_RECONNECT_STATUS"; // // IM重连状态
export const IM_KICKED = "IM_KICKED"; // // 被踢下线
export const IM_SYNCDONE = "IM_SYNCDONE"; // // 同步数据完成
