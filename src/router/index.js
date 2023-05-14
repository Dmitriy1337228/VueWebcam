import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import AuthPage from '../components/AuthPage.vue'
import NotFound from '../components/NotFound.vue'
import RegisterPage from '../components/RegisterPage.vue'

const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/register',
        component: RegisterPage
    },
    {
        path: '/auth',
        component: AuthPage
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,

})

export default router