<template>
     <div class='festival-activity'>
       <!-- 领红包 -->
       <redPacket></redPacket>
       <!-- 节日卡片-->
       <festivalCard></festivalCard>
       <!-- 抽奖 -->
       <award></award>
       <!-------------------------------------------------------------------------弹窗部分-->
       <!--做任务-->
       <taskDialog></taskDialog>
       <!--绑定手机号-->
       <bindPhone></bindPhone>
       <!--恭喜您 获取卡片-->
       <getCards></getCards>
       <!--邀请记录-->
       <inviteRecord></inviteRecord>
       <!-- 获得电影票-->
       <getMoving></getMoving>
       <!-- 海报组件 -->
       <sharePoster></sharePoster>
       <!--//引导页-->
       <guidePage></guidePage>
     </div>
</template>

<script>
    import redPacket from '@/components/festivalActivity/redPacket'; // 领红包
    import award from '@/components/festivalActivity/award';  // 抽奖
    import festivalCard from '@/components/festivalActivity/festivalCard';  // 节日卡片
    import taskDialog from '@/components/festivalActivity/taskDialog';  // 做任务
    import bindPhone from '@/components/festivalActivity/bindPhone';  // 绑定手机号
    import getCards from '@/components/festivalActivity/getCards';  // 获得卡片
    import inviteRecord from '@/components/festivalActivity/inviteRecord';  // 邀请记录
    import getMoving from '@/components/festivalActivity/getMoving';  // 获得电影票
    import sharePoster from '@/components/festivalActivity/sharePoster';//生成海报
    import guidePage from '@/components/festivalActivity/guidePage';//引导页
    import festivalActivity from "@/mixin/festivalActivity"
    import { indexMixin } from "@/mixin";
    export default {
        name: "festival-activity",
      data() {
          return{}
      },
        mixins:[festivalActivity,indexMixin],
        components: {
            redPacket,
            award,
          festivalCard,
          taskDialog,
          bindPhone,
          getCards,
          inviteRecord,
          getMoving,
          sharePoster,
          guidePage
        },
        created(){
          document.title="随选拜大年";
          this.setUrlParams(this.$route.query);
        }

    }
</script>

<style scoped lang="scss">
    .festival-activity{
         background-color: #c22f3d;
    }
</style>
