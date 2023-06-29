import { createWebHistory, createRouter } from 'vue-router'

import dashboard from '../components/dashboard.vue'

const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: dashboard,
	},

]

const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router