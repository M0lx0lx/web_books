<template>
    <div>
        <van-number-keyboard
                :show="show_num"
                theme="custom"
                close-button-text="完成"
                @blur="show_num = false"
                @input="onInput"
                @delete="onDelete"
                @close="onClose"
        />
        <div style="width: 100%;max-width: 660px;height:100%;margin: auto;">
            <div class="screen_abs"
                 style="background: #44454a;
                 color: #a6a8b1;
                 display: flex;
                 justify-content: space-between;
                  align-items: center;
                  font-size: 12px;
                   width: 100%;
                    height: 40px;
                    top:0">
                <div style="margin-left: 10px;">{{book_name}}</div>
                <div style="margin-right: 10px;font-weight: bold;" >{{count?(current+1)+'/'+count:"0/0"}}</div>
            </div>
            <!--@click="show_num=true"-->
            <img :src="images[current]" @click="()=>false" style="width: 100%;height:100%;transition: opacity .4s;margin: 40px 0;" />
            <div style="position: fixed;top: 0;left: 0;z-index: 1;width: 100%;height: 100%;background:rgba(0,0,0,0);" @click="()=>false" />
            <div class="screen_abs"
                 style="background: #44454a;
                    bottom: 0;">
                <div class="botton_func" title="已有文件记录" style="margin-right: 10px;">
                    <PopupRecord>
                        <i class="fa fa-file-text" style="width: 50px;" />
                    </PopupRecord>
                </div>
                <div class="botton_func" title="设置保存期限" style="margin-right: 10px;" v-if="all_images.length">
                    <DialogKeepDays>
                        <i class="fa fa-history" style="width: 50px;"/>
                    </DialogKeepDays>
                </div>
                <div class="botton_func" style="margin-right: 10px;">
                    <div class="upload_box">
                        <UploadFile>
                            <i class="fa fa-cloud-upload" style="width: 70px;border-right: 1px solid #7B7D8D;" title="上传PDF文件" />
                        </UploadFile>
                    </div>
                    <i class="fa" :class="is_full?'fa-window-restore':'fa-window-maximize'" :title="is_full?'退出全屏':'全屏'" style="width: 50px;" @click="to_full" />
                </div>
                <div class="botton_func updn">
                    <i class="fa fa-angle-left" title="上一页" @click="to_pre" />
                    <i class="fa fa-angle-right" style="border-left: 1px solid #7B7D8D;" title="下一页" @click="to_next" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import { Overlay,NumberKeyboard,Toast } from 'vant';
    import UploadFile from "./UploadFile"
    import PopupRecord from "./PopupRecord"
    import DialogKeepDays from "./DialogKeepDays"
    export default {
        name: "Screen",
        components: {
            [Overlay.name]: Overlay,
            [NumberKeyboard.name]: NumberKeyboard,
            UploadFile,
            PopupRecord,
            DialogKeepDays
        },
        props: {
            params: Object,
        },
        data(){
            return {
                images: [],
                current: 0,
                count: 0,
                is_full: false,
                percent: 0,
                show_num: false,
                page_number: '',
                list: [],
            }
        },
        watch: {
            current: function(n){
                //提前1页加载
                if(n>=this.images.length-2 && n<this.count-1 && this.count>this.images.length){
                    this.load_imgs(this.all_images,this.count,n+2,2);
                }
            },
            all_images: function(n){
                this.count=n.length;
                this.current=0;
                this.images=[];
                this.load_imgs(n,n.length,this.current,2);
            }
        },
        computed: {
            ...mapState({
                all_images: state => state.images,
                book_name: state=>state.name
            })
        },
        methods: {
            onClose(e){
                this.current=this.page_number;
            },
            onInput(e){
                this.page_number+=String(e);
                var tem= Number(this.page_number);
                if(tem>this.count){
                    this.page_number=e>this.count?1:e;
                }
                if(this.page_number === 0){
                    this.page_number=1;
                }
                this.page_number=Number(this.page_number);
                Toast('跳转至：'+this.page_number);

            },
            onDelete(e){
                var tem= String(this.page_number);
                if(tem.length>0){
                    this.page_number= Number(tem.substr(0,tem.length-1));
                } else{
                    this.page_number=1;
                }
                Toast('跳转至：'+this.page_number);
                console.log('onDelete：',e)
            },
            to_full(){
                //全屏
                function fullScreen(){
                    var el = document.documentElement;
                    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                    if(typeof rfs != "undefined" && rfs) {
                        rfs.call(el);
                    };
                    return;
                }
                //退出全屏
                function exitScreen(){
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                    else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    if(typeof cfs != "undefined" && cfs) {
                        cfs.call(el);
                    }
                }
                this.is_full? exitScreen():fullScreen();
                this.is_full= !this.is_full;
            },
            to_pre(){
                if(this.current>0){
                    this.current-=1;
                }
            },
            to_next(){
                if(this.current<this.count-1){
                    this.current+=1;
                }
            },

            load_img(url){
                return new Promise((resolve,reject)=>{
                    var img= new Image();
                    img.src=url;
                    img.onload= ()=>{
                        resolve(url);
                    }
                    img.onerror= ()=>{
                        reject();
                    }
                })
            },

            load_imgs(list,count,current,num=5){
                this.load_img(list[current]).then((res)=>{
                    this.images.push(res);
                    if(current<count-1 && num>0){
                        current++;
                        num--;
                        this.load_imgs(list,count,current,num);
                    }
                })
            },
            init(){

            }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    .screen_abs{
        width: 100%;
        max-width: 660px;
        height: 40px;
        position: fixed;
        /*left: 0;*/
        z-index: 3;
        opacity: 1;
    }
    .upload_box{
        display: inline-block;
        position: relative;
        &:hover{
            background: #38393d;
            color: #01B58F;
            cursor: pointer;
        }
    }
    .botton_func{
        height: 36px;
        box-sizing: border-box;
        margin-top: 2px;
        border: 1px solid #7B7D8D;
        border-radius: 2px;
        display: inline-block;
        cursor: pointer;
        color:#7f808a;
        font-size:12px;
        i{
            height: 100%;
            box-sizing: border-box;
            line-height: 36px;
            font-size: 26px;
        }
        i:hover{
            background: #38393d;
            color: #01B58F;
        }
    }
    .updn{
        width: 150px;
        i{
            width: 74px;
        }
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .block {
        width: 120px;
        height: 120px;
        background-color: #fff;
    }
</style>