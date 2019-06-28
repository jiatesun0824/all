<template>
    <div class="robNum" v-show="robNum">
        <div class="content">
          <img src="../images/icon-qiangdan@2x.png" alt="">
          <p>每日一次抢单机会，您今日已用完咯</p>
          <input type="button" value="知道了，再看看" @click="close">
        </div>
    </div>
</template>

<script>
    import { mapGetters,mapActions} from 'Vuex'
    export default {
        name: "robNum",
        data(){
          return{

          }
        },
      computed:{
        ...mapGetters("home", ["robNum","mask"]),
      },
        methods:{
          ...mapActions("home", ["diolog"]),
          close(){
             this.diolog({robNum:false,mask:false});
           }
        }
    }
</script>

<style lang="scss" scoped>
   .robNum{
     position: absolute;
     top: 50%;
     left: 50%;
     width: 560px;
     margin-left: -280px;
     margin-top: -232px;
     z-index: 10;
     background-color: #fff;
     border-radius: 20px;
     padding: 72px 0;
      .content{
          img{
            display: block;
            width: 87px;
            height: 87px;
            margin: 0 auto;
          }
          p{
            color: #333333;
            font-size: 24px;
            line-height: 32px;
            text-align: center;
            margin-top: 32px;
          }
          input{
            display: block;
            width: 269px;
            height: 72px;
            background-color: #ff6419;
            border-radius: 36px;
            color: #fff;
            font-size: 28px;
            margin: 56px auto 0 auto;
          }
      }
   }
</style>
