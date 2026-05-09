import VueRouter from 'vue-router';
import Vue from "vue";


Vue.use(VueRouter)
export default new VueRouter({
    mode: 'history',
    routes: [

    ],
    scrollBehavior(to, from, savedPosition) {
        // If savedPosition is available, use it (e.g., when using browser back button)
        if (savedPosition) {
            return savedPosition;
        } else {
            // Otherwise, scroll to the top of the page for each new route
            return {x: 0, y: 0};

            // // Ensure immediate snap to the top
            // return new Promise((resolve) => {
            //     setTimeout(() => {
            //         window.scrollTo(0, 0); // Use window.scrollTo to disable smooth scrolling
            //         resolve({x: 0, y: 0});
            //     }, 0);
            // });
        }
    }
})


