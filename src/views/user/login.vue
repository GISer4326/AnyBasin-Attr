<template>
<div class="login-div">
  <div class="login-box">
    <div class="login-title">
      <h1>WISE Modeler</h1>
    </div>
    <div class="login-form">
      <Form ref="formLogin" :model="formLogin" :rules="formLoginRules" :label-width="100" label-position="left">
        <FormItem prop="username" label="Username">
          <Input  v-model="formLogin.username" placeholder="Enter your username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password" label="Password">
          <Input type="password" v-model="formLogin.password" placeholder="Enter your password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <div class="login-button">
          <Button type="primary" ghost @click="handleSubmitLogin('formLogin')">Sign in</Button>
        </div>
        <div class="register">
          <router-link to="/signup">Sign up</router-link>
          <router-link to="">Forgot password</router-link>
        </div>
      </Form>
    </div>
  </div>
</div>
</template>

<script>
import {request} from "@/network/request";
export default {
  name:"Login",
  data() {
    return {
      formLogin:{
        username:"",
        password:"",
      },
      formLoginRules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    handleSubmitLogin(name) {
      sessionStorage.setItem('username', this.formLogin.username);
      this.$refs[name].validate((valid) => {
        this.$Spin.show();
        if (valid) {
          // var paramObj = {
          //   username1: this.formLogin.username,
          //   password1: this.formLogin.password
          // };

          let params = new URLSearchParams();
          // 参数的名称不能是username ！！！！！！！！！！！
          params.append("username1", this.formLogin.username);
          params.append("password1", this.formLogin.password);
          // var options = {
          //   headers: {
          //     "content-type": "application/json"
          //   },
          //   method: "POST",
          //   data: JSON.stringify(paramObj)
          // };
          request.post('/user/login1',params)
            .then(res=>{
              if (res.data.errCode === 200) {
                this.$Message.success({
                  content: 'Sign in succeeded',
                  duration: 10
                })
                // console.log(res);
                if (localStorage.getItem('mytoken') !== res.headers.authorization) {
                  localStorage.setItem('mytoken', res.headers.authorization)
                }
                this.$router.push({name:'Home'})
                this.$store.commit("SET_USERNAME_STATUS", this.formLogin.username);
                sessionStorage.setItem('username', this.formLogin.username);
                // this.$router.replace({name:'Home'})
                // this.$router.go(-1)
                
              }else {
                this.$Notice.error({
                  title: 'Sign in failed',
                  desc: '失败原因： ' + res.data.errMsg,
                  duration:10
                });
                sessionStorage.removeItem('username');
              }
            }).catch(e => {
              console.log(e)
                this.$Notice.error({
                  title: 'Sign in failed',
                });
            })
        } else {
            this.$Message.error('Username or password verification failed!');
        }
      })
    }
  },
}
</script>

<style>
  @import '../../assets/css/login.css';
</style>
