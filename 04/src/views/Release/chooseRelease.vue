
<template>
  <div class="chooseRelease">
      <header>
          <i class="icon-left" @click="goBack()"></i>
          <div class="title">{{$route.meta.title}}</div>
          <div class="right" @click="$router.push('/user/issue')">我的发布</div>
      </header>
      <div class="chooseType">
          <div class="box" v-for="(item,index) in supplyList" :key="index" @click="toRelease(item)">
             <!-- <svg-icon class='icon-type' icon-name="wrong"></svg-icon> -->
             <i class="icon-type" :class="{'icon1':item.name=='家装服务','icon2':item.name=='家居建材','icon3':item.name=='人力服务'}"></i>
             <div class="text">{{item.name}}</div>
          </div>
      </div>
  </div>
</template>

<script>
  import { getallsupplydemandcategory } from '@/api/home'
  import { mapActions, mapGetters } from 'Vuex'
  export default {
    name: 'chooseRelease',
    data () {
      return {
        supplyList:''
      }
    },
    computed:{
      ...mapGetters('release', ['from'])
    },
    activated(){
      getallsupplydemandcategory({type:1}).then((res)=>{
        res.obj.map(item=>{
            this.supplyList=item.supplyDemandCategoryVos;
        })
      })

    },
    methods:{
      ...mapActions('release', ['clearReleaseData']),
      goBack() {
        if(this.from=='home') {
          this.$router.push('/')
        }else if(this.from=='supplyList'){
          this.$router.push('/supplyList')
        }else {
          this.$router.push('/user/issue')
        }
      },
      toRelease(item){
        this.clearReleaseData();
        this.$router.push({ name: 'homeService', params: { type: item.id}, query: { typeName: item.name }});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .chooseRelease{
    width: 100%;
    height: 100%;
    background:#f5f5f5;
  }
  header{
    display: flex;
    height: 88px;
    line-height: 88px;
    position: relative;
    color: #333;
    font-size: 36px;
    background-color: #fff;

    .icon-left{
      position: absolute;
      left: 0;
      top: 0;
    }
    .title{
      width: 100%;
      text-align: center;
      font-family: serif;
      font-family: PingFang-SC-Medium;
    }
    .right{
      position: absolute;
      right: 30px;
      top: 0;
    }
  }
  .chooseType{
    margin-top: 20px;
    background: #fff;
    height: 293px;
    display: flex;
    box-sizing: border-box;
    justify-content: space-around;
    align-items: center;
    .box{
      flex: 1;
      &:active{
        opacity: .6;
      }
      .icon-type{
        display: block;
        width: 80px;
        height: 80px;
        margin: 0 auto;
        border-radius: 100%;
      }
      .icon1{
        background: no-repeat center url('./images/release_icon_service.png');
        background-size: 100%;
      }
      .icon2{
        background: no-repeat center url('./images/release_icon_material.png');
        background-size: 100%;
      }
      .icon3{
        background: no-repeat center url('./images/release_icon_manpower.png');
        background-size: 100%;
      }
      .text{
        line-height: 32px;
        margin-top: 20px;
        text-align: center;
        font-size: 28px;
      }
    }
  }
</style>
