<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">Edit Patient: {{ patient.username }}</h2>
  
        <form @submit.prevent="saveChanges" class="space-y-4">
          <div v-for="(value, key) in form" :key="key">
            <label class="block mb-1 capitalize">{{ key }}</label>
            <input
              v-model="form[key]"
              :type="typeof value === 'number' ? 'number' : 'text'"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="flex justify-end space-x-4 mt-4">
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-400 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    props: {
      patient: Object
    },
    data() {
      return {
        form: {}
      }
    },
    mounted() {
      this.form = { ...this.patient }
      delete this.form.id // don't allow editing ID
    },
    methods: {
      async saveChanges() {
        const token = localStorage.getItem('token')
        try {
          await axios.put(`http://localhost:8000/api/users/${this.patient.id}/`, this.form, {
            headers: { Authorization: `Bearer ${token}` }
          })
          this.$emit('updated') // refresh parent after saving
          this.$emit('close')
        } catch (err) {
          console.error('Failed to save changes', err)
        }
      }
    }
  }
  </script>
  