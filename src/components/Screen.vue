<template>
    <div>
        <div>
            <button @click="to_pre">上一页</button>
            <img :src="imgs[current]" style="width:300px;height:200px;" />
            <button @click="to_next">下一页</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Screen",
        data(){
            return {
                imgs: [
                    require('@/assets/logo.png'),
                ],
                all_imgs_url: [],
                current: 0,
                count: 0,
            }
        },
        watch: {
            current: function(n){
                console.log('n:',n);
                //提前1页加载
                if(n>=this.imgs.length-2 && n<this.count-1 && this.count>this.imgs.length){
                    this.load_imgs(this.all_imgs_url,this.count,n+2,2);
                }
            }
        },
        methods: {
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
                        console.log('预加载成功')
                    }
                    img.onerror= ()=>{
                        reject();
                        console.log('预加载出错')
                    }
                })
            },

            load_imgs(list,count,current,num=5){
                this.load_img(list[current].url).then((res)=>{
                    this.imgs.push(res);
                    if(current<count-1 && num>0){
                        current++;
                        num--;
                        this.load_imgs(list,count,current,num);
                    }
                })
            }
        },
        mounted(){
            var imgs_tem= {
                images:
                    [
                    {
                        url: "http://192.168.43.22:8081/images/nothing.jpg",
                    },
                    {
                        url: "http://www.tongxine.net:8091/Image/loginbg.jpg",
                    },
                    {
                        url: "http://192.168.43.22:8081/images/nothing2.jpg",
                    },
                    {
                        url: "http://192.168.43.22:8081/images/p1.PNG",
                    },
                    {
                        url: "http://192.168.43.22:8081/images/p2.PNG",
                    },
                    {
                        url: "http://192.168.43.22:8081/images/p3.PNG",
                    },
                ],
                count: 6,
            }
            this.count=imgs_tem.count;
            this.all_imgs_url= imgs_tem.images;
            this.load_imgs(imgs_tem.images,imgs_tem.count,this.current,2);
        }
    }
</script>

<style scoped>

</style>