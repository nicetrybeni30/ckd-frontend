<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div class="max-w-5xl mx-auto mt-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
  
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">User Overview</h2>
            <p class="text-sm text-gray-600">Number of patient users: <strong>96</strong></p>
            <p class="text-sm text-gray-600">Admins: <strong>1</strong></p>
          </div>
  
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Model Tools</h2>
            <router-link
              to="/predict"
              class="inline-block mt-2 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
            >
              Run Prediction
            </router-link>
          </div>
        </div>
  
        <div class="mt-8">
          <router-link
            to="/edit"
            class="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Edit Patient Data
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue'
  
  export default {
    components: {
      Navbar
    }
  }
  </script>
  