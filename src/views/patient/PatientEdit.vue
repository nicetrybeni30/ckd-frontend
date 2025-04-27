<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit {{ isAdmin ? 'Any User' : 'My' }} Health Stats</h2>

      <div v-if="isAdmin" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Select User</label>
        <select v-model="selectedUser" @change="fetchStats" class="w-full border px-3 py-2 rounded">
          <option disabled value="">-- Select a user --</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.username }} ({{ user.email }})
          </option>
        </select>
      </div>

      <form @submit.prevent="updateStats" class="space-y-4" v-if="form">
        <div v-for="(value, key) in form" :key="key" v-if="key !== 'id'">
          <label class="block text-sm font-medium text-gray-600 capitalize mb-1">{{ key }}</label>
          <input
            v-model="form[key]"
            :type="typeof value === 'number' ? 'number' : 'text'"
            class="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save Changes
        </button>

        <p v-if="message" class="mt-4 text-green-600 text-sm">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isAdmin: false,
      selectedUser: '',
      users: [],
      form: null,
      message: ''
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    try {
      const me = await axios.get('http://localhost:8000/api/patient/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.isAdmin = me.data.role === 'admin'

      if (this.isAdmin) {
        const res = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.users = res.data
      } else {
        await this.fetchStats()
      }
    } catch (err) {
      console.error("Error during mount:", err)
    }
  },
  methods: {
    async fetchStats() {
      const token = localStorage.getItem('token')
      const url = this.isAdmin
        ? `http://localhost:8000/api/records/${this.selectedUser}/`
        : `http://localhost:8000/api/records/me`

      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.form = res.data
      } catch (err) {
        console.error("Failed to fetch stats", err)
      }
    },
    async updateStats() {
      const token = localStorage.getItem('token')
      const payload = { ...this.form }
      delete payload.id  // Ensure ID isn't sent

      try {
        await axios.post('http://localhost:8000/api/records/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.message = 'Stats updated successfully!'
      } catch (error) {
        console.error("Update failed", error)
        this.message = 'Something went wrong.'
      }
    }
  }
}
</script>
