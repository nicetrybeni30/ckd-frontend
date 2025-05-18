<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Your Health Record</h1>

      <BackButton />

      <form @submit.prevent="submitRecord" class="space-y-4 mt-6">
        <div v-for="field in fields" :key="field.name">
          <label class="block mb-1 capitalize text-gray-700">{{ field.label }}</label>
          <input
            v-model.number="form[field.name]"
            :type="field.type"
            :step="decimalFields.includes(field.name) ? 'any' : '1'"
            class="w-full p-2 border rounded"
            :placeholder="field.label"
            required
          />
        </div>

        <button type="submit" class="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Save Record
        </button>
      </form>

      <div v-if="showError" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl font-bold text-red-600 mb-4">❌ Record Creation Failed</h2>
          <p class="text-gray-700 mb-4">Something went wrong while saving. Please try again.</p>
          <button @click="showError = false" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">OK</button>
        </div>
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
      form: {},
      fields: [
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'bp', label: 'Blood Pressure', type: 'number' },
        { name: 'sg', label: 'Specific Gravity', type: 'number' },
        { name: 'al', label: 'Albumin', type: 'number' },
        { name: 'su', label: 'Sugar', type: 'number' },
        { name: 'bgr', label: 'Blood Glucose Random', type: 'number' },
        { name: 'bu', label: 'Blood Urea', type: 'number' },
        { name: 'sc', label: 'Serum Creatinine', type: 'number' },
        { name: 'hemo', label: 'Hemoglobin', type: 'number' },
        { name: 'pcv', label: 'Packed Cell Volume', type: 'number' },
        { name: 'htn', label: 'Hypertension', type: 'text' },
        { name: 'dm', label: 'Diabetes Mellitus', type: 'text' }
      ],
      decimalFields: ['sg', 'sc', 'hemo', 'bgr', 'bu', 'pcv'],
      showError: false
    }
  },
  methods: {
    async submitRecord() {
      try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8000/api/records/create/', this.form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.$router.push('/patient/dashboard')
      } catch (err) {
        console.error('Error creating record', err)
        this.showError = true
      }
    }
  }
}
</script>

<style scoped></style>
