<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Edit {{ isAdmin ? 'Any User' : 'My' }} Health Stats</h1>

      <div v-if="form">
        <form @submit.prevent="confirmSave" class="space-y-4">
          <div v-for="([key, value], index) in filteredFormEntries" :key="index">
            <label class="block text-sm font-medium text-gray-600 capitalize mb-1">{{ beautifyLabel(key) }}</label>

            <select v-if="dropdownFields.includes(key)" v-model="form[key]" class="w-full border px-3 py-2 rounded">
              <option v-for="option in dropdownOptions[key]" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <input
              v-else
              v-model="form[key]"
              :type="typeof value === 'number' ? 'number' : 'text'"
              class="w-full border px-3 py-2 rounded"
              :placeholder="beautifyLabel(key)"
            />
          </div>

          <!-- Buttons: Back + Save -->
          <div class="flex gap-4 mt-6">
            <BackButton />
            <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Save Changes
            </button>
          </div>

          <p v-if="message" class="mt-4 text-green-600 text-sm text-center">{{ message }}</p>
        </form>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl mb-4">Are you sure you want to save changes?</h2>
          <div class="flex justify-end gap-4">
            <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded">Yes</button>
            <button @click="showConfirm = false" class="px-4 py-2 bg-gray-400 rounded">No</button>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow text-center">
          <h2 class="text-xl mb-4 text-green-600 font-bold">{{ message }}</h2>
          <button @click="redirectAfterSuccess" class="px-6 py-2 bg-green-600 text-white rounded mt-4">
            OK
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div v-if="showToast" class="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow transition-all duration-300 z-50">
        {{ message }}
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
      isAdmin: false,
      selectedUser: '',
      users: [],
      form: null,
      originalForm: null,
      message: '',
      showConfirm: false,
      showSuccessModal: false,
      showToast: false,
      nonEditableFields: [
        'id', 'ckd_stage', 'last_prediction', 'last_recommendation',
        'last_confidence', 'last_predicted_at', 'user', 'classification'
      ],
      dropdownFields: ['pcc', 'ba', 'htn', 'dm', 'cad', 'pe', 'ane', 'smoker', 'appet', 'rbc', 'pc'],
      dropdownOptions: {
        pcc: ['present', 'notpresent'],
        ba: ['present', 'notpresent'],
        htn: ['yes', 'no'],
        dm: ['yes', 'no'],
        cad: ['yes', 'no'],
        pe: ['yes', 'no'],
        ane: ['yes', 'no'],
        smoker: ['yes', 'no'],
        appet: ['good', 'poor'],
        rbc: ['normal', 'abnormal'],
        pc: ['normal', 'abnormal']
      }
    }
  },
  computed: {
    filteredFormEntries() {
      if (!this.form) return []
      return Object.entries(this.form).filter(([key]) => !this.nonEditableFields.includes(key))
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
    beautifyLabel(key) {
      return key.replace('_', ' ').toUpperCase()
    },
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
        this.originalForm = { ...res.data }
      } catch (err) {
        console.error("Failed to fetch stats", err)
        this.$router.push('/patient/dashboard')
      }
    },
    confirmSave() {
      this.showConfirm = true
    },
    async saveChanges() {
      const token = localStorage.getItem('token')
      try {
        const payload = {}
        for (const [key, value] of Object.entries(this.form)) {
          if (!this.nonEditableFields.includes(key)) {
            payload[key] = value
          }
        }

        const hasChanges = Object.entries(payload).some(([key, value]) => {
          return value !== this.originalForm[key]
        })

        if (!hasChanges) {
          this.message = 'No changes detected.'
          this.showConfirm = false
          this.showSuccessModal = true
          this.showToast = true
          setTimeout(() => { this.showToast = false }, 2000)
          return
        }

        await axios.post('http://localhost:8000/api/records/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.message = 'Changes Saved Successfully!'
        this.showConfirm = false
        this.showSuccessModal = true
        this.showToast = true
        setTimeout(() => { this.showToast = false }, 2000)

      } catch (error) {
        console.error("Update failed", error)
        this.message = 'Something went wrong.'
        this.showConfirm = false
        this.showSuccessModal = true
        this.showToast = true
        setTimeout(() => { this.showToast = false }, 2000)
      }
    },
    redirectAfterSuccess() {
      this.showSuccessModal = false
      this.$router.push('/patient/dashboard')
    }
  }
}
</script>

<style scoped>
</style>
