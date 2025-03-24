import { Hono } from 'hono'
import { config } from 'dotenv'

config()

const app = new Hono()

app.get('/live/:channelId', async (c) => {
  const { channelId } = c.req.param()
  const apiKey = process.env.YOUTUBE_API_KEY

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`)
  const data = await res.json()

  if (!data.items || data.items.length === 0) {
    return c.json({ live: false })
  }

  const videoId = data.items[0].id.videoId
  return c.json({
    live: true,
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    title: data.items[0].snippet.title
  })
})

export default app
