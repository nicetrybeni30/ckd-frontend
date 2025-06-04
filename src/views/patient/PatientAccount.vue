<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="mt-6 p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">My Account</h2>

      <form @submit.prevent="updateAccount" class="space-y-6">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Username</label>
          <input v-model="username" type="text" class="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">New Password (Optional)</label>
          <input v-model="newPassword" type="password" class="w-full border px-3 py-2 rounded" />
        </div>

        <div class="flex gap-4">
          <BackButton />
          <button type="submit" class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Save Changes
          </button>
        </div>

        <p v-if="message" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'" class="text-sm text-center mt-4">
          {{ message }}
        </p>
      </form>
    </div>

    <!-- Toasts -->
    <div v-if="showSuccessToast" class="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
       Profile Updated Successfully!
    </div>

    <div v-if="showErrorToast" class="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
       Failed to Update Profile!
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
      newPassword: '',
      message: '',
      messageType: '', // 'success' or 'error'
      showSuccessToast: false,
      showErrorToast: false
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get('http://localhost:8000/api/patient/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.username = res.data.username
      this.email = res.data.email
    } catch (error) {
      console.error('Failed to load user info:', error)
    }
  },
  methods: {
    async updateAccount() {
      const token = localStorage.getItem('token')

      // Validate new password (if filled)
      if (this.newPassword) {
        const hasNumber = /\d/.test(this.newPassword)
        const hasSpecialChar = /[!@#$%^&*]/.test(this.newPassword)

        if (!hasNumber || !hasSpecialChar) {
          this.messageType = 'error'
          if (!hasNumber && !hasSpecialChar) {
            this.message = 'Password must contain at least one number and one special character.'
          } else if (!hasNumber) {
            this.message = 'Password must contain at least one number.'
          } else if (!hasSpecialChar) {
            this.message = 'Password must contain at least one special character.'
          }
          this.showErrorToast = true
          setTimeout(() => { this.showErrorToast = false }, 3000)
          return
        }
      }

      const payload = {
        username: this.username,
        email: this.email
      }
      if (this.newPassword) {
        payload.password = this.newPassword
      }

      try {
        await axios.put('http://localhost:8000/api/account/update/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.message = 'Profile updated successfully!'
        this.messageType = 'success'
        this.showSuccessToast = true
        setTimeout(() => { this.showSuccessToast = false }, 3000)
      } catch (error) {
        console.error('Update failed:', error)
        this.message = 'Failed to update profile.'
        this.messageType = 'error'
        this.showErrorToast = true
        setTimeout(() => { this.showErrorToast = false }, 3000)
      }
    }
  }
}
</script>

<style scoped>
</style>
