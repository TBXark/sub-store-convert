import { serve } from '@hono/node-server'
import app from './index.js'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'
})
