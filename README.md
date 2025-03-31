# Manija Cron: YouTube Live Stream Scraper + API + Frontend

This project is a full-stack system to monitor and display live YouTube streams from a predefined list of channels. It includes:

- A local cron job that scrapes live stream data using `yt-dlp`
- A PostgreSQL database hosted on Railway
- A Bun + Hono API to expose the data
- A SvelteKit frontend that fetches live data on the server side

---

## 🧱 Tech Stack

| Part            | Tech            |
|-----------------|-----------------|
| Scraper         | Python + yt-dlp |
| DB              | PostgreSQL (Railway) |
| API             | Bun + Hono      |
| Frontend        | SvelteKit       |
| Cron scheduler  | macOS `launchd` |

---

## 🔁 Workflow

1. `cron.py` runs every 5 or 30 minutes using `launchd`
2. It reads a list of YouTube channel handles from the `channels` table
3. For each channel:
   - It calls `yt-dlp` to fetch live stream info
   - If the channel is live, it saves the video info into the `live_videos` table
   - If not live, it removes any existing entry from `live_videos`
4. The Python script runs up to 3 scrapes in parallel
5. At the end of each run, it prints a clear summary to `launchd.log`

---

## 🗃️ Database Schema

### `channels`
```sql
channels (
  handle TEXT PRIMARY KEY,
  name TEXT
);
```

### `live_videos`
```sql
live_videos (
  handle TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  video_title TEXT,
  video_url TEXT
);
```

---

## ⚙️ Cron Setup (macOS `launchd`)

LaunchAgent plist path:
```
~/Library/LaunchAgents/dev.user.manija.cron.plist
```

Example configuration:
```xml
<key>StartInterval</key>
<integer>300</integer> <!-- every 5 minutes -->
<key>RunAtLoad</key>
<true/>
```

Standard output and errors are logged to:
```
../manija/apps/backend/cron/launchd.log
```

---

## 🌐 API

Built with **Bun + Hono**, the API exposes:

### `GET /live`
Returns the list of currently live videos from the DB.

- CORS is enabled for the frontend domain.
- Deployed to Railway.

---

## ⚡ Frontend Integration

SvelteKit fetches live data **server-side** from `/live` inside `+layout.server.ts`.
Allows to watch multiple youtube videos at the same time in a single space.


