<template>
  <global-view ref="global" bgColor="#F7F9FA">
    <template #bar>
      <u-navbar
        bgColor="#ffffff"
        title="申请理赔"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      >
        <template #left>
          <image
            style="width: 48rpx; height: 48rpx"
            src="/static/images/common/icon_left.png"
          />
        </template>
      </u-navbar>
    </template>

    <view class="sale-form">
      <view
        v-if="insuranceData"
        class="sf-item"
        style="background: transparent"
      >
        <view class="claims-list">
          <view class="label">
            <u-badge :isDot="true" bgColor="#1CC7BE"></u-badge>
            <text class="text">号价</text>
          </view>
          <text class="name">¥{{ priceFormat(prodect_price, 2) }}</text>
        </view>
        <view class="claims-list">
          <view class="label">
            <u-badge :isDot="true" bgColor="#1CC7BE"></u-badge>
            <text class="text">已购买的包赔类型</text>
          </view>
          <text class="name">{{ insuranceData.name }}</text>
        </view>
        <view class="claims-list">
          <view class="label">
            <u-badge :isDot="true" bgColor="#1CC7BE"></u-badge>
            <text class="text">包赔的赔付比例</text>
          </view>

          <text class="name"
            >赔付号价{{ insuranceData.claim_rate * 100 }}%</text
          >
        </view>
        <view class="claims-list">
          <view class="label">
            <u-badge :isDot="true" bgColor="#1CC7BE"></u-badge>
            <text class="text">赔付金额</text>
          </view>
          <text class="name"
            >¥{{ priceFormat(insuranceData.claim_price, 2) }}</text
          >
        </view>
      </view>

      <view class="sf-item">
        <view class="title"><text>1、选择理赔原因</text></view>
        <view class="reason" @tap="showPopup = true">
          <text content="txt" class="">{{ reason || "请选择原因" }}</text>
          <image class="right" src="/static/images/afterSale/right.png" />
        </view>
      </view>

      <view class="sf-item">
        <view class="title"><text>2、提交凭证</text></view>
        <view class="desc">
          <u--textarea
            v-model="formData.apply_desc"
            placeholder="请补充描述和上传包含游戏登录找回的游戏截屏，有助于客服更好的处理售后问题"
            border="none"
            height="290rpx"
            count
            :clearable="true"
            :maxlength="300"
            style="background: #f4f5f6"
          ></u--textarea>
          <view class="voucher">
            <view class="head">
              <text class="v-title">上传凭证截图 （最多八张）</text>
              <text class="explain" @tap="showPopupType = true">查看说明</text>
            </view>
            <view class="pics">
              <!-- <image
                src="/static/images/afterSale/upload.png"
                class="img"
              ></image> -->
              <uploadImage
                placeholder="请规范上传图片，凭证申请更易通过"
                :isSell="false"
                :number="8"
                @change="(val) => handleChange(val)"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="sf-item">
        <view class="title"><text>3、上传身份证正反面</text></view>
        <view class="insurance-tip"
          ><text
            >保险理赔需要上传身份证正反面照片审核，上传的个人信息将会进行保密处理，仅用于保险理赔使用</text
          ></view
        >
        <view class="card-list">
          <view class="item" @click="addImages(0)">
            <view class="wrap">
              <u-upload
                :style="{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }"
                width="316rpx"
                height="196rpx"
                uploadText="上传图片"
                :fileList="
                  imageSrc[0]
                    ? [
                        {
                          url: imageSrc[0],
                        },
                      ]
                    : []
                "
                :maxCount="1"
                :disabled="true"
                :deletable="false"
                :previewFullImage="false"
              >
                <image
                  src="/static/images/afterSale/idCard_2.png"
                  class="d-img"
                ></image
              ></u-upload>
            </view>
          </view>
          <view class="item" @click="addImages(1)">
            <view class="wrap">
              <u-upload
                :style="{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }"
                width="316rpx"
                height="196rpx"
                uploadText="上传图片"
                :fileList="
                  imageSrc[1]
                    ? [
                        {
                          url: imageSrc[1],
                        },
                      ]
                    : []
                "
                :maxCount="1"
                :disabled="true"
                :deletable="false"
                :previewFullImage="false"
              >
                <image
                  src="/static/images/afterSale/idCard.png"
                  class="d-img"
                ></image>
              </u-upload>
            </view>
          </view>
        </view>

        <view class="card-rule">
          <view class="r-head">
            <view class="bg-line"></view>
            <text class="r-title">图片要求</text>
          </view>
          <view class="rule-photos">
            <image src="/static/images/afterSale/photos.png" class="d-photos" />
          </view>
        </view>
      </view>

      <view class="sf-item">
        <text class="title">4、情况核实</text>
        <view class="check"
          ><text
            >(1)、在您持有期间，该账号是否经历过出售、换绑、分享验证码或者密码给他人情况？</text
          ></view
        >

        <view class="check-wrap">
          <view
            class="check-normal"
            :class="{
              yes: formData.check_problem.problem1,
            }"
            @tap="formData.check_problem.problem1 = true"
          >
            <text>是</text>
          </view>
          <view
            class="check-normal"
            :class="{
              yes:
                isBoolean(formData.check_problem.problem1) &&
                !formData.check_problem.problem1,
            }"
            @tap="formData.check_problem.problem1 = false"
          >
            <text>否</text>
          </view>
        </view>

        <view class="check"
          ><text>(2)、该账号的实名是否已修改成您自己的？</text></view
        >

        <view class="check-wrap">
          <view
            class="check-normal"
            :class="{
              yes: formData.check_problem.problem2,
            }"
            @tap="formData.check_problem.problem2 = true"
          >
            <text>是</text>
          </view>
          <view
            class="check-normal"
            :class="{
              yes:
                isBoolean(formData.check_problem.problem2) &&
                !formData.check_problem.problem2,
            }"
            @tap="formData.check_problem.problem2 = false"
          >
            <text>否</text>
          </view>
        </view>
      </view>

      <view
        class="submit-btn-view"
        :style="{ paddingBottom: safeAreaPadding() }"
      >
        <view class="submit-btn-operation">
          <view class="submit-btn" @tap="handleApply">
            <text class="text">提交</text>
          </view>
        </view>
      </view>
    </view>
    <Popup title="请选择投诉原因" :show="showPopup" @close="showPopup = false">
      <view
        v-for="(item, index) in afterClaimsApplyReasonOptions"
        :key="index"
        class="popup-item"
      >
        <u-checkbox-group
          v-model="checkedAgree[index]"
          activeColor="#539f9a"
          @change="handleAgreeChange(index)"
        >
          <label class="read-box" @tap="handleAgreeChange(index)">
            <text
              class="text"
              :style="{
                color:
                  checkedAgree[index] && checkedAgree[index].length
                    ? '#1CC7BE'
                    : '',
              }"
              >{{ item.name }}</text
            >
            <view class="checkbox">
              <u-checkbox
                v-model="checkedAgree[index]"
                shape="circle"
                activeColor="#1CC7BE"
              />
            </view>
          </label>
        </u-checkbox-group>
      </view>

      <view class="popup-submit" @tap="confirm"><text>提交</text></view>
    </Popup>

    <popup-type
      title="图片凭证说明"
      :show="showPopupType"
      @close="showPopupType = false"
    >
      <template #bgView>
        <view class="bg-view"></view>
      </template>

      <view class="type-intro">
        <text class="intro-text"
          >1、凭证需要清晰展示所遇到问题，且符合退款原因。</text
        >
      </view>
      <view class="type-intro">
        <text class="intro-text">2、如已与卖家协商一致，请附上群聊截图。 </text>
      </view>

      <view class="type-intro">
        <text class="intro-text"
          >3、如凭证不符合规范，审核不通过，可再次按照规范提交凭证。
        </text>
      </view>

      <view class="intro-btn" @tap="showPopupType = false">
        <text class="btn-text">开始上传</text>
      </view>
    </popup-type>
  </global-view>
</template>
<script setup lang="ts">
import GlobalView from "@/components/global-view/index.vue";
import { reactive, ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { chooseImagePermission } from "@/utils/choose-file";
import uploadFile from "@/components/iz-aloss-uploader/iz-uploader";
import uploadImage from "@/components/iz-uploader-img/iz-uploader-img.vue";
import { getCosAuthJava } from "@/api/common";
import { claimsApply } from "@/api/order";
import Popup from "@/components/popup/index.vue";
import { afterClaimsApplyReasonOptions } from "@/pages/order/js/order";
import { isBoolean } from "lodash-es";
import { safeAreaPadding, priceFormat } from "@/utils";
import PopupType from "@/components/my-popup/index.vue";
import { GoodsOrder } from "@/pages/order/js/order";
import { formatList } from "@/pages/goods/js/insurance";

const { detailData, fetchOrderDetail } = GoodsOrder();
const limitNumber = 8;
const imageList = ref([]);
const checkedAgree = ref([]);
const showPopup = ref(false);
const showPopupType = ref(false);
const imageSrc = ref([]);
const formData = reactive({
  order_id: "",
  reason: "",
  apply_desc: "",
  voucher_pics: [],
  id_card_pics: [],
  check_problem: {
    problem1: "",
    problem2: "",
  },
});
const reason = ref("");

onLoad((param) => {
  formData.order_id = param.order_id;
  fetchOrderDetail(param.order_id);
});

// 商品价格，如果有议价，显示议价价格
const prodect_price = computed(() => {
  const { price_detail, product } = detailData.detail;
  return price_detail?.bargain_amount || product?.product_price;
});

const insuranceData = computed(() => {
  if (detailData?.detail?.order_insurance?.insurance_snapshot) {
    const list = [detailData?.detail?.order_insurance?.insurance_snapshot];
    return formatList(list, prodect_price.value)[0];
  }
  return null;
});

const confirm = () => {
  showPopup.value = false;

  const data =
    afterClaimsApplyReasonOptions[
      checkedAgree.value.findIndex((value) => value)
    ];
  formData.reason = data.value;
  reason.value = data.name;
};

const handleAgreeChange = (index) => {
  checkedAgree.value = [];
  const bool = checkedAgree.value[index]?.length;
  checkedAgree.value[index] = bool ? [] : [""];
};

const extractFileName = (url) => {
  // 定义正则表达式匹配文件名
  const regex = /[^/]+$/;
  // 使用正则表达式执行匹配
  const matches = url.match(regex);
  // 如果匹配成功，返回文件名部分，否则返回null
  return matches ? matches[0] : null;
};

const addImages = (index) => {
  const checkNumber = limitNumber - imageList.value.length;
  uni.chooseImage({
    count: checkNumber,
    sizeType: "original",
    sourceType: ["album", "camera"],
    success: async (res) => {
      const count =
        checkNumber <= res.tempFilePaths.length
          ? checkNumber
          : res.tempFilePaths.length;
      for (let i = 0; i < count; i++) {
        const name = res.tempFiles[i].name || res.tempFiles[i].path;
        getCosAuthJava({
          type: "idCard",
          source_file_name_list: [extractFileName(name)],
        }).then((cos) => {
          const data = cos[0];
          upload(
            res.tempFilePaths[i],
            {
              path: data.oss_file_key,
              access_key_id: data.oss_key_resp.tmp_secret_id,
              security_token: data.oss_key_resp.session_token,
              access_key_secret: data.oss_key_resp.tmp_secret_key,
              domain: data.oss_key_resp.domain,
            },
            index
          );
        });
      }
    },
    fail: ({ code }) => {
      chooseImagePermission(code);
    },
  });
};

const upload = (src, ossAuthData, index) => {
  new Promise(function (resolve, reject) {
    uploadFile(
      ossAuthData,
      src,
      "png",
      (data) => {
        resolve(data);
      },
      reject
    );
  })
    .then((res) => {
      imageSrc.value[index] = src;
      formData.id_card_pics[index] = res;
    })
    .catch((e) => {
      uni.$main.toast(e);
    });
};

const handleApply = () => {
  if (!formData.reason) {
    uni.$main.toast("请选择原因");
    return;
  }
  if (!formData.apply_desc) {
    uni.$main.toast("请填写描述");
    return;
  }
  if (formData.apply_desc.length < 15) {
    uni.$main.toast("请输入至少15字数的凭证描述");
    return;
  }
  if (!formData.voucher_pics.length) {
    uni.$main.toast("请上传图片凭证");
    return;
  }
  if (formData.id_card_pics.length != 2) {
    uni.$main.toast("请上传完整身份证正反面");
    return;
  }
  if (
    !isBoolean(formData.check_problem.problem1) ||
    !isBoolean(formData.check_problem.problem2)
  ) {
    uni.$main.toast("请选择核实情况");
    return;
  }

  claimsApply(formData)
    .then(async () => {
      uni.$main.toast("提交成功");
      await uni.$u.sleep(1500);
      uni.navigateBack();
    })
    .catch((err) => {
      uni.$main.toast(err.msg);
    });
};

const handleChange = (imageData) => {
  formData.voucher_pics = imageData.details.map((item) => {
    return item.url;
  });
};
</script>
<style scoped lang="scss">
:deep(.u-textarea__count) {
  bottom: 24rpx;
  right: 24rpx;
  font-size: 28rpx;
  color: #afafaf;
}
.sale-form {
  background: #f7f9fa;
  padding-bottom: 160rpx;

  .claims-list {
    padding: 10rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      display: flex;
      align-items: center;

      .text {
        margin-left: 10rpx;
        font-weight: 400;
        font-size: 32rpx;
        color: #1a1a1a;
      }
    }
    .name {
      font-weight: 400;
      font-size: 32rpx;
      color: #afafaf;
    }
  }

  .sf-item {
    padding: 24rpx;
    background: white;
    margin: 24rpx;
    border-radius: 12rpx;

    .check {
      padding: 16rpx 0rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #1a1a1a;
    }
    .check-wrap {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .check-normal {
        flex: 1;
        padding: 14rpx;
        margin: 16rpx;
        font-weight: 400;
        font-size: 28rpx;
        text-align: center;
        background: #f4f5f6;
        color: #606060;
        border-radius: $app-box-radius;
        border: 2rpx solid #f4f5f6;
      }
      .yes {
        background: #f0fffe;
        border: 2rpx solid $app-main-color;
        color: $app-main-color;
      }
    }

    .title {
      font-weight: 500;
      font-size: 32rpx;
      color: #1a1a1a;
      //padding: 20rpx;
      padding: 0rpx 0rpx 20rpx 0rpx;
      border-radius: 8rpx;
    }
    .reason {
      padding: 32rpx 24rpx;
      background: #f4f5f6;
      position: relative;
      border-radius: 8rpx;
      .txt {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf;
      }
      .right {
        top: 40rpx;
        right: 24rpx;
        position: absolute;
        width: 32rpx;
        height: 32rpx;
      }
    }

    .voucher {
      .head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16rpx 0rpx;
        .v-title {
          font-weight: 400;
          font-size: 28rpx;
          color: #1a1a1a;
        }
        .explain {
          font-weight: 400;
          font-size: 24rpx;
          color: $app-main-color;
        }
      }
      .tip {
        font-weight: 400;
        font-size: 24rpx;
        color: #afafaf;
        text-align: left;
      }
      .pics {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        .img {
          width: 152rpx;
          height: 152rpx;
        }
      }
    }

    .insurance-tip {
      padding: 20rpx 0rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #afafaf;
    }

    .card-list {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .item {
        flex: 1;
        margin: 0rpx 10rpx;
        height: 200rpx;
        .upload-card-img {
          width: 100%;
          height: 100%;
        }
        .wrap {
          background: #f4f5f6;
          position: relative;
          width: 100%;
          height: 100%;
          .d-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            //margin: auto;
            width: 196rpx;
            height: 140rpx;
          }
        }
      }
    }

    .card-rule {
      .r-head {
        padding: 24rpx 0rpx;
        position: relative;
        height: 40rpx;

        .bg-line {
          position: absolute;
          width: 100%;
          height: 2rpx;
          left: 0rpx;
          top: 46rpx;
          background: #f7f9fa;
          z-index: 1;
        }
        .r-title {
          position: absolute;
          margin: auto;
          width: 100%;
          text-align: center;
          font-weight: 400;
          font-size: 28rpx;
          color: #afafaf;
          z-index: 2;
        }
      }
      .rule-photos {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .d-photos {
          width: 100%;
          height: 136rpx;
        }
      }
    }
  }

  .submit-btn-view {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    z-index: 1000;
    box-shadow: 0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.06);
    .submit-btn-operation {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24rpx;
      // #ifndef APP-NVUE
      box-sizing: border-box;
      // #endif
      .submit-btn {
        flex: 1;
        height: $app-max-btn-height;
        background-color: $app-main-color;
        border-radius: $app-box-radius;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
          font-weight: 500;
          font-size: 32rpx;
          color: #ffffff;
        }
      }
    }
  }
}
.popup-item {
  border-bottom: 2rpx solid #f4f5f6;
  height: 96rpx;
  .read-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: #1a1a1a;
      line-height: 34rpx;
      margin-top: 20rpx;
    }
    .checkbox {
      margin-top: 20rpx;
    }
  }
}
.popup-submit {
  margin: 24rpx 0;
  background: $app-main-color;
  border-radius: 12rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 32rpx;
  color: #ffffff;
}

.type-intro {
  display: flex;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  z-index: 2;
  .intro-text {
    font-weight: 400;
    font-size: 32rpx;
    color: #606060;
    line-height: 58rpx;
  }
}
.bg-view {
  position: absolute;
  flex: 1;
  height: 250rpx;
  top: 0;
  right: 0;
  left: 0;
  background: linear-gradient(to bottom, #ecfefd, #fff);
  border-top-right-radius: 16rpx;
  border-top-left-radius: 16rpx;
  z-index: 1;
}
.intro-btn {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $app-main-color;
  border-radius: 12rpx;
  margin-top: 20rpx;
  z-index: 2;
  .btn-text {
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
  }
}
</style>
