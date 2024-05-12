// middleware/no-layout-transition.js
export default function ({ route, redirect }) {
  if (process.client && !('startViewTransition' in document)) {
    // Disable layout transition for client-side navigation
    route.meta.layoutTransition = false
  } else if (process.server) {
    // Redirect to home page on server-side navigation
    return redirect('/')
  }
}
