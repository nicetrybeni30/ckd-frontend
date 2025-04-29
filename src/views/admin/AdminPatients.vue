<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Patients Management</h1>

      <!-- Search Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input v-model="searchUsername" type="text" placeholder="Search by username" class="w-full p-2 border rounded" />
        <input v-model="searchEmail" type="text" placeholder="Search by email" class="w-full p-2 border rounded" />
        <input v-model="searchPhone" type="text" placeholder="Search by phone" class="w-full p-2 border rounded" />
      </div>

      <!-- Patients Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded shadow">
          <thead>
            <tr class="bg-gray-200 text-left text-sm">
              <th class="p-3">Username</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Phone</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="border-t">
              <td class="p-3">{{ user.username }}</td>
              <td class="p-3">{{ user.email }}</td>
              <td class="p-3">{{ user.role }}</td>
              <td class="p-3">{{ user.phone_number || '-' }}</td>
              <td class="p-3 flex gap-2">
                <button @click="openEditModal(user)" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Edit</button>
                <button @click="confirmDelete(user)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="text-center text-gray-500 py-4">No patients found.</td>
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

      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow max-w-sm">
          <h2 class="text-lg font-bold mb-2">Confirm Delete</h2>
          <p>Are you sure you want to delete <strong>{{ selectedUser.username }}</strong>?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button @click="deleteUser" class="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow max-w-md w-full">
          <h2 class="text-lg font-bold mb-4">Edit User</h2>

          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Username</label>
              <input v-model="editUser.username" type="text" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Email</label>
              <input v-model="editUser.email" type="email" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Phone</label>
              <input v-model="editUser.phone_number" type="text" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">New Password</label>
              <input v-model="editUser.new_password" type="password" class="w-full border px-3 py-2 rounded" />
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="showEditModal = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toasts -->
      <div v-if="showSuccessToast" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
        {{ successMessage }}
      </div>
      <div v-if="showErrorToast" class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
        {{ errorMessage }}
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
      searchUsername: '',
      searchEmail: '',
      searchPhone: '',
      page: 1,
      perPage: 10,
      selectedUser: null,
      editUser: {},
      showDeleteModal: false,
      showEditModal: false,
      showSuccessToast: false,
      showErrorToast: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchUsername.toLowerCase()) &&
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase()) &&
        (user.phone_number || '').toLowerCase().includes(this.searchPhone.toLowerCase())
      )
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.perPage)
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.perPage
      return this.filteredUsers.slice(start, start + this.perPage)
    }
  },
  async mounted() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.users = res.data
      } catch (error) {
        console.error('Failed to fetch users', error)
      }
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    confirmDelete(user) {
      this.selectedUser = user
      this.showDeleteModal = true
    },
    async deleteUser() {
      try {
        await axios.delete(`http://localhost:8000/api/users/${this.selectedUser.id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.showSuccessToast = true
        this.successMessage = 'User deleted successfully!'
        await this.fetchUsers()
        this.showDeleteModal = false
        setTimeout(() => { this.showSuccessToast = false }, 2000)
      } catch (error) {
        this.showErrorToast = true
        this.errorMessage = 'Failed to delete user!'
        setTimeout(() => { this.showErrorToast = false }, 2000)
      }
    },
    openEditModal(user) {
      this.editUser = { ...user, new_password: '' }
      this.showEditModal = true
    },
    async updateUser() {
      try {
        const payload = { ...this.editUser }

        if (payload.new_password) {
          const hasNumber = /\d/.test(payload.new_password)
          const hasSpecial = /[!@#$%^&*]/.test(payload.new_password)

          if (!hasNumber && !hasSpecial) {
            this.showErrorToast = true
            this.errorMessage = 'Password must include at least one number and one special character.'
            setTimeout(() => { this.showErrorToast = false }, 3000)
            return
          } else if (!hasNumber) {
            this.showErrorToast = true
            this.errorMessage = 'Password must include at least one number.'
            setTimeout(() => { this.showErrorToast = false }, 3000)
            return
          } else if (!hasSpecial) {
            this.showErrorToast = true
            this.errorMessage = 'Password must include at least one special character.'
            setTimeout(() => { this.showErrorToast = false }, 3000)
            return
          }
        } else {
          delete payload.new_password
        }

        await axios.put(`http://localhost:8000/api/users/${this.editUser.id}/`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        this.showSuccessToast = true
        if (this.editUser.new_password) {
          this.successMessage = 'Password updated successfully!'
        } else {
          this.successMessage = 'User updated successfully!'
        }

        await this.fetchUsers()
        this.showEditModal = false
        setTimeout(() => { this.showSuccessToast = false }, 2000)

      } catch (error) {
        console.error(error)
        this.showErrorToast = true
        this.errorMessage = 'Failed to update user!'
        setTimeout(() => { this.showErrorToast = false }, 2000)
      }
    }
  }
}
</script>

<style scoped>
</style>
