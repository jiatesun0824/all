<template>
  <div class="imgBox">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">{{$route.meta.title}}</div>
    </header>
    <scroll class="wrapper" :probeType="probeType" :listenScroll="listenScroll" ref="scroll">
      <div class="content">
          <div class="cutImg">
            <vueCropper
              ref="cropper"
              :img="gettersCutImgBox.cutImgUrl"
              :autoCrop="autoCrop"
            ></vueCropper>
          </div>
          <div class="cut-module" v-show="isCut">
              <i class="ic-roate" @click="roate90"></i>
              <i class="ic-cut" @click="cutImgMethod"></i>
          </div>
          <div class="cut-module" v-show="!isCut">
            <i class="ic-43" @click="cutWay('43')"></i>
            <i class="ic-34" @click="cutWay('34')"></i>
          </div>
          <div class="btn">
              <div class="cancel" @click="cancel">取消</div>
              <div class="confirm" @click="confirm">确定</div>
          </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import minix from '@/mixins/mixin'
  import VueCropper from 'vue-cropper'
  import {mapGetters} from 'Vuex'
  export default {
    name: 'imgBox',
    mixins:[minix],

    data () {
      return {
        autoCrop:false,  //是否自动截图
        isCut:true,
       // 只有自动截图开启 宽度高度才生效
				// autoCropWidth: 300,
				// autoCropHeight: 250,
				// // 开启宽度和高度比例
         //fixed: true,
        // fixedBox: true,
				 //fixedNumber: [4, 3]
      }
    },
    computed:{
      ...mapGetters('release',['gettersCutImgBox','gettersImgList'])
    },
    components: {
      VueCropper
    },
    created(){
      
    },
    methods:{
      cutImgMethod(){   //裁剪图片方法
        this.$refs.cropper.startCrop() //开始截图
        this.$refs.cropper.goAutoCrop();//获取截图框 默认的截图款
        this.$route.meta.title='裁剪';
        this.isCut=false;
      },
      roate90(){
        this.$refs.cropper.rotateRight(); //旋转右90度  
      },
      cutWay(type){ //4:3 
        if(type=='43'){ //4:3 
            this.$refs.cropper.goAutoCrop();//获取截图框
            this.$refs.cropper.changeCrop(this.gettersCutImgBox.cutImgWidth*(4/7),this.gettersCutImgBox.cutImgHeight*(3/7));
        }else{  //3:4 截图框
            this.$refs.cropper.goAutoCrop();
            this.$refs.cropper.changeCrop(this.gettersCutImgBox.cutImgWidth*(3/7),this.gettersCutImgBox.cutImgHeight*(4/7));
        }
      },
      cancel(){
         this.$refs.cropper.clearCrop() //清除截图
      },
      confirm(){
        this.$refs.cropper.getCropData((data) => { //裁剪后的图片
          // console.log(data)  
          this.gettersCutImgBox.cutImgUrl=data;      //替换图片url
          this.gettersImgList.map((res,index)=>{
             if(index==this.gettersCutImgBox.cutImgIndex){
                res.file.src=data;
             }
          })
          this.$toast('裁剪成功');
          setTimeout(()=>{
            this.$router.push('/imgBox');
          },800)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .imgBox{
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
    background-color: #fff;
    .icon-left{
      position: absolute;
      left: 0;
      top: 0;
    }
    .title{
      width: 100%;
      text-align: center;
      font-size: 36px;
      color: #333333;
    }
    .right{
      position: absolute;
      right: 30px;
      top: 0;
      color: #ff6419;
      font-size: 36px;
    }
  }
  .content{
     .cutImg{
       width: 100%;
       height: 995px;
       img{
         //height: 995px;
       }
     }
    .cut-module{
       height: 120px;
      background-color: #fafafa;
      display: flex;
      align-items: center;
      padding: 0 30px;
      .ic-roate{
        display: block;
        width: 50px;
        height: 50px;
        background: no-repeat center url('/static/images/release_icon_whirl.png');
        background-size: 100%;
        margin-right: 51px;
      }
      .ic-cut{
        display: block;
        width: 50px;
        height: 50px;
        background: no-repeat center url('/static/images/release_icon_clipping.png');
        background-size: 100%;
      }
      .ic-43{
        display: block;
        width: 50px;
        height: 50px;
        background: no-repeat center url('/static/images/release_icon_4_3_nor.png');
        background-size: 100%;
        margin-right: 51px;
      }
      .ic-34{
        display: block;
        width: 50px;
        height: 50px;
        background: no-repeat center url('/static/images/release_icon_3_4_nor.png');
        background-size: 100%;
      }
    }
   .btn{
      height: 90px;
     background: #fff;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 0 30px;
     .cancel,.confirm{
       font-size: 28px;
       color: #333;
       &:active{
         opacity: .6;
       }
     }
   }
  }

</style>
