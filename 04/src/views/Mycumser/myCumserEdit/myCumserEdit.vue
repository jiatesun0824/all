<template>
  <div class="myCumserEdit">
    <header>
      <i class="icon-left" @click="$router.go(-1)"></i>
      <div class="title">编辑</div>
      <div class="confirm" @click="save" :style="value.length!=0?'color:#ff6419':'color:#999'">确定</div>
    </header>
    <div class="main">
        <textarea v-model="value" name="" id="" cols="30" rows="10" placeholder="请添加您对业主的备注">
        </textarea>
        <div class="tit">
               <span v-text="value.length"></span>
               <span>/50个字</span>
        </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from'Vuex'
  export default {
    data() {
      return {
          value:'',
          textDisAble: false
      }
    },
    watch: {
        value(val) {
            if (val.length>=50) {
                this.value = val.substr(0, 50);
            }
        }
    },
    methods: {
        ...mapActions('mycumser', ['setCumseRemarks']),
        save() {
            if(this.value.length>0) {
                this.setCumseRemarks(this.value);
                let Mark = {
                    remark: this.value,
                    orderId: this.$route.query.orderId
                }
                this.API.updateRemark(Mark).then(res=> {
                    this.$router.go(-1);
                })
            }else {
                this.$toast('请输入备注信息')
            }
            
        }
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/myCumserEdit.scss';
</style>
