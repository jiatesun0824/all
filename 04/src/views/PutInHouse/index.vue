<template>
  <div class="putinhouse">
    <div class="putinhouse__header">
      <i class="putinhouse__header--back" @click="$router.back()"></i>
      <span class="putinhouse__header--title">装进我家</span>
    </div>
    <!-- <div class="putinhouse__banner">
      <img src="./images/order_msg_01.png">
    </div> -->
    <div class="putinhouse__type">
      <div class="putinhouse__type--header">
        <span class="putinhouse__type--label">选择效果图类型</span>
        <span class="putinhouse__type--balance" v-text="isPackYearsAndMonthShow ? '您已开通渲染服务，可免费渲染' : `余额：${accountInfo && accountInfo.balanceIntegral}度币`"></span>
      </div>
      <div class="putinhouse__type--list">
        <div class="putinhouse__type--item" :class="{only: payType.length === 1, active: item.active}" v-for="(item, index) in payType" :key="index" @click="selectPayType(index)">
          <span class="putinhouse__type--title" v-text="item.title"></span>
          <span class="putinhouse__type--price" :class="{isRendered: item.isRendered}" v-text="`${item.price} 度币`"></span>
        </div>
      </div>
    </div>
    <!-- <div class="putinhouse__way">
      <p class="putinhouse__way--title">
        选择渲染方式
      </p>
      <p class="putinhouse__way--desc">智能装修过程中可能存在产品重叠，请选择处理方式:</p>
      <div class="putinhouse__way--list">
        <div class="putinhouse__way--item">
          <div class="putinhouse__way--text">
            <span class="putinhouse__way--main">允许产品重叠</span>
            <span class="putinhouse__way--sub">渲染时可能存在两个或多个产品重叠在一起</span>
          </div>
          <span class="putinhouse__way--icon active"></span>
        </div>
        <div class="putinhouse__way--item">
          <div class="putinhouse__way--text">
            <span class="putinhouse__way--main">删除部分产品</span>
            <span class="putinhouse__way--sub">渲染时将重叠的产品进行删除</span>
          </div>
          <span class="putinhouse__way--icon"></span>
        </div>
      </div>
    </div> -->
    <div class="putinhouse__submit">
      <span class="putinhouse__submit--btn active" v-text="`支付${isPackYearsAndMonthShow ? 0 : find(payType, {active: true}).price}度币`" @click="addRenderTask"></span>
    </div>
    <!-- 渲染成功后询问框 -->
    <div class="afterRender" v-show="showComfirm">
      <transition name="scale" @after-leave="showComfirm = false;">
        <div class="afterRender__content" v-if="showRenderSuccess">
          <div class="afterRender__body">
            <i class="afterRender__body--loading"></i>
            <span class="afterRender__body--msg">预计3分钟后渲染完成</span>
          </div>
          <div class="afterRender__footer">
            <span class="afterRender__footer--sure" @click="comfirmRender">确认</span>
            <span class="afterRender__footer--task" @click="$router.push('/replace')">查看任务</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'Vuex';
import { getUserBalance } from 'api/account';
import md5 from 'utils/md5';
import { find, set } from 'lodash';

