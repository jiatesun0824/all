<template>
  <div>
    <transition name="dropup">
      <div class="chooseType"  v-show="chooseTypeShow">
        <div class="chooseBox">
          <ul>
            <li :class="{'active':item.active}" v-for="(item,index) in typeList" :key="index" @click="toggle(item,index)">{{item.name}}</li>
          </ul>
        </div>
        <div class="cancel" @click="close">取消</div>
      </div>
    </transition>
    <!--蒙层-->
    <div class="mask" v-show="mask" @click="close"></div>
  </div>


</template>

<script>
    import { mapGetters } from 'Vuex'
    export default {
        name: "chooseType",
        props:['show'],
        data(){
            return{
               typeList:[],
              chooseTypeShow:false,
              mask:false,
            }
        },
      mounted(){

      },
        methods:{
          close(){
            this.mask=false;
            this.chooseTypeShow=false;
          },
          isShow(){
            this.mask=true;
            this.chooseTypeShow=true;
          },
          toggle(item,index){
             this.typeList.map(item=>{
               item.active=false;
             });
            item.active=true;
            this.$set(this.typeList,index,this.typeList[index]);
            let obj={
              name:item.name,
              id:item.id,
            }
            this.$emit('confirmType',obj);
          }
        },
      computed:{
        ...mapGetters('release',['gettersSupplyList','gettersReleaseId'])
      },
      created(){
        if(this.gettersSupplyList){
          this.gettersSupplyList.map((item)=>{
            if(this.gettersReleaseId===item.id){
              this.typeList=item.supplyDemandCategoryVos;
              for(let i=0;i<this.typeList.length;i++){ //添加属性active
                this.typeList[i].active=false;
              }
            }
          })
        }


      }
    }
</script>

<style lang="scss" scoped>
   .chooseType{
      position: absolute;
      bottom: 0;
      width: 710px;
      left: 50%;
      margin-left: -355px;
      z-index: 11;
     &.dropup-enter-active, &.dropup-leave-active {
       transition: all 0.3s linear;
     }
     &.dropup-enter, &.dropup-leave-active {
       transform: translate3d(0, 100%, 0);
     }
     .chooseBox{
       border-radius: 26px;
       height: 570px;
       width: 100%;
       background: #fff;
     }
      ul{
        display: block;
        width: 95%;
        height: 570px;
        overflow: scroll;
        margin: 0 auto;
        li{
          background: #fff;
          height: 114px;
          line-height: 114px;
          font-size: 40px;
          color: #333333;
          text-align: center;
          position: relative;
          &:active{
            background: #f5f5f5;
          }
          &:after{
            content: '';
            width: 100%;
            height: 2px;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: #f5f5f5;
            transform: scaleY(0.5);
          }
        }
        li:nth-of-type(1){
          border-top-left-radius: 26px;
          border-top-right-radius: 26px;
        }

        .active{
          color: #ff6419;
        }
      }
     .cancel{
       background: #fff;
       height: 114px;
       line-height: 114px;
       font-size: 40px;
       color: #333333;
       text-align: center;
       margin-top: 16px;
       border-radius: 26px;
       &:active{
         background: #f5f5f5;
       }
     }
   }
</style>
