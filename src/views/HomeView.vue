<template>
  <div class="edit">
    <div class="edit-toolbar"></div>
    <div class="edit-canvas" id="editCanvas"></div>
    <div class="edit-controls">
      <span @click="handleCrop">裁剪</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { PhotoEdit } from "@/photoEdit/index"

let photoEdit: any = null

const handleCrop = () => {
  photoEdit.crop()
}

onMounted(() => {
  photoEdit = new PhotoEdit(document.getElementById("editCanvas") as HTMLElement, {
    src: require("./im.png"),
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
    // width: 1000px;
    // height: 1000px;
    // margin: 0 auto;
    flex: 1;
    background: rgb(72, 69, 69);
    background-image: linear-gradient(rgb(95, 95, 95) 1px, transparent 0), linear-gradient(90deg, rgb(95, 95, 95) 1px, transparent 0),
      linear-gradient(hsla(0, 0%, 100%, 0.3) 1px, transparent 0), linear-gradient(90deg, hsla(0, 0%, 100%, 0.3) 1px, transparent 0);
    background-size: 15px 15px;
  }
  &-controls {
    height: 120px;
    background-color: #262626;
  }
}
</style>