export default {
  name: 'putInHouse',
  data() {
    return {
      accountInfo: '',
      isPackYearsAndMonthShow: false,
      showComfirm: false,
      showRenderSuccess: false,
      commonPayType: [
        {
          title: '720°全景图',
          price: 50,
          renderingType: 4,
          productType: 'panorama_render',
          active: true,
          isRendered: false
        },
        {
          title: '多点全景',
          price: 70,
          renderingType: 8,
          productType: 'roam720',
          active: false,
          isRendered: false
        },
        {
          title: '漫游视频',
          price: 90,
          renderingType: 6,
          productType: 'video',
          active: false,
          isRendered: false
        }
      ],
      wholePayType: [
        {
          title: '720°全景图',
          price: 300,
          renderingType: 4,
          productType: 'panorama_render',
          active: true,
          isRendered: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters('common', ['userInfo']),
    ...mapGetters('login', ['account', 'password']),
    ...mapGetters('fastDecorate', ['currentHouse']),
    payType() {
      return this.$route.params.houseType == 2 ? this.wholePayType : this.commonPayType
    }
  },
  methods: {
    find,
    selectPayType(index) {
      this.payType.forEach((item, i) => { item.active = i === index });
    },
    async isPackYearsAndMonth() {
      let { obj } = await this.API.isPackYearsAndMonth({
        platformCode: 'pc2b',
        msgId: 'mobile2b'
      });

      if (obj.state == '0') {
        this.isPackYearsAndMonthShow = false;
      } else if (obj.state == '1' || obj.state == '2' || obj.state == '3' || obj.state == '4') {
        this.isPackYearsAndMonthShow = true;
      } else {
        this.isPackYearsAndMonthShow = false;
      }

      this.isPackYearsAndMonthShow && this.payType.forEach(item => Object.assign(item, {isRendered: true}));
    },
    async queryDcoin() {
      let { obj } = await getUserBalance({account: this.account, password: md5('WeB'+md5(this.password))});
      this.accountInfo = obj;
    },
    // async queryIsRenderList() {
    //   let { datalist } = await this.API.whetherRender({
    //     userId: this.userInfo.id,
    //     recommendedPlanId: this.$route.params.id
    //   });

    //   datalist.forEach(item => {
    //     set(find(this.payType, {renderingType: item.renderingType}), 'isRendered', true);
    //   });
    // },
    /**
     * 参数不明
     */
    async addRenderTask() {

      let res = await this.API.addRenderTasks({
        taskSource: 1,
        taskType: 0,
        operationSource: 1,
        payType: 1,
        userId: this.userInfo.id,
        designPlanSceneId: sessionStorage.getItem('cpId'),
        planRecommendedId: this.$route.params.id,
        renderingType: find(this.payType, {active: true}).renderingType,
        renderTaskType: find(this.payType, {active: true}).productType,
        templateId: this.currentHouse.templateId,
        groupPrimaryId: this.$route.params.groupPrimaryId,
        planHouseType: this.$route.params.houseType,
        houseId: this.$route.params.houseId,
        houseCommonCode: this.currentHouse.houseCommonCode,
        houseName: this.currentHouse.houseName,
        livingName: this.currentHouse.livingName,
        totalFee: this.isPackYearsAndMonthShow ? 0 : find(this.payType, {active: true}).price * 10
      })

      if(res.success) {
        [this.showComfirm, this.showRenderSuccess] = Array(2).fill(true);
      }
      else {
        if(res.message.includes('余额')) {
          this.$confirm({
            title: '充值',
            msg: '度币余额不足，去充值？'
          })
          .success(instance => {
            instance.close();
            this.$router.push('/paypage');
          })
        }
        else {
          this.$toast(res.message);
        }
      }
    },
    comfirmRender() {
      this.showRenderSuccess = false;
      this.queryDcoin();
      // this.queryIsRenderList();
    }
  },
  async created() {
    console.log(this.$route.params)
    // 包年包月套餐查询
    this.isPackYearsAndMonth();

    // 度币余额查询
    this.queryDcoin();

    // 判断是否要显示渲染按钮
    // this.queryIsRenderList();
  }
}
</script>

<style lang="scss" scoped>
.putinhouse {
  @at-root #{&}__header {
    position: relative;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 36px;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /*no*/
      transform: scaleY(0.5);
      background-color: #f8f8f8;
    }

    @at-root #{&}--back {
      position: absolute;
      top: 0;
      left: 0;
      width: 88px;
      height: 88px;
      background-image: url(./images/nav_icon_back_black.png);
      background-size: 50%;
      background-position: 50%;
      background-repeat: no-repeat;
    }
  }

  @at-root #{&}__banner {
    height: 108px;
  }

  @at-root #{&}__type {
    padding: 40px 30px 60px;

    @at-root #{&}--header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    @at-root #{&}--label {
      font-size: 28px;
    }

    @at-root #{&}--balance {
      font-size: 24px;
      color: #999;
    }

    @at-root #{&}--list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    @at-root #{&}--item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-basis: 48%;
      height: 160px;
      font-size: 28px;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        border-radius: 8px;
        border: 1px solid #ccc; /*no*/
        transform: translate(-25%, -25%) scale(0.5);
      }

      &.only {
        flex-direction: row;
        flex-basis: 100%;
        justify-content: space-between;
        padding: 0 60px;

        .putinhouse__type--title {
          margin-bottom: 0;
        }
      }

      &.active {
        color: #ff6419;
        &:after {
          border-color: #ff6419;
        }
      }

      &:nth-of-type(n+3) {
        margin-top: 30px;
      }
    }

    @at-root #{&}--title {
      margin-bottom: 30px;
    }

    @at-root #{&}--price {
      font-weight: bold;

      &.isRendered {
        text-decoration: line-through;
      }
    }
  }

  @at-root #{&}__way {
    padding: 0 30px;

    @at-root #{&}--title {
      margin-bottom: 30px;
      font-size: 28px;
      color: #3a3a3a;
    }

    @at-root #{&}--desc {
      margin-bottom: 30px;
      font-size: 28px;
      color: #999;
    }

    @at-root #{&}--item {
      display: flex;
      align-items: center;
      height: 128px;
      padding: 0 30px;
      margin-bottom: 20px;
      background-color: #f5f5f5;
    }

    @at-root #{&}--text {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    @at-root #{&}--main {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }

    @at-root #{&}--sub {
      font-size: 24px;
      color: #999;
    }

    @at-root #{&}--icon {
      width: 50px;
      height: 50px;
      background-image: url(./images/list_icon_check_nor.png);
      background-size: 100%;

      &.active {
        background-image: url(./images/list_icon_check_sel.png);
      }
    }
  }

  @at-root #{&}__submit {
    padding: 30px;

    @at-root #{&}--btn {
      display: inline-block;
      width: 100%;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-size: 32px;
      color: #fff;
      border-radius: 44px;
      background-color: #ff6419;

      &.isSubmit {
        background-color: #89827e;
      }
    }
  }
}

.afterRender {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);

  @at-root #{&}__content {
    width: 500px;
    border-radius: 8px;
    background-color: #fff;
    transform-origin: center bottom;

    &.scale-enter-active{
      transition: all 200ms ease
    }
    &.scale-leave-active {
      transition: all 150ms ease
    }

    &.scale-enter, &.scale-leave-active {
      transform: scale3d(0, .5, 0);
    }
  }

  @at-root #{&}__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;

    @at-root #{&}--loading {
      width: 100px;
      height: 100px;
      margin-bottom: 40px;
      background-image: url(./images/loading.gif);
      background-size: 100%;
    }
  }

  @at-root #{&}__footer {
    position: relative;
    display: flex;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px; /*no*/
      transform: scaleY(0.5);
      background-color: rgba(4, 4, 4, 0.12);;
    }

    @at-root #{&}--sure,
    #{&}--task {
      position: relative;
      flex-basis: 50%;
      height: 90px;
      line-height: 90px;
      text-align: center;
    }

    @at-root #{&}--task {
      color: #ff6419;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 1px; /*no*/
        height: 100%;
        transform: scaleX(0.5);
        background-color: rgba(4, 4, 4, 0.12);;
      }
    }
  }
}
</style>
