<template>
    <div class="home">
        <!--<HelloWorld msg="Welcome to Use The reader"/>-->
        <!--<UploadFile :params="params" />-->
        <Screen :params="params" />
    </div>
</template>

<script>
    // @ is an alias to /src
    import {
        HelloWorld,
        UploadFile,
        Screen
    } from '@/components'

    export default {
        name: 'home',
        components: {
            HelloWorld,
            UploadFile,
            Screen
        },
        data(){
            return {
                params: null,
            }
        },
        methods: {
            init() {
                var imgs_tem = {
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
                };
                this.params=imgs_tem;
                // this.$store.commit('set_images', {images: imgs_tem.images, count: imgs_tem.count})
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
