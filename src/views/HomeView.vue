<template>
  <div class="edit">
    <div class="edit-toolbar"></div>
    <div class="edit-canvas" id="editCanvas"></div>
    <div class="edit-controls"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { PhotoEdit } from "./photo-edit"

onMounted(() => {
  new PhotoEdit(document.getElementById("editCanvas") as HTMLElement, {
    src: require("./img.png"),
  })
})

// import { ref } from "vue"
// const isTest = ref<boolean>(false)
</script>

<style scoped lang="less">
.edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-toolbar {
    height: 50px;
    background-color: #262626;
  }
  &-canvas {
    flex: 1;
    background-color: #121212;
  }
  &-controls {
    height: 120px;
    background-color: #262626;
  }
}
</style>
