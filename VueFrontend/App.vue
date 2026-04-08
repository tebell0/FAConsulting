<!--
  App.vue
  ───────────────────────────────────────────────────────────────────
  Root component. Renders the active page via <RouterView>.
  No layout chrome lives here — each page owns its own nav/footer
  via the shared AppNav / AppFooter components.
  ───────────────────────────────────────────────────────────────────
-->
<template>
  <RouterView />
</template>

<script setup>
// Font injection is handled by index.html <link> tags site-wide.
// useFonts() calls in each page are no-ops after the first load
// (they check for the element ID before inserting anything).
</script>

<style>
/*
  Global baseline styles.
  Component-scoped and page-level styles live in their own files.
  This block only sets the bare minimum needed before any page loads.
*/

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #0a0a0a;
  color: #f5f0eb;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
  cursor: none;
}
</style>
