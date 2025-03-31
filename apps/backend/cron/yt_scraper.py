import subprocess
import json

def scrape_channel(url):
    result = subprocess.run(
        ["yt-dlp", "-j", url],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        return None, result.stderr.strip()

    try:
        data = json.loads(result.stdout)
        return {
            "channel_id": data["channel_id"],
            "video_id": data["id"],
            "video_title": data["title"],
            "video_url": f"https://www.youtube.com/watch?v={data['id']}"
        }, None

    except Exception as e:
        return None, str(e)
