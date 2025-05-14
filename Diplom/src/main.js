import { createApp } from 'vue'
import App from './App.vue'

import router from './router/router'

// const app = createApp(App)
//             .use(router)
//             .mount('#app')

const app = createApp(App);
app.config.performance = true;
app.use(router).mount('#app');

