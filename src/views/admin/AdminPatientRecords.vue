<template>
    <div class="min-h-screen p-6 bg-gray-100">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Patient Records</h1>
  
        <div v-if="loading" class="text-gray-500">Loading...</div>
  
        <form v-else @submit.prevent="updateRecord" class="space-y-4 bg-white p-6 rounded shadow">
          <div v-for="(value, key) in record" :key="key">
            <label class="block text-sm font-medium text-gray-600 capitalize mb-1">{{ key }}</label>
            <input
              v-model="record[key]"
              :type="typeof value === 'number' ? 'number' : 'text'"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
  
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
        record: null,
        message: '',
        loading: true
      }
    },
    async mounted() {
      const id = this.$route.params.id
      try {
        const res = await axios.get(`http://localhost:8000/api/records/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.record = res.data
      } catch (error) {
        console.error('Failed to fetch record', error)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async updateRecord() {
        try {
          const id = this.$route.params.id
          await axios.put(`http://localhost:8000/api/records/${id}/`, this.record, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.message = 'Record updated successfully!'
        } catch (error) {
          console.error('Failed to update record', error)
          this.message = 'Something went wrong.'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  