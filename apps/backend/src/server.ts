import app from './index'

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
})