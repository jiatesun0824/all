<template>
  <div class="dialog">
    <div class="taskDialog" v-show="dialog.taskDialog">
      <div class="title">做任务，拿拼图</div>
      <div class="tip">按对应指示完成任务哦~</div>
      <ul>
        <li v-for="(item,index) in taskList" :key="index">
          <div class="task-item">
            <p>{{item.title}}</p>
            <p @click="toGuide(index)">{{item.tip}}<i class="ic_right" v-if="index!=0"></i></p>
          </div>
          <div class="task-btn" v-if="item.status==0" @click.stop="getTask(index)">领任务</div>
          <div class="task-btn" v-else-if="item.status==1" @click.stop="toDoTask(index)">去完成</div>
          <div class="task-btn active" v-else-if="item.status==2">已完成</div>
          <div class="task-btn active" v-else-if="item.status==3">领任务</div>
        </li>
      </ul>
      <i class="ic_close" @click.stop="setDialog({taskDialog:false});move()"></i>
    </div>
    <div class="mask" v-show="dialog.taskDialog"></div>
  </div>
</template>

<script>
    import festivalActivity from "@/mixin/festivalActivity"
    export default {
        name: "taskDialog",
        mixins:[festivalActivity],
        data(){
            return{

            }
        },
        methods:{
          getTask(index){
              this.setGetTask({vm:this,taskIndex:index});
          },
          toGuide(index){
             if(index==1){ //装修我家
                this.stop();
                this.setDialog({guidePage:true,guideIndex:1});
             }else if(index==2){ //产品替换
               this.stop();
               this.setDialog({guidePage:true,guideIndex:2});
             }
          },
          toDoTask(index){
            if(index==1 || index==2){
               this.go720();
            }else if(index==0){
                this.setDialog({
                  taskDialog:false,
                  bindPhone:true
                })
            }
          }
        }
    }
</script>

<style scoped lang="scss">
  .taskDialog{
    width: 580px;
     position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #ffffff;
    border-radius: 20px;
    padding: 40px 45px;
    box-sizing: border-box;
    z-index: 10;
    .title{
      font-size: 32px;
      color: #333333;
      text-align: center;
    }
    .tip{
      text-align: center;
      color: #999999;
      font-size: 24px;
      line-height: 48px;
    }
    ul{
      li{
        width: 100%;
        height: 140px;
        background-color: #fff2e5;
        border-radius: 10px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        padding: 35px 30px;
        box-sizing: border-box;
        .task-item{
            p:nth-of-type(1){
              font-size: 28px;
              color: #333333;
            }
            p:nth-of-type(2){
              font-size: 24px;
              color: #adaba8;
              line-height: 48px;
            }
            .ic_right{
              display: inline-block;
              width: 14px;
              height: 20px;
              background: no-repeat center url("/static/image/festivalActivity/spring_icon_san.png");
              background-size: 100%;
              margin-left: 10px;
            }
        }
        .task-btn{
          width: 120px;
          height: 48px;
          background-color: #c22f3d;
          border-radius: 24px;
          font-size: 24px;
          color: #ffffff;
          line-height: 48px;
          font-weight: bold;
          text-align: center;
          &:active{
            opacity: .6;
          }
        }
        .active{
          opacity: .2;
          &:active{
            opacity: .2;
          }
        }
      }
    }
  }
</style>
