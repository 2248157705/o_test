export const enum GroupType {
  CONSULT = 1, // 咨询群
  AFTER_SALES = 2, // 售后群
  AUDITING = 3, // 审核群
  SECURED_TRANSACTION = 4, // 中介担保
  TYPE_PRODUCT_RECOVERY = 5, // 号商回收
  POST_SALE_SERVICE = 6, // 售后群
}

export const enum MsgTemplate {
  PAYMENT_PENALTY = "payment_penalty", // 违约金支付模板
  APP_MESSAGE = "app_message", // 号商商品确认
  ROBOT_QA_LIST = "robot_qa_list", // "[机器人]"
  VALUATION_RESULT = "valuation_result", // 账号估价

  ACTIVITY_PARTICIPATION = "activity_participation", // 活动状态更新
  ACTIVITY_NON_WINNER = "activity_non_winner", //  机会多多
  ACTIVITY_WINNER = "activity_winner", // 幸运之星

  // 中介担保
  SECURED_TRANSACTION_PRODUCT_WAIT_ENTERED = "secured_transaction_product_wait_entered", // 商品录入模板
  SECURED_TRANSACTION_PRODUCT_DETAIL = "secured_transaction_product_detail", // 商品信息模板
  SECURED_TRANSACTION_PRODUCT_ENTERED = "secured_transaction_product_entered", // 商品已录入
  SECURED_TRANSACTION_PRODUCT_CONFIRM = "secured_transaction_product_confirm",
  SECURED_TRANSACTION_PRODUCT_BUYER_AGREED = "secured_transaction_product_buyer_agreed",
  SECURED_TRANSACTION_BUYER_PAYMENT_COMPLETED = "secured_transaction_buyer_payment_completed", // 买家已支付
  SECURED_TRANSACTION_DESC = "secured_transaction_desc", // 担保交易说明模板
  SECURED_TRANSACTION_PAYMENT_ORDER = "secured_transaction_payment_order", // 担保交易去下单模板
  SECURED_TRANSACTION_CONTRACT_FOR_BUYER = "secured_transaction_contract_for_buyer", // 待买家签署
  SECURED_TRANSACTION_CONTRACT_FOR_SELLER = "secured_transaction_contract_for_seller", // 待卖家签署
  SECURED_TRANSACTION_CONTRACT_BUYER_SIGN_COMPLETED = "secured_transaction_contract_buyer_sign_completed", // 买家已签署
  SECURED_TRANSACTION_CONTRACT_SELLER_SIGN_COMPLETED = "secured_transaction_contract_seller_sign_completed", // 卖家已签署
  SECURED_TRANSACTION_PRODUCT_BUYER_DISAGREED = "secured_transaction_product_buyer_disagreed", // 买家否决商品信息

  // 商品交易
  PRODUCT_DETAIL = "product_detail", // 商品卡片
  PRODUCT_COUNTER_OFFER = "product_counter_offer", //议价
  PRODUCT_COUNTER_OFFER_ACCEPTED = "product_counter_offer_accepted", //议价通过
  PRODUCT_COUNTER_OFFER_REJECTED = "product_counter_offer_rejected", //议价拒绝
  PRODUCT_PRICE_REDUCE_ACCEPTED = "product_price_reduce_accepted", //议价通过
  PRODUCT_AUDIT_PASS = "product_audit_pass", // 上架成功

  // 号商回收
  PRODUCT_RECOVERY_DESC = "product_recovery_desc", // "[商品交易说明]"
  PRODUCT_RECOVERY_WAIT_ENTERED = "product_recovery_wait_entered", // "[商品录入]"
  PRODUCT_RECOVERY_PRODUCT_CONFIRM = "product_recovery_product_confirm", // "[商品录入确认]"
  PRODUCT_RECOVERY_PRODUCT_BUYER_DISAGREED = "product_recovery_product_buyer_disagreed", // "[买家已拒绝]"
  PRODUCT_RECOVERY_PRODUCT_DETAIL = "product_recovery_product_detail", // "[商品信息]"
  PRODUCT_RECOVERY_ORDER_REFUND = "product_recovery_order_refund", // 号商商品退款
  PRODUCT_RECOVERY_REQUEST_CONFIRM_RECEIPT = "product_recovery_request_confirm_receipt", // 请商家确认收货
  PRODUCT_RECOVERY_CONTRACT_FOR_BUYER = "product_recovery_contract_for_buyer", // 号商买家合同
  PRODUCT_RECOVERY_BUYER_PAYMENT_COMPLETED = "product_recovery_buyer_payment_completed", // 买家已支付，进入验号和换绑流程。
  PRODUCT_RECOVERY_CONTRACT_BUYER_SIGN_COMPLETED = "product_recovery_contract_buyer_sign_completed", // 号商回收买家签署合同
  PRODUCT_RECOVERY_CONTRACT_SELLER_SIGN_COMPLETED = "product_recovery_contract_seller_sign_completed", // 号商回收卖家签署合同
}
export const enum CardBtnType {
  DEFAULT = 1,
  PRIMARY = 2,
}

export const enum ProductConfirmStatus {
  REJECTED = "REJECTED", // 拒绝
  ACCEPTED = "ACCEPTED", // 同意
}
