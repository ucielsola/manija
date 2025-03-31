import subprocess
import json

def scrape_channel(url):
    result = subprocess.run(
        ["yt-dlp", "-j", url],
        capture_output=True,
        text=True
    )

    # Delete channels that are not live
    if result.returncode != 0:
        if "not currently live" in result.stderr.lower():
            return None, "No hay transmisión activa"
        else:
            return None, result.stderr.strip()

    try:
        data = json.loads(result.stdout)

        return {
            "video_id": data["id"],
            "video_title": data["title"],
            "video_url": f"https://www.youtube.com/watch?v={data['id']}"
        }, None

    except Exception as e:
        return None, f"Error de parseo JSON: {e}"
