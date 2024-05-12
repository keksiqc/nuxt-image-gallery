npm install vue vue-router bootstrap-vue


<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">Image Gallery</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/gallery">Gallery</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


<template>
  <div>
    <b-container>
      <b-row>
        <b-col v-for="(image, index) in images" :key="index" md="4">
          <b-card
            :img-src="image.src"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
            <b-card-text>{{ image.title }}</b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        {
          title: "Image 1",
          src: "https://picsum.photos/id/237/400/300",
        },
        {
          title: "Image 2",
          src: "https://picsum.photos/id/238/400/300",
        },
        {
          title: "Image 3",
          src: "https://picsum.photos/id/239/400/300",
        },
      ],
    };
  },
};
</script>


import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import ImageGallery from "../components/ImageGallery.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/gallery", component: ImageGallery },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;


import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
