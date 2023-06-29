import { createWebHistory, createRouter } from 'vue-router'

import dashboard from '../components/dashboard.vue'
import start from '../components/start.vue'

const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: dashboard,
	},
	{
		path: '/start',
		name: 'start',
		component: start,
	},

]

const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router