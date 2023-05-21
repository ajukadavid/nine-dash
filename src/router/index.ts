import { createWebHistory, createRouter } from 'vue-router'

import dashboard from '../components/dashboard.vue'
import email from '../components/email.vue'

const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: dashboard,
	},
	{
		path: '/new',
		name: 'email',
		component: email,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router