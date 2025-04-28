<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
  
        <form @submit.prevent="signup" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input v-model="username" type="text" required class="w-full border px-3 py-2 rounded" placeholder="Username" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" type="email" required class="w-full border px-3 py-2 rounded" placeholder="Email" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" type="password" required class="w-full border px-3 py-2 rounded" placeholder="Password" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <input v-model="confirmPassword" type="password" required class="w-full border px-3 py-2 rounded" placeholder="Confirm Password" />
          </div>
  
          <button type="submit" class="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            Sign Up
          </button>
  
          <p v-if="error" class="text-red-500 text-sm text-center mt-4">{{ error }}</p>
          <p v-if="success" class="text-green-500 text-sm text-center mt-4">✅ Account created! Redirecting...</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: false
      }
    },
    methods: {
      async signup() {
        this.error = ''
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
  
        if (!emailRegex.test(this.email)) {
          this.error = 'Invalid email format.'
          return
        }
  
        if (!passwordRegex.test(this.password)) {
          this.error = 'Password must be at least 8 characters, include a number and a special character.'
          return
        }
  
        if (this.password !== this.confirmPassword) {
          this.error = 'Passwords do not match.'
          return
        }
  
        try {
          // 🛠 Step 1: Register the user
          await axios.post('http://localhost:8000/api/register/', {
            username: this.username,
            email: this.email,
            password: this.password
          })
  
          // 🛠 Step 2: Immediately login and save token
          const res = await axios.post('http://localhost:8000/api/token/', {
            username: this.username,
            password: this.password
          })
          localStorage.setItem('token', res.data.access)
  
          this.success = true
          setTimeout(() => {
            this.$router.push('/patient/complete-profile')
          }, 1000)
  
        } catch (err) {
          console.error(err)
  
          if (err.response?.status === 400) {
            this.error = 'Username or Email already exists.'
          } else {
            this.error = 'Signup failed. Please try again later.'
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  