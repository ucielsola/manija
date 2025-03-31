import psycopg2
import os
import subprocess
import json

# Conexión a PostgreSQL
conn = psycopg2.connect(
    host=os.environ["PGHOST"],
    database=os.environ["PGDATABASE"],
    user=os.environ["PGUSER"],
    password=os.environ["PGPASSWORD"],
    port=os.environ.get("PGPORT", 5432)
)

cur = conn.cursor()

# Leer los handles desde la tabla "channels"
cur.execute("SELECT handle FROM channels")
rows = cur.fetchall()

for (handle,) in rows:
    url = f"https://www.youtube.com/{handle}/live"  # El handle ya incluye o no el @ según la DB
    print(f"🟡 Scrappeando {url}...")

    # Ejecutar yt-dlp -j
    result = subprocess.run(
        ["yt-dlp", "-j", url],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"⚠️ yt-dlp falló para {handle}")
        print("stderr:", result.stderr)
        print("stdout:", result.stdout)
        continue

    try:
        data = json.loads(result.stdout)

        video_id = data["id"]
        video_title = data["title"]
        channel_id = data["channel_id"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        print("✅ EN VIVO")
        print("  Channel ID:", channel_id)
        print("  Video ID:  ", video_id)
        print("  Title:     ", video_title)
        print("  URL:       ", video_url)
        print()

    except Exception as e:
        print(f"❌ Error parseando JSON para {handle}: {e}")

cur.close()
conn.close()