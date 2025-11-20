<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Patient Account</h1>

      <BackButton />

      <form @submit.prevent="createPatient" class="space-y-4 mt-6">
        <div>
          <label class="block mb-1 text-gray-700 font-medium">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-700 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-2 border rounded"
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-700 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Create Account
        </button>
      </form>

      <!-- Success Modal -->
      <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl font-bold text-green-600 mb-4">Account Created Successfully</h2>
          <button @click="finish" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">OK</button>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mt-4 text-red-500 text-center font-semibold">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import BackButton from '@/components/BackButton.vue'
import axios from 'axios'

export default {
  components: { Navbar, BackButton },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      showSuccess: false,
      errorMessage: ''
    }
  },
  methods: {
    async createPatient() {
      try {
        const token = localStorage.getItem('token')

        await axios.post(
          'http://localhost:8000/api/users/create/',
          {
            username: this.username,
            email: this.email,
            password: this.password,
            role: 'patient'
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        this.showSuccess = true
      } catch (error) {
        console.error(error)
        this.errorMessage = 'Failed to create account. Try again.'
      }
    },
    finish() {
      this.showSuccess = false
      this.$router.push('/admin/patients')
    }
  }
}
</script>

<style scoped></style>
