<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="p-8 bg-white rounded shadow-md w-96">
        <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block mb-1">Username</label>
            <input
              v-model="username"
              type="text"
              class="w-full p-2 border rounded"
              placeholder="Enter your username"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block mb-1">Password</label>
            <input
              v-model="password"
              type="password"
              class="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: "AdminLogin",
    data() {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:8000/api/token/', {
            username: this.username,
            password: this.password
          })
  
          const token = response.data.access
          localStorage.setItem('token', token)
  
          console.log('✅ Admin login success')
  
          // Redirect to admin dashboard after login
          this.$router.push('/admin/dashboard')
        } catch (err) {
          console.error('❌ Login failed:', err)
          this.error = 'Invalid username or password'
        }
      }
    }
  }
  </script>
  