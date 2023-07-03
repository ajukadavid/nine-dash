import { createWebHistory, createRouter } from 'vue-router'

import dashboard from '../components/dashboard.vue'
import start from '../components/start.vue'
import menu from '../components/menu.vue'

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
	{
		path: '/menu',
		name: 'menu',
		component: menu,
	},

]

const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router