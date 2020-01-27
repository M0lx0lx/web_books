<template>
    <div>
        <van-progress
                v-if="progress"
                :percentage="percent"
                :pivot-text="`读取${percent}%`"
                pivot-color="#1989fa"
                color="linear-gradient(to right, #409cf9, #1989fa)"
                style="margin: 10px;"
        />
        <van-uploader :after-read="afterRead" />
    </div>
</template>

<script>
    import { Uploader,Progress,Notify } from 'vant';
    export default {
        name: "UploadFile",
        components: {
            [Uploader.name]: Uploader,
            [Progress.name]: Progress,
        },
        data(){
            return {
                progress: false,
                percent: 0,
            }
        },
        methods: {
            afterRead(file) {
                // 此时可以自行将文件上传至服务器
                this.progress=true;
                clearInterval(b);
                var b= setInterval(()=>{
                    if(this.percent===100){
                        clearInterval(b);
                        setTimeout(()=>{
                            Notify({ type: 'success', message: '文件读取成功' });
                            this.progress=false;
                        },600)
                        return;
                    }
                    this.percent=this.percent+1;
                },10)
                console.log(file);
            }
        }
    }
</script>

<style scoped>

</style>