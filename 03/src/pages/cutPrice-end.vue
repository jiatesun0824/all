<template>
  <div class="cutPrice-end-box">
    <div class="end-box-message">
      <div class="box-message-title" v-html="activityEndText"></div>
      <div class="box-message-main">
        <div class="message-main-item" v-for="(item, index) in userGetLightList" :key="index">
          <div class="main-item-name">{{item.name}}</div>
          <div class="main-item-mobile">{{item.mobile}}</div>
        </div>
        <div class="message-main-hint">小选将在20个工作日内安排发货，感谢大家对随选网的支持!</div>
      </div>
    </div>
  </div> 
</template>
<script>
  export default {
    data () {
      return {
        activityEndText: "不到24小时，近1000盏台灯已经被大家砍走了……</br>但是活动规则已经写明【邀请随选网新用户帮忙砍价视为有效】，所以成功领取台灯的用户名单如下：",
        userGetLightList: [
          {name: "小高", mobile:"199****6462"},
          {name: "胡子豪", mobile:"138****9950"},
          {name: "夏熔", mobile:"185****7736"},
          {name: "七月", mobile:"170****2514"},
          {name: "逄杰", mobile:"170****2967"},
          {name: "李妮", mobile:"130****2689"},
          {name: "梁晓",mobile:"159****9312"},
          {name: "宋兰", mobile:"187****5588"},
          {name: "陈莹", mobile:"130****4923"},
          {name: "何女士", mobile:"181****6551"},
          {name: "贺霞", mobile:"157****5999"},
          {name: "秦龙", mobile:"188****0075"},
          {name: "张丹丹", mobile:"177****3037"},
          {name: "郑非", mobile:"139****9184"},
          {name: "李彬", mobile:"158****9951"},
          {name: "周荣", mobile:"156****9665"},
          {name: "韩小军", mobile:"150****6946"},
          {name: "黄燕	", mobile:"136****8200"},
          {name: "黎涓超", mobile:"183****4128"},
          {name: "姚瑶	", mobile:"189****7985"},
          {name: "张秀君", mobile:"152****5276"},
          {name: "李婷婷", mobile:"150****7321"},
          {name: "郑晴天", mobile:"189****0918"},
          {name: "王子依", mobile:"156****3104"},
          {name: "冯宇" , mobile:"183****4409"},
          {name: "郝伟", mobile:"156****2863"},
          {name: "于军晓", mobile:"186****9930"},
          {name: "王安英", mobile:"134****2726"},
          {name: "徐成", mobile:"138****1928"},
          {name: "曹灿", mobile:"180****2442"},
          {name: "周玲丽", mobile:"159****3415"},
          {name: "吴雪", mobile:"130****6399"},
          {name: "曹英敏", mobile:"131****5125"},
          {name: "王雨心", mobile:"153****1565"},
          {name: "安俊卿", mobile:"137****1465"},
          {name: "古丽", mobile:"139****2185"},
          {name: "何蕾", mobile:"150****6263"},
          {name: "冬妮", mobile:"152****8826"},
          {name: "刘爽", mobile:"135****4938"},
          {name: "苗明超", mobile:"188****0232"},
          {name: "朱正昌", mobile:"139****3269"},
          {name: "孙甜甜", mobile:"186****9756"},
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .cutPrice-end-box{
    width: 100%;
    background-image:url('/static/image/cutPrice/plan_banner_end.png');
    background-repeat:no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    .end-box-message{
      width: 686px;
      // height: 2055px;
      background: white;
      margin: 184px 0 40px 32px;
      border-radius: 10px;
      padding: 30px 18px 0 30px;
      color: #333;
      font-size: 24px;
      line-height: 44px;
      .box-message-main{
        padding: 32px 0 60px 0;
        .message-main-item{
          display: flex;
          .main-item-name{
            flex: 4;
            text-align: center;
          }
          .main-item-mobile{
            flex:8;
          }
        }
        .message-main-hint{
          margin: 30px 0 30px 0;
        }
      }
    }
  }
</style>

