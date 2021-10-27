<template>
  <div id="app">
    <div id="nav">
      <router-link to="/test">Test</router-link>|
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/projecttest">UNIT TESTTTTTT</router-link>

      <router-link to="/empty">empty</router-link>

      <button class="border border-red" @click="$store.dispatch('entities/deleteAll')" >
        DELETE ALL ORM STORE!!!!
      </button>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
