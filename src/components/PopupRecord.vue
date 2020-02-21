<template>
    <div>
        <van-popup
                v-model="show"
                position="left"
                style="width: 40%;">
            <div class="title">阅读记录</div>
                <van-list
                        v-model="list_loading"
                        :finished="finished"
                        @load="onLoad"
                        class="list"
                >
                    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">
                        <div class="list_refresh_box">
                            <div v-for="(v,i) in list" :key="i" class="list_item" style="" @click="()=>to_reading(v.file_name)">
                                <p style="padding: 0;margin: 0;">{{v.original_name}}</p>
                                <p style="padding: 0;margin: 6px 0 0;text-align: right">{{v.create_date}}</p>
                            </div>
                        </div>
                    </van-pull-refresh>
                </van-list>
        </van-popup>
        <div @click="show=true">
            <slot />
        </div>
    </div>
</template>

<script>
    import { Popup,List,PullRefresh,Toast } from 'vant';
    export default {
        name: "PopupRecord",
        components: {
            [Popup .name]: Popup ,
            [List .name]: List,
            [PullRefresh .name]: PullRefresh,
            [Toast .name]: Toast,
        },
        data(){
            return {
                show: false,
                isLoading: false,
                finished: false,
                list: [],
                list_loading: false,
            }
        },
        methods: {
            to_reading(s){
                this.show=false;
                if(this.$route.query.s !== s){
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
                        if(this.$route.query.s !== s){
                            this.$router.push({  query: { s }})
                        }
                        this.$store.commit('set_images', {images: res.data.images, name: res.data.name,file_name: res.data.file_name})

                    }).catch((error)=>{
                        console.log(error);
                    });
                }
            },
            get_books(){
                return new Promise((res,rej)=>{
                    this.axios.get('http://localhost:8089/user_books', {withCredentials: true}).then(v=>{
                        this.list=v.data.data;
                        res(v.data.data);
                    }).catch((error)=>{
                        console.log(error);
                    });
                })
            },
            onRefresh() {
                setTimeout(() => {
                    this.isLoading = false;
                    this.get_books()
                }, 1000);
            },
            onLoad() {
                this.get_books().then(v=>{
                    this.finished = true;
                    this.list_loading = false;
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .title{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee;
    }
    .list{
        width: 100%;
        height: 300px;
        overflow-y:auto;
        overflow-x: hidden;
        .list_refresh_box{
            min-height: 290px;
        }
        .list_item{
            text-overflow: ellipsis;
            width: 146px;
            overflow: hidden;
            white-space: nowrap;
            /*display:inline-block;*/
            border-bottom: 1px solid #eee;
            padding: 15px 0px;
            margin: 0 10px;
            text-align: left;
            font-size: 14px;
            box-sizing: border-box;
        }
    }
</style>