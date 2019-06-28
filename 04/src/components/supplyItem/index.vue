<!--  -->
<template>
    <div class="list-item clearfix relative" @click="$router.push(`/detail/${item.supplyDemandId}`)">
        <div class="item-left left">
            <img v-lazy="item.supplyDemandCoverPic ? filterImg(item.supplyDemandCoverPic.picPath) : ''" :key="item.supplyDemandCoverPic ? filterImg(item.supplyDemandCoverPic.picPath) : ''">
        </div>
        <div class="item-right left">
            <h3 class="item-title">{{item.title}}</h3>
            <div class="item-tips">
                <span>已认证</span>
            </div>
            <h4 class="item-campany">{{ item.userName }}</h4>
            <h4 class="item-address">{{item.provinceAddress}}-{{item.cityAddress}}</h4>
            <div class="item-tags">
                <span><i class="list-icon-time"></i>{{ item.gmtModified && item.gmtModified.split(' ')[0] }}</span>
                <span><i class="list-icon-see"></i>{{ item.viewNum }}</span>
                <!-- <span><i class="list-icon-contact"></i>13</span> -->
            </div>
        </div>
        <div class="divider divider-horizontal divider-bottom"></div>
    </div>
</template>

<script>
import { mapGetters } from "Vuex";
export default {
  name: "supplyItem",
  props: ["item"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("common", ["userInfo"])
  },
  methods: {
    filterImg(img) {
      return this.userInfo.resourcesUrl + img;
    }
  }
};
</script>
<style lang='scss' scoped>
.list-item {
  padding: 30px 30px 30px 30px;
  .item-left {
    width: 280px;
    height: 210px;
    margin-right: 30px;
    img {
      object-fit: cover;
      height: 2.8rem;
    }
  }
  .item-right {
    width: 51%;
    .item-title {
      font-size: 32px;
      color: #333;
      padding-bottom: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
    .item-tips {
      margin-bottom: 25px;
      font-size: 20px;
      span {
        border-radius: 4px;
        border: 2px solid #ff6419;
        padding: 0px 9px;
        color: #ff6419;
        margin-right: 20px;
      }
    }
    h4 {
      color: #999999;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .item-tags {
      font-size: 24px;
      line-height: 24px;
      color: #999;
      padding-top: 10px;
      span {
        margin-right: 15px;
        i {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 12px;
          background-size: 100% 100%;
          background-position: 50%;
          // vertical-align: bottom;
        }
        i.list-icon-time {
          background-image: url("./images/list_icon_time.png");
        }
        i.list-icon-see {
          background-image: url("./images/list_icon_see.png");
        }
        i.list-icon-contact {
          background-image: url("./images/list_icon_contact.png");
        }
      }
      span:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>