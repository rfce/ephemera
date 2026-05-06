// Preload all pages
export const preloadAllRemotes = async () => {
  await Promise.all([
    import('pixels/PixelsApp'),
    import('create-pixels/CreatePixelsApp'),
    import('pixels/Landing'),
    import('create-pixels/Dashboard'),
    import('create-pixels/Header'),
    import('pixels/CreateMessage'),
    import('create-pixels/Recommended'),
    import('pixels/AliasPick'),
    import('pixels/TrackMessage')
  ])
}
