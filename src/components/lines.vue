<template>
  <div>
    <div style="margin-left:20px">{{titleName}}</div>
    <pre
      style="margin-left:20px;color:white;background-color:black;padding:8px;min-height:150px;line-height:25px"
      v-html="executeResult"
    >
       </pre>
  </div>
</template>

<script>
export default {
  props: {
    executeResult: {
      type: String,
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
    }
  }
};
</script>

<style>
</style>template