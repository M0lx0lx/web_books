<template>
    <div>
        <!--<van-progress-->
                <!--v-if="progress"-->
                <!--:percentage="percent"-->
                <!--:pivot-text="`读取${percent}%`"-->
                <!--pivot-color="#1989fa"-->
                <!--color="linear-gradient(to right, #409cf9, #1989fa)"-->
                <!--style="margin: 10px;"-->
        <!--/>-->
        <van-uploader accept="application/pdf" :after-read="afterRead" name="filename" >
            <van-loading class="loading" v-if="changing" />
            <span class="upload_progress" v-if="progress"><span :style="{width: percent}" /></span>
            <slot />
        </van-uploader>
    </div>
</template>

<script>
    import { Uploader,Progress,Notify,Toast,Loading } from 'vant';
    export default {
        name: "UploadFile",
        components: {
            [Uploader.name]: Uploader,
            [Progress.name]: Progress,
            [Loading .name]: Loading ,
        },
        data(){
            return {
                progress: false,
                changing: false,
                percent: 0,
            }
        },
        methods: {
            afterRead(file,detail) {
                // console.log("file:",file);
                // console.log("detail:",detail);
                // 此时可以自行将文件上传至服务器
                if (file.file.type !== 'application/pdf') {
                    Toast('请上传 pdf 格式文件');
                    return false;
                }
                this.progress=true;

                let params = new FormData()
                params.append('filename', file.file)

                this.axios.post('http://localhost:8089/upload', params,{
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: e => {
                        var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                        var tem = (e.loaded / e.total * 100) | 0;
                        this.percent = completeProgress;
                    }
                }).then(res=>{
                    Toast.success('文件读取成功');
                    this.progress=false;
                    this.changing=true;
                    setTimeout(()=>{
                        Toast({
                            message: '文件转换中...',
                            icon: 'like-o'
                        });
                        this.get_images(res.data.name)
                    },1000)
                    // this.$store.commit('set_images', {images: res.data.images})
                }).catch((error)=>{
                    console.log(error);
                });
            },
            get_images(s){
                // this.$store.dispatch('get_book_images', {s:s,self: this}).then(v=>{
                //     if(v.code ===404){
                //         Notify({ type: 'danger', message: '未找到该资源' });
                //         return
                //     }
                //     Toast.success(v.name);
                //     this.changing=false;
                //     // if(this.$route.query.s !== s){
                //     //     this.$router.push({  query: { s }})
                //     // }
                // })
                this.axios.get('http://localhost:8089/book', {params: {s},withCredentials: true}).then(res=>{
                    if(res.data.code ===202){
                        setTimeout(()=>this.get_images(s),2000)
                        return
                    }
                    if(res.data.code ===404){
                        Notify({ type: 'danger', message: '未找到该资源' });
                        return
                    }
                    Toast.success(res.data.name);
                    this.changing=false;
                    if(this.$route.query.s !== s){
                        this.$router.push({  query: { s }})
                    }
                    this.$store.commit('set_images', {images: res.data.images, name: res.data.name, file_name: res.data.file_name})

                }).catch((error)=>{
                    console.log(error);
                });
            }
        },
        mounted(){
            if(this.$route.query.s){
                this.get_images(this.$route.query.s)
            }
        }
    }
</script>

<style scoped lang="less">
    .loading{
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 10;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        cursor: wait;
        background-color: rgba(68, 69, 74, 0.8);
    }
    .upload_progress{
        display: inline-block;
        position: absolute;
        top: 1px;
        left: 1px;
        width: calc(100% - 3px);
        height: 3px;
        background: #ccc;
        margin: 0;
        padding: 0;
        span{
            display: inline-block;
            position: absolute;
            background: #01B58F;
            height: 100%;
            width: 30%;
            margin: 0;
            padding: 0;
            top: 0;
            left: 0;
        }
    }

</style>