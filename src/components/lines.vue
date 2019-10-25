<template>
  <div>
    <div style="margin-left:20px">{{titleName}}</div>
    <pre
      style="margin-left:20px;color:white;background-color:black;padding:8px;min-height:150px;line-height:25px"
      v-html="result"
    >
       </pre>
  </div>
</template>

<script>
export default {
  props: {
    executeResult: {
      type: [String,Array],
      default: ""
    },
    title: {
      type: String,
      default: () => ""
    }
  },
  computed:{
    titleName(){
      return this.title? (this.title+'：'):''
    },
    result (){
      return Array.isArray(this.executeResult)?this.executeResult.join('\n'):this.executeResult
    }
  }
};
</script>

<style>
</style>template