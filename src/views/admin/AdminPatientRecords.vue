<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-full mx-auto">
      <h1 class="text-3xl font-bold mb-6">Patient Records</h1>
      <!-- Search Bar -->
      <div class="flex gap-2 mb-4">
        <input
          v-model="searchQuery"
          @keyup.enter="applySearch"
          ref="searchInput"
          type="text"
          placeholder="Search username..."
          class="border p-2 rounded w-64"
        />

        <!-- <button
          @click="applySearch"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button> -->

        <button
          @click="resetSearch"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>


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
                <button
                  v-if="user.record"
                  @click="openRecordModal(user)"
                  class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit Record
                </button>
                <button
                  v-else
                  @click="createRecord(user)"
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Create Record
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

      <!-- Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-8 rounded-xl shadow-lg max-w-6xl w-full overflow-y-auto max-h-[90vh]">
          
          <h2 class="text-2xl font-bold mb-6 text-center">Edit Patient Record</h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

            <template v-for="(value, key) in editableRecord" :key="key">
              
              <table 
                v-if="!excludedFields.includes(key?.toLowerCase())"
                class="w-full border rounded text-sm bg-white min-h-[90px]"
              >
                <tbody>
                  <tr>
                    <td class="border px-3 py-2 bg-gray-100 font-semibold w-1/2">
                      {{ formatFullLabel(key) }}
                    </td>

                    <td class="border px-3 py-2">
                      <input
                        v-model="editableRecord[key]"
                        type="text"
                        class="w-full px-2 py-1 border rounded"
                        :class="{ 'border-red-500': errors[key] }"
                      />
                      <p v-if="errors[key]" class="text-red-500 text-xs mt-1">{{ errors[key] }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>

            </template>

          </div>

          <div class="flex justify-end gap-4 mt-8">
            <button
              @click="showModal = false"
              class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              @click="updateRecord"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
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
      users: [],
      searchQuery: "",
      filteredUsers: [],
      page: 1,
      perPage: 10,
      showModal: false,
      editableRecord: {},
      selectedUser: null,
      saving: false,
      showSuccessToast: false,
      showErrorToast: false,
      successMessage: '',
      errorMessage: '',
      errors: {},
      excludedFields: [
        'id',
        'user',
        'last_prediction',
        'last_recommendation',
        'last_confidence',
        'last_predicted_at'
      ]
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.perPage)
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.perPage
      return this.filteredUsers.slice(start, start + this.perPage)
    }
  },

  watch: {
    searchQuery() {
      this.applySearch()
      this.page = 1
    }
  },

  async mounted() {
    await this.fetchUsers()
  },

  methods: {
    applySearch() {
      const query = this.searchQuery.toLowerCase()

      this.filteredUsers = this.users.filter(user => {
        const u = user.username.toLowerCase()
        const e = user.email ? user.email.toLowerCase() : ""

        return (
          u.includes(query) ||               // normal contains
          e.includes(query) ||               // email contains
          u.startsWith(query) ||             // allow prefix match
          e.startsWith(query) ||             // allow prefix match
          e.replace(/[^a-z0-9]/g, "").includes(query.replace(/[^a-z0-9]/g, ""))  // ignore dots, numbers for smart match
        );
      })
    },
    resetSearch() {
      this.searchQuery = ""
      this.filteredUsers = this.users
      this.page = 1

      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },

    async fetchUsers() {
      try {
        const res = await axios.get('http://localhost:8000/api/users-with-records/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users = res.data
        this.filteredUsers = res.data
      } catch (error) {
        console.error('Failed to fetch users with records:', error)
      }
    },

    formatFullLabel(key) {
      const mapping = {
        age: "Age", bp: "Blood Pressure", sg: "Specific Gravity", al: "Albumin",
        su: "Sugar", rbc: "Red Blood Cells", pc: "Pus Cell", pcc: "Pus Cell Clumps",
        ba: "Bacteria", bgr: "Blood Glucose Random", bu: "Blood Urea",
        sc: "Serum Creatinine", sod: "Sodium", pot: "Potassium", hemo: "Hemoglobin",
        pcv: "Packed Cell Volume", wc: "White Blood Cell Count",
        rc: "Red Blood Cell Count", htn: "Hypertension", dm: "Diabetes",
        cad: "Coronary Artery Disease", appet: "Appetite", pe: "Pedal Edema",
        ane: "Anemia", ckd_stage: "CKD Stage"
      }
      return mapping[key] || key.toUpperCase()
    },

    prevPage() { if (this.page > 1) this.page-- },
    nextPage() { if (this.page < this.totalPages) this.page++ },

    openRecordModal(user) {
      if (!user.record) {
        this.errorMessage = "This patient has no record yet."
        this.showErrorToast = true
        return
      }
      this.selectedUser = user
      this.editableRecord = { ...user.record }
      this.showModal = true
    },

    async createRecord(user) {
      try {
        await axios.post(`http://localhost:8000/api/records/${user.id}/create/`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.successMessage = 'Patient record created successfully!'
        this.showSuccessToast = true
        await this.fetchUsers()
      } catch (error) {
        this.errorMessage = 'Failed to create record.'
        this.showErrorToast = true
      }
    },

    validateRecord() {
      this.errors = {}

      Object.entries(this.editableRecord).forEach(([key, value]) => {
        if (!this.excludedFields.includes(key.toLowerCase())) {
          if (value === "" || value === null || value === undefined) {
            this.errors[key] = "This field is required."
          }
        }
      })

      return Object.keys(this.errors).length === 0
    },

    async updateRecord() {
      if (!this.validateRecord()) {
        this.$nextTick(() => {
          const el = document.querySelector(".border-red-500")
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
        })

        this.errorMessage = "Please fill in all required fields before saving."
        this.showErrorToast = true
        return
      }
      
      this.saving = true
      try {
        await axios.put(
          `http://localhost:8000/api/records/${this.selectedUser.id}/`,
          this.editableRecord,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        this.successMessage = 'Record updated!'
        this.showSuccessToast = true
        this.showModal = false
        await this.fetchUsers()
        this.applySearch() 
      } catch (error) {
        this.errorMessage = 'Update failed.'
        this.showErrorToast = true
      } finally {
        this.saving = false
      }
    }
  }
}
</script>