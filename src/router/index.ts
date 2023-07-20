import { createWebHistory, createRouter } from "vue-router";

import dashboard from "../components/dashboard.vue";
import start from "../components/start.vue";
import menu from "../components/menu.vue";
import shop from "../components/shop.vue";
import subscribe from "../components/subscribe.vue";
import music from "../components/music.vue";
import skate from "../components/skate.vue";
import about from "../components/about.vue";
import contact from "../components/contact.vue";

const routes = [
    {
        path: "/",
        name: "dashboard",
        component: dashboard,
    },
    {
        path: "/start",
        name: "start",
        component: start,
    },
    {
        path: "/menu",
        name: "menu",
        component: menu,
    },
    {
        path: "/shop",
        name: "shop",
        component: shop,
    },
    {
        path: "/subscribe",
        name: "subscribe",
        component: subscribe,
    },
    {
        path: "/music",
        name: "music",
        component: music,
    },
    {
        path: "/contact",
        name: "contact",
        component: contact,
    },
    {
        path: "/about",
        name: "about",
        component: about,
    },
    {
        path: "/skate",
        name: "skate",
        component: skate,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes, 
});
export default router;
