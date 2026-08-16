// Keep federation imports in one place so we can control their network priority.
const remoteLoaders = {
  pixelsApp: () => import('pixels/PixelsApp'),
  createPixelsApp: () => import('create-pixels/CreatePixelsApp'),
  landing: () => import('pixels/Landing'),
  dashboard: () => import('create-pixels/Dashboard'),
  header: () => import('create-pixels/Header'),
  createMessage: () => import('pixels/CreateMessage'),
  recommended: () => import('create-pixels/Recommended'),
  aliasPick: () => import('pixels/AliasPick'),
  trackMessage: () => import('pixels/TrackMessage'),
}

const routeModules = (pathname) => {
  if (pathname === '/') return ['landing', 'dashboard']
  if (pathname === '/dashboard') return ['pixelsApp', 'createPixelsApp']
  if (pathname === '/dashboard/create-pixels') return ['header', 'aliasPick']
  if (/^\/dashboard\/message\/[^/]+$/.test(pathname)) {
    return ['header', 'createMessage', 'recommended']
  }
  if (/^\/dashboard\/track-boat\/[^/]+$/.test(pathname)) {
    return ['header', 'trackMessage']
  }

  return []
}

const load = (moduleNames) => Promise.all(moduleNames.map((name) => remoteLoaders[name]()))

// Start only the modules needed to render the route the visitor opened.
// React.lazy will reuse these promises when the route mounts.
export const preloadRouteRemotes = (pathname = window.location.pathname) =>
  load(routeModules(pathname))

// Load everything else at low priority once the first route can paint.
export const preloadRemainingRemotes = (pathname = window.location.pathname) => {
  const required = new Set(routeModules(pathname))
  return load(Object.keys(remoteLoaders).filter((name) => !required.has(name)))
}

export const scheduleRemainingRemotes = (pathname = window.location.pathname) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => preloadRemainingRemotes(pathname))
    return
  }

  // Two frames guarantee that the browser gets an opportunity to paint first.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => window.setTimeout(() => preloadRemainingRemotes(pathname), 0))
  })
}
