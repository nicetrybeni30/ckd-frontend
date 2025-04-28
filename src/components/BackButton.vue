<template>
    <button
      @click="$router.back()"
      class="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      ← Back
    </button>
  </template>
  
  <script>
  export default {
    name: 'BackButton'
  }
  </script>
  