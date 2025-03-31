import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.environ["PGHOST"],
        port=os.environ.get("PGPORT", 5432),
        database=os.environ["PGDATABASE"],
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"]
    )

def get_handles(conn):
    cur = conn.cursor()
    cur.execute("SELECT handle FROM channels")
    rows = cur.fetchall()
    cur.close()
    return [handle for (handle,) in rows]

def save_video(conn, video):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO live_videos (channel_id, video_id, video_title, video_url)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (channel_id) DO UPDATE
        SET video_id = EXCLUDED.video_id,
            video_title = EXCLUDED.video_title,
            video_url = EXCLUDED.video_url
    """, (
        video["channel_id"],
        video["video_id"],
        video["video_title"],
        video["video_url"]
    ))
    conn.commit()
    cur.close()
