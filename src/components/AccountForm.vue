<template>
  <div class="account-manager">
    <div class="header">
      <h1>Управление учетными записями</h1>
      <button @click="addAccount" class="add-button">+ Добавить учетную запись</button>
    </div>

    <div class="label-hint">
      <small>💡 Подсказка: Вводите метки через точку с запятой (;)</small>
    </div>

    <div v-if="accounts.length === 0" class="empty-state">
      <p>Нет учетных записей. Нажмите "+ Добавить учетную запись" чтобы создать первую.</p>
    </div>

    <div class="accounts-list" v-else>
      <div 
        v-for="account in accounts" 
        :key="account.id" 
        class="account-item"
      >
        <div class="form-row">
          <label>Метка (необязательно, максимум 50 символов):</label>
          <input
            type="text"
            v-model="account.label"
            @blur="validateAccount(account)"
            :class="{ error: errors[account.id]?.label }"
            maxlength="50"
            placeholder="метка1; метка2; метка3"
          />
        </div>

        <div class="form-row">
          <label>Тип записи:</label>
          <select
            v-model="account.type"
            @change="onTypeChange(account)"
            :class="{ error: errors[account.id]?.type }"
          >
            <option value="Локальная">Локальная</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>

        <div class="form-row">
          <label>Логин (обязательно, максимум 100 символов):</label>
          <input
            type="text"
            v-model="account.login"
            @blur="validateAccount(account)"
            :class="{ error: errors[account.id]?.login }"
            maxlength="100"
            placeholder="Введите логин"
          />
          <div v-if="errors[account.id]?.login" class="error-message">Логин обязателен для заполнения</div>
        </div>

        <div class="form-row" v-if="account.type === 'Локальная'">
          <label>Пароль (обязательно, максимум 100 символов):</label>
          <input
            type="password"
            v-model="account.password"
            @blur="validateAccount(account)"
            :class="{ error: errors[account.id]?.password }"
            maxlength="100"
            placeholder="Введите пароль"
          />
          <div v-if="errors[account.id]?.password" class="error-message">Пароль обязателен для локальных учетных записей</div>
        </div>

        <div class="account-actions">
          <button 
            @click="removeAccount(account.id)" 
            class="delete-button"
            type="button"
          >
            Удалить
          </button>
          <div v-if="isAccountValid(account.id)" class="status-valid">✓ Запись сохранена</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccountsStore, type Account } from '../stores/accounts'

const accountsStore = useAccountsStore()

const errors = ref<{ [key: string]: { [field: string]: boolean } }>({})

const accounts = computed(() => accountsStore.getAccounts)

const addAccount = () => {
  accountsStore.addAccount()
}

const removeAccount = (id: string) => {
  accountsStore.removeAccount(id)
  delete errors.value[id]
}

const onTypeChange = (account: Account) => {
  if (account.type === 'LDAP') {
    account.password = null
  } else if (account.type === 'Локальная' && account.password === null) {
    account.password = ''
  }
  validateAccount(account)
}

const validateAccount = (account: Account) => {
  const accountErrors: { [field: string]: boolean } = {}


  if (!account.login.trim()) {
    accountErrors.login = true
  } else if (account.login.length > 100) {
    accountErrors.login = true
  }


  if (account.type === 'Локальная') {
    if (!account.password?.trim()) {
      accountErrors.password = true
    } else if (account.password.length > 100) {
      accountErrors.password = true
    }
  }


  if (account.label.length > 50) {
    accountErrors.label = true
  }

  errors.value[account.id] = accountErrors


  if (Object.keys(accountErrors).length === 0) {
    saveAccount(account)
  }
}

const saveAccount = (account: Account) => {
  accountsStore.updateAccount(account.id, account)
}

const isAccountValid = (accountId: string) => {
  return !errors.value[accountId] || Object.keys(errors.value[accountId]).length === 0
}
</script>

<style scoped>
.account-manager {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

h1 {
  color: #333;
  margin: 0;
}

.add-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-button:hover {
  background: #45a049;
}

.label-hint {
  background: #e3f2fd;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #1565c0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.account-item {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: white;
}

.form-row {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #4CAF50;
}

input.error, select.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.account-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.delete-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-button:hover {
  background: #d32f2f;
}

.status-valid {
  color: #4CAF50;
  font-size: 14px;
}
</style>