<template>
  <div class='toolbar'>
    <button @click="e => format('bold')">Bold</button>
    <button @click="e => format('italic')">Italics</button>

  </div>
</template>

<script>
export default {
  name: "toolbar",
  methods: {
    format() {},
    addLink() {},
    setUrl() {},
    setHeader() {},
    addCodeBlock() {},
    handleSubmit() {}
  }
}
</script>

<style>
  .toolbar {
    border:solid 1px #ddd;
    background:#f4f4f4;
    padding: 5px;
    border-radius:3px;
    position: fixed;
    top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hidden {
     display: none;
   }
</style>