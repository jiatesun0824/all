<template>
    <div class='appointment'>
        <div class='form-box'>
            <span @click='back'></span>
            <div v-if='isIdentification'>
                <div class='succeed-icon'></div>
                <div class='succeed-text'>认证成功</div>
                <p>稍后会有专业人员与您联系请注意接听来电</p>
            </div>
            <div v-else>
                <div class='succeed-text'>免费预约</div>
                <div class='slogan'>预约后会有专业人员与您联系</div>
                <input type="text"  placeholder="姓名" maxlength="10" v-model="appointmentName">
                <input type="number" placeholder="请输入手机号" maxlength="11" v-model="appointmentPhone">
                <div class="verifyCodeBox">
                    <input type="number" class='verifyCodeBox-input' placeholder="验证码" maxlength="6" v-model="verificationCode">
                    <div class="verifyCode" @click='getVerificationCode'>{{verificationCodeTxt}}</div>
                </div>
                <div class="infoButton" @click='goSubscribe'>预约</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'appointment',
    props: {
        isIdentification: {
            type: Boolean,
            value: false
        },
        userId: {
            type: String,
            value: ''
        },
        userAppointmentObj: {
            type: Object,
            value: {}
        },
        shopId: {
            type: String,
            value: ''
        }
    },
    data() {
        return {
            verificationCodeTxt: '获取验证码',
            hintText: '',
            appointmentPhone: '',
            appointmentName: '',
            verificationCode: ''
        }
    },
    computed: {
        appointmentPhoneFlag () { // 找他设计的
            let phoneFlag = /^1[345789]\d{9}$/.test(this.appointmentPhone)
            !phoneFlag ? this.hintText = '请输入正确手机号' : null
            return phoneFlag
        },
        appointmentAllFlag () { // 找我设计所有的表单
            let phoneFlag = /^1[345789]\d{9}$/.test(this.appointmentPhone), 
                nameFlag = this.appointmentName.replace(/\s+/g, '').length != 0,
                codeFlag = /^\d{6}$/.test(this.verificationCode)
            !phoneFlag ? this.hintText = '请输入正确手机号' : null
            if (!nameFlag) {
                this.hintText = '请输入名称'
            } else if (!phoneFlag) {
                this.hintText = '请输入正确的手机号'
            } else if (!codeFlag) {
                this.hintText = '请输入正确的验证码'
            }
            return phoneFlag && nameFlag && codeFlag
        }
    },
    created() {
        console.log(this.userAppointmentObj)
        this.appointmentPhone = this.userAppointmentObj.appointmentPhone
        this.appointmentName = this.userAppointmentObj.appointmentName
        this.verificationCode = this.userAppointmentObj.verificationCode
    },
    methods: {
        back() {
            this.$emit('goAppointment')
        },
        getVerificationCode() {
            if (this.appointmentPhoneFlag) {
                this.API.getVerificationCode({ 
                    phoneNumber: parseInt(this.appointmentPhone), 
                    msgId: 12 
                }).then(res => {
                    this.$emit('showPromptDialogBox', {message: '验证码已发送'})
                    let i = 60
                    let j = setInterval(() => {
                        this.verificationCodeTxt = i + 's'
                        if (i < 0) {
                        this.verificationCodeTxt = '获取验证码'
                        clearInterval(j)
                        }
                        i--
                    }, 1000)
                })
            } else {
                // this.showPromptDialogBox(this.hintText)
                this.$emit('showPromptDialogBox', {message: this.hintText})
            }
        },
        goSubscribe() {
            console.log(this.appointmentName)
            if (!this.appointmentAllFlag) {
                this.$emit('showPromptDialogBox', {message: this.hintText})
                return
            }
            this.API.setAppointment({
                userPhone: this.appointmentPhone,
                userName: this.appointmentName,
                code: this.verificationCode,
                serviceType: '4',
                shopId: this.shopId,
                businessType: 0,
                appointUserId: this.userId
            }).then(res => {
                if (res.success) {
                    this.appointmentDialog = false;
                    this.$emit('showPromptDialogBox', {message: res.message,userPhone: this.appointmentPhone})
                } else {
                    this.$emit('showPromptDialogBox', {message: res.message})
                }
                
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .appointment{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0.5);
        .form-box{
            position: absolute;
            width: 80%;
            top: 50%;
            left: 50%;
            padding: 40px 30px;
            transform: translate(-50%, -50%);
            border-radius: 10px;
            background-color: #fff;
            span{
                position: absolute;
                top: 20px;
                right: 20px;
                display: block;
                width: 26px;
                height: 26px;
                background-image: url("../../static/image/pop_nav_icon_close.png");
                background-size: cover;
            }
            p{
                font-size: 28px;
                margin: 30px 0 50px;
                padding: 0 90px;
                color: #999999;
                text-align: center;
            }
            input {
                width: 100%;
                height: 80px;
                margin-bottom: 20px;
                padding-left: 30px;
                background-color: #f5f5f5;
                border-radius: 40px;
                font-size: 32px;
            }
            .succeed-icon{
                width: 160px;
                height: 160px;
                margin: 10px auto 0;
                background-image: url("../../static/image/pop_icon_success.png");
                background-size: cover;
            }
            .succeed-text{
                font-size: 36px;
                color: #29cccc;
                text-align: center;
            }
            .slogan{
                font-size: 24px;
                color: #333333;
                text-align: center;
                margin: 20px auto 40px;
            }
            .verifyCodeBox{
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 80px;
                margin-bottom: 20px;
                background-color: #f5f5f5;
                border-radius: 40px;
                font-size: 32px;
                .verifyCode{
                    font-size: 32px;
                    width: 40%;
                    line-height: 80px;
                    color: #29cccc;
                    text-align: center;
                }
                .verifyCodeBox-input{
                    width: 60%;
                }
            }
            .infoButton {
                width: 100%;
                height: 80px;
                background: #29cccc;
                line-height: 80px;
                font-size: 36px;
                margin: 25px 0 0;
                text-align: center;
                border-radius: 40px;
                color: #fff;
            }
        }
    }
</style>

