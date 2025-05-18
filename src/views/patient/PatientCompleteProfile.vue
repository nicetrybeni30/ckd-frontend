<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Complete Your Health Profile</h1>

      <form @submit.prevent="confirmSubmit" class="space-y-4">
        <div v-for="field in editableFields" :key="field">
          <label class="block text-sm font-medium text-gray-700 capitalize mb-1">{{ beautifyLabel(field) }}</label>

          <select v-if="dropdownFields.includes(field)" v-model="form[field]" class="w-full border px-3 py-2 rounded" required>
            <option disabled value="">Select...</option>
            <option v-for="option in dropdownOptions[field]" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <input
            v-else
            v-model.number="form[field]"
            :type="fieldTypes[field] || 'number'"
            :step="decimalFields.includes(field) ? 'any' : '1'"
            class="w-full border px-3 py-2 rounded"
            :placeholder="beautifyLabel(field)"
            required
          />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl font-bold text-green-600 mb-4">✅ Profile Completed Successfully!</h2>
          <p class="text-gray-600 mb-4">You will now be redirected to dashboard.</p>
          <button @click="redirectToDashboard" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            OK
          </button>
        </div>
      </div>

      <!-- Error Modal -->
      <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl font-bold text-red-600 mb-4">❌ Error Submitting</h2>
          <p class="text-gray-700 mb-4">{{ errorMessage }}</p>
          <button @click="showErrorModal = false" class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

export default {
  components: { Navbar },
  data() {
    return {
      form: {
        age: '', bp: '', sg: '', al: '', su: '', rbc: '', pc: '', pcc: '', ba: '',
        bgr: '', bu: '', sc: '', sod: '', pot: '', hemo: '', pcv: '', wc: '', rc: '',
        htn: '', dm: '', cad: '', appet: '', pe: '', ane: '', smoker: '',
        classification: 'notckd',
        ckd_stage: 'none'
      },
      showSuccessModal: false,
      showErrorModal: false,
      errorMessage: '',
      editableFields: [
        'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba',
        'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc',
        'htn', 'dm', 'cad', 'appet', 'pe', 'ane', 'smoker'
      ],
      dropdownFields: ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane', 'smoker'],
      dropdownOptions: {
        rbc: ['normal', 'abnormal'],
        pc: ['normal', 'abnormal'],
        pcc: ['present', 'notpresent'],
        ba: ['present', 'notpresent'],
        htn: ['yes', 'no'],
        dm: ['yes', 'no'],
        cad: ['yes', 'no'],
        appet: ['good', 'poor'],
        pe: ['yes', 'no'],
        ane: ['yes', 'no'],
        smoker: ['yes', 'no']
      },
      fieldTypes: {
        age: 'number', bp: 'number', sg: 'number', al: 'number', su: 'number',
        bgr: 'number', bu: 'number', sc: 'number', sod: 'number', pot: 'number',
        hemo: 'number', pcv: 'number', wc: 'number', rc: 'number'
      },
      decimalFields: ['sg', 'sc', 'pot', 'rc', 'hemo', 'bgr', 'bu', 'sod', 'pcv', 'wc']
    }
  },
  methods: {
    beautifyLabel(field) {
      const customNames = {
        bp: 'Blood Pressure (BP)', sg: 'Specific Gravity (SG)', al: 'Albumin (AL)', su: 'Sugar (SU)',
        rbc: 'Red Blood Cells (RBC)', pc: 'Pus Cells (PC)', pcc: 'Pus Cell Clumps (PCC)', ba: 'Bacteria (BA)',
        bgr: 'Blood Glucose Random (BGR)', bu: 'Blood Urea (BU)', sc: 'Serum Creatinine (SC)', sod: 'Sodium (SOD)',
        pot: 'Potassium (POT)', hemo: 'Hemoglobin (HEMO)', pcv: 'Packed Cell Volume (PCV)',
        wc: 'White Blood Cell Count (WC)', rc: 'Red Blood Cell Count (RC)', htn: 'Hypertension (HTN)',
        dm: 'Diabetes Mellitus (DM)', cad: 'Coronary Artery Disease (CAD)', appet: 'Appetite',
        pe: 'Pedal Edema (PE)', ane: 'Anemia (ANE)', smoker: 'Smoking Status'
      }
      return customNames[field] || field.replace('_', ' ').toUpperCase()
    },
    confirmSubmit() {
      this.submitProfile()
    },
    async submitProfile() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.showErrorModal = true
          this.errorMessage = "Unauthorized. Please login again."
          this.$router.push('/patient/login')
          return
        }

        const response = await axios.post('http://localhost:8000/api/records/', this.form, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log('✅ Successfully submitted:', response.data)
        this.showSuccessModal = true
      } catch (error) {
        console.error('❌ Failed to complete profile', error)
        this.showErrorModal = true
        if (error.response?.status === 400) {
          this.errorMessage = "⚠️ Please fill out all fields correctly."
        } else if (error.response?.status === 401) {
          this.errorMessage = "Unauthorized access. Please login again."
          this.$router.push('/patient/login')
        } else {
          this.errorMessage = "Something went wrong. Please try again later."
        }
      }
    },
    redirectToDashboard() {
      this.showSuccessModal = false
      this.$router.push('/patient/dashboard')
    }
  }
}
</script>

<style scoped>
</style>
