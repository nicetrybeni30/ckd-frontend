<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-full mx-auto">
      <h1 class="text-3xl font-bold mb-6">Patient Records</h1>

      <!-- Patients Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded shadow text-sm">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="p-3">Username</th>
              <th class="p-3">Age</th>
              <th class="p-3">Blood Pressure</th>
              <th class="p-3">Specific Gravity</th>
              <th class="p-3">Albumin</th>
              <th class="p-3">Sugar</th>
              <th class="p-3">Red Blood Cells</th>
              <th class="p-3">Pus Cell</th>
              <th class="p-3">Pus Cell Clumps</th>
              <th class="p-3">Bacteria</th>
              <th class="p-3">Blood Glucose Random</th>
              <th class="p-3">Blood Urea</th>
              <th class="p-3">Serum Creatinine</th>
              <th class="p-3">Sodium</th>
              <th class="p-3">Potassium</th>
              <th class="p-3">Hemoglobin</th>
              <th class="p-3">Packed Cell Volume</th>
              <th class="p-3">White Blood Cell Count</th>
              <th class="p-3">Red Blood Cell Count</th>
              <th class="p-3">Hypertension</th>
              <th class="p-3">Diabetes Mellitus</th>
              <th class="p-3">Coronary Artery Disease</th>
              <th class="p-3">Appetite</th>
              <th class="p-3">Pedal Edema</th>
              <th class="p-3">Anemia</th>
              <th class="p-3">CKD Stage</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="border-t">
              <td class="p-3">{{ user.username }}</td>
              <td class="p-3">{{ user.record?.age }}</td>
              <td class="p-3">{{ user.record?.bp }}</td>
              <td class="p-3">{{ user.record?.sg }}</td>
              <td class="p-3">{{ user.record?.al }}</td>
              <td class="p-3">{{ user.record?.su }}</td>
              <td class="p-3">{{ user.record?.rbc }}</td>
              <td class="p-3">{{ user.record?.pc }}</td>
              <td class="p-3">{{ user.record?.pcc }}</td>
              <td class="p-3">{{ user.record?.ba }}</td>
              <td class="p-3">{{ user.record?.bgr }}</td>
              <td class="p-3">{{ user.record?.bu }}</td>
              <td class="p-3">{{ user.record?.sc }}</td>
              <td class="p-3">{{ user.record?.sod }}</td>
              <td class="p-3">{{ user.record?.pot }}</td>
              <td class="p-3">{{ user.record?.hemo }}</td>
              <td class="p-3">{{ user.record?.pcv }}</td>
              <td class="p-3">{{ user.record?.wc }}</td>
              <td class="p-3">{{ user.record?.rc }}</td>
              <td class="p-3">{{ user.record?.htn }}</td>
              <td class="p-3">{{ user.record?.dm }}</td>
              <td class="p-3">{{ user.record?.cad }}</td>
              <td class="p-3">{{ user.record?.appet }}</td>
              <td class="p-3">{{ user.record?.pe }}</td>
              <td class="p-3">{{ user.record?.ane }}</td>
              <td class="p-3">{{ user.record?.ckd_stage }}</td>
              <td class="p-3">
                <button @click="openRecordModal(user)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Edit Record
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-between items-center text-sm">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Next</button>
      </div>

      <!-- Toasts -->
      <div v-if="showSuccessToast" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2">
        <span>{{ successMessage }}</span>
        <button @click="showSuccessToast = false" class="font-bold">×</button>
      </div>
      <div v-if="showErrorToast" class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2">
        <span>{{ errorMessage }}</span>
        <button @click="showErrorToast = false" class="font-bold">×</button>
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
      users: [],
      page: 1,
      perPage: 10,
      showModal: false,
      editableRecord: {},
      selectedUser: null,
      saving: false,
      showSuccessToast: false,
      showErrorToast: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.perPage)
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.perPage
      return this.users.slice(start, start + this.perPage)
    },
    filteredEditableRecord() {
      const filtered = { ...this.editableRecord }
      delete filtered.id
      delete filtered.user
      return filtered
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    async fetchUsers() {
      try {
        const res = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users = res.data.filter(u => u.role === 'patient')

        for (const user of this.users) {
          try {
            const recordRes = await axios.get(`http://localhost:8000/api/records/${user.id}/`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            user.record = recordRes.data
          } catch (err) {
            if (err.response && err.response.status === 401) {
              console.warn('🔒 Unauthorized while fetching record, user probably logged out.')
              return
            }
            user.record = null
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.warn('🔒 Unauthorized while fetching users.')
          return
        }
        console.error('Failed to fetch users:', error)
      }
    },
    async openRecordModal(user) {
      if (!user.record) {
        this.showErrorToast = true
        this.errorMessage = "This patient has no record yet."
        setTimeout(() => { this.showErrorToast = false }, 2000)
        return
      }
      this.selectedUser = user
      this.editableRecord = { ...user.record }
      this.showModal = true
    },
    async updateRecord() {
      this.saving = true
      try {
        await axios.put(`http://localhost:8000/api/records/${this.selectedUser.id}/`, this.editableRecord, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.showSuccessToast = true
        this.successMessage = 'Patient record updated successfully!'
        setTimeout(() => { this.showSuccessToast = false }, 2000)
        this.showModal = false
        await this.fetchUsers()
      } catch (error) {
        console.error(error)
        this.showErrorToast = true
        this.errorMessage = 'Failed to update patient record.'
        setTimeout(() => { this.showErrorToast = false }, 2000)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
</style>
