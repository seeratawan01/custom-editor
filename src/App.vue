<template>
  <div id="app">
    <Toolbar />
    <!-- <Editor v-model="text" :max="250" /> -->
    <CEditor />
  </div>
</template>

<script>
// import Editor from "@/components/Editor";
import CEditor from "@/components/ContentEditable/CEditor";

import Toolbar from "@/components/Toolbar";

export default {
  name: "App",
  data() {
    return {
      text: "",
    };
  },
  components: {
    // Editor,
    Toolbar,
    CEditor,
  },
};
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
