<template>
    <div>
        <van-dialog v-model="show" title="请选择保存期限" :beforeClose="onConfirm" show-cancel-button>
            <van-radio-group v-model="radio_val" style="display: inline-block;">
                <van-radio name="3" style="margin: 10px 0">3天</van-radio>
                <van-radio name="10" style="margin-bottom: 10px">10天</van-radio>
                <van-radio name="30" style="margin-bottom: 10px">30天</van-radio>
                <van-radio name="m" style="margin-bottom: 10px">30秒测试</van-radio>
            </van-radio-group>
            <div v-if="keep_days">
                当前图书保留至：{{keep_days}}
            </div>
        </van-dialog>
        <div @click="onShow">
            <slot />
        </div>
    </div>
</template>

<script>
    import { Toast,Dialog,RadioGroup,Radio } from 'vant';
    import {mapState} from 'vuex'
    export default {
        name: "DialogKeepDays",
        components: {
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Dialog.Component.name]: Dialog.Component,
        },
        data(){
            return {
                show: false,
                radio_val: null,
                keep_days: null
            }
        },
        computed: {
            ...mapState({
                book_name: state=>state.name,
                file_name: state=>state.file_name
            })
        },
        methods: {
            onShow(){
                this.show=true;
                this.axios.get('http://192.168.0.4:8089/user_books', {params: {file_name: this.file_name},withCredentials: true}).then(res=>{
                    if(res.data.data){
                        var b= new Date(res.data.data.keep_days);
                        this.keep_days=`${b.getFullYear()}-${b.getMonth()}-${b.getDate()}`
                    }
                    else{
                        this.keep_days= null;
                    }
                }).catch((error)=>{
                    console.log(error);
                });

            },
            onConfirm(action, done){
                if (action === 'confirm') {
                    if(!this.radio_val){
                        done();
                        return;
                    }
                    this.axios.get('http://192.168.0.4:8089/maintain', {params: {original_name: this.book_name, keep_days: this.radio_val},withCredentials: true}).then(res=>{
                        if(res.data.code === 200){
                            Toast.success('设置成功！');
                        } else{
                            Toast.fail('设置失败！');
                        }
                        this.radio_val=null;
                        done();
                    }).catch((error)=>{
                        console.log(error);
                    });
                } else {
                    done();
                }

            },
        }
    }
</script>

<style scoped>

</style>