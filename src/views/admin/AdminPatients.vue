<template>
  <div class="min-h-screen p-6 bg-gray-100">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Patients Management</h1>

      <div class="mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search patients by name or email..."
          class="w-full p-2 border rounded"
        />
      </div>

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
                <button @click="editUser(user.id)" class="text-blue-600 hover:underline">Edit</button>
                <button @click="confirmDelete(user)" class="text-red-500 hover:underline">Delete</button>
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

      <!-- Delete Confirmation Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow max-w-sm">
          <h2 class="text-lg font-bold mb-2">Confirm Delete</h2>
          <p>Are you sure you want to delete <strong>{{ userToDelete.username }}</strong>?</p>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button @click="deleteUser" class="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded shadow max-w-md w-full">
          <h2 class="text-lg font-bold mb-4">Edit User: {{ selectedUser.username }}</h2>

          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Username</label>
              <input v-model="selectedUser.username" type="text" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Email</label>
              <input v-model="selectedUser.email" type="email" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">Phone</label>
              <input v-model="selectedUser.phone_number" type="text" class="w-full border px-3 py-2 rounded" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-600">New Password</label>
              <input v-model="selectedUser.new_password" type="password" class="w-full border px-3 py-2 rounded" />
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" @click="showEditModal = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      users: [],
      search: '',
      page: 1,
      perPage: 25,
      showModal: false,
      userToDelete: null,
      showEditModal: false,
      selectedUser: {} // for modal editing
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u =>
        u.username.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase())
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
      } catch (e) {
        console.error('Failed to fetch users', e)
      }
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++
    },
    confirmDelete(user) {
      this.userToDelete = user
      this.showModal = true
    },
    async deleteUser() {
      try {
        await axios.delete(`http://localhost:8000/api/users/${this.userToDelete.id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.showModal = false
        this.userToDelete = null
        await this.fetchUsers()
      } catch (e) {
        console.error('Failed to delete user', e)
      }
    },
    async editUser(id) {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.selectedUser = res.data
        this.selectedUser.new_password = ''
        this.showEditModal = true
      } catch (e) {
        console.error('Failed to load user', e)
      }
    },
    async updateUser() {
      try {
        const payload = { ...this.selectedUser }
        if (!payload.new_password) delete payload.new_password // don't send empty password

        await axios.put(`http://localhost:8000/api/users/${this.selectedUser.id}/`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        this.showEditModal = false
        await this.fetchUsers()
      } catch (e) {
        console.error('Failed to update user', e)
      }
    }
  }
}
</script>

<style scoped>
</style>
