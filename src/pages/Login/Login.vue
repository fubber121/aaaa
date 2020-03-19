<template>
   <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: isShowSms}" @click="isShowSms=true">短信登录</a>
            <a href="javascript:;" :class="{on: !isShowSms}" @click="isShowSms=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form>
            <div :class="{on:isShowSms}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" name="phone" v-validate="'required|mobile'">
                 <span style="color: red;" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
                <button :disabled="!isRightPhone || computeTime>0" class="get_verification" :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode">{{computeTime>0 ? `短信已发送(${computeTime}s)` : '发送验证码'}}</button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" name="code" v-validate="'required|code'" v-model="code">
                 <span style="color: red;" v-show="errors.has('code')">{{ errors.first('code') }}</span>

              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!isShowSms}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" name="name" v-model="name" v-validate="'required'">
                 <span style="color: red;" v-show="errors.has('name')">{{ errors.first('name') }}</span>

                </section>
                <section class="login_verification">
                  <input :type=" isShowPwd ? 'text' : 'password' " maxlength="8" placeholder="密码"  v-model="pwd" name="pwd" v-validate="'required'" >
                 <span style="color: red;" v-show="errors.has('pwd')">{{ errors.first('pwd') }}</span>

                  <div class="switch_button off" :class=" isShowPwd ? 'on': 'off'" @click="isShowPwd = !isShowPwd">
                    <div class="switch_circle" :class="{right: isShowPwd }"></div>
                    <span class="switch_text">{{isShowPwd ? 'abc' : ''}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha"  name="captcha" v-validate="{required:true,regex:/^[0-9a-zA-Z]{4}$/}">
                  <span style="color: red;" v-show="errors.has('captcha')">{{ errors.first('captcha') }}</span>
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="updateCaptcha" ref="captcha">
                  
                   <!-- 原本404，利用代理服务器转发请求4000的后台接口 -->
                  <!-- <img class="get_verification" src="/api/captcha" alt="captcha"> -->
                </section>
              </section>
            </div>
            <button class="login_submit" @click.prevent="login">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.replace('/profile') ">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
    </section>
</template>

<script type="text/ecmascript-6">
  import {reqSendCode} from '../../api'
  import {Toast ,MessageBox} from 'mint-ui'
  export default {
    name:'Login', 
    data(){
      return {
        isShowSms:false,//显示短信登录界  false面显示密码登录界面
        phone:'',
        isShowPwd: false,//   密码是否可见
        pwd:'',//手机号
        name:'',//用户名
        captcha:'',//图形验证码
        code:'',//短信验证码
        computeTime:0,// 倒计时时间
        
      }
    },
    computed:{
      //是否是一个正确的手机号
      isRightPhone(){
        return /^1(3|4|%|6|7|8|9)\d{9}$/.test(this.phone)//调回布尔类型
      }
    },
    methods:{
      async sendCode(){
        // alert('3333333')
        //进行倒计时
        this.computeTime =30
        this.intervalId =  setInterval(()=>{
          this.computeTime--
          if(this.computeTime <=0){
            clearInterval(this.intervalId)
            
          }
        },1000)
        //发送ajax请求向指定手机号发送验证码短信
         const result = await reqSendCode(this.phone)
         if(result.code ===0){
           //显示提升
           Toast('验证码短信已发送')
         }else{
           this.computeTime = 0
           MessageBox('提示',result.msg || '发送失败了')
         }
      },
      async login(){
        let names
        if (this.isShowSms) {
          names = ['phone', 'code']
        } else {
          names = ['name', 'pwd', 'captcha']
        }
        //前端验证 用户输入是否合法
         const success = await this.$validator.validateAll(names) // 对所有表单项进行验证
         let result
        if(success){//前端认证成功
          //后端验证
          const {isShowSms,phone,code,name,pwd,captcha}=this
          if(isShowSms){
            result = await this.$API.reqSmsLogin({phone,code})
          }else{
            //密碼登錄
            result = await this.$API.reqPwdLogin({name,pwd,captcha})
            this.updateCaptcha()//更新图形验证码
            this.captcha=''
          }
        //根据請求的結果，做不同响应处理
        if(result.code===0){
          const user = result.data
          //将user保存到vuex的state
          this.$store.dispatch('saveUser',user)//将user和token保存的state，将token保存local
          //跳转到个人中心
          this.$router.replace({path:'/profile'})
        }else{
           MessageBox('提示',result.msg || '发送失败了')
          
        }
         }
     },
     updateCaptcha(){
        this.$refs.captcha.src='http://localhost:4000/captcha?time' +Date.now()
     }
    }
  }
</script>

<style scoped  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  
  .loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone_number
                    color:black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform  translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
