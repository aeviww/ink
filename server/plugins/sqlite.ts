export default defineNitroPlugin((nitroApp) => {
  useSqlite()
  nitroApp.hooks.hook('close', () => closeSqlite())
})
