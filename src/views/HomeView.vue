<template>
  <div class="home">
    {{ isTest }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const isTest = ref<boolean>(false)
</script>
