<template>
  <div class="home">
    <HelloWorld msg="Welcome to Use The reader"/>
    <UploadFile />
    <Screen />
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
  }
}
</script>
