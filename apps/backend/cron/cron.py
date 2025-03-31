from db import get_connection, get_handles, save_video
from yt_scraper import scrape_channel

def main():
    conn = get_connection()
    handles = get_handles(conn)

    for handle in handles:
        url = f"https://www.youtube.com/{handle}/live"
        print(f"\n🎯 {url}")
        video, error = scrape_channel(url)

        if error:
            print("⚠️ Error:", error)
            continue

        if video:
            save_video(conn, video)
            print("✅ Guardado:", video['video_title'])

    conn.close()

if __name__ == "__main__":
    main()
