<template>
  <div id="app">
  <Toolbar/>
    <Editor :max="250"/>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import Toolbar from "@/components/Toolbar";


export default {
  name: 'App',
  components: {
    Editor,
    Toolbar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
</style>
