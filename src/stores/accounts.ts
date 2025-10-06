import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Account {
  id: string
  label: string
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  // Загрузка из localStorage при инициализации
  const savedAccounts = localStorage.getItem('accounts')
  if (savedAccounts) {
    try {
      accounts.value = JSON.parse(savedAccounts)
    } catch (e) {
      console.error('Error loading accounts from localStorage:', e)
      accounts.value = []
    }
  }

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      label: '',
      type: 'Локальная',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
    saveToLocalStorage()
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter(account => account.id !== id)
    saveToLocalStorage()
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const accountIndex = accounts.value.findIndex(account => account.id === id)
    if (accountIndex !== -1) {
      accounts.value[accountIndex] = { ...accounts.value[accountIndex], ...updates }
      saveToLocalStorage()
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('accounts', JSON.stringify(accounts.value))
    } catch (e) {
      console.error('Error saving accounts to localStorage:', e)
    }
  }

  const getAccounts = computed(() => accounts.value)

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    getAccounts
  }
})