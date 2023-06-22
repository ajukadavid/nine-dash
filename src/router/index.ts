import { createWebHistory, createRouter } from 'vue-router'

import dashboard from '../components/dashboard.vue'
import store from '../components/store.vue'

const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: dashboard,
	},
	{
		path: '/store',
		name: 'store',
		component: store,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router