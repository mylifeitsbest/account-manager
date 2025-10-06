<template>
  <div id="app">
    <AccountForm />
  </div>
</template>

<script setup lang="ts">
import AccountForm from './components/AccountForm.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  padding: 20px;
}
</style>