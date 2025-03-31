import psycopg2
import os

# Conexión a la DB usando env vars de Railway
conn = psycopg2.connect(
    host=os.environ["PGHOST"],
    database=os.environ["PGDATABASE"],
    user=os.environ["PGUSER"],
    password=os.environ["PGPASSWORD"],
    port=os.environ.get("PGPORT", 5432)
)

cur = conn.cursor()

# Leer los handles desde la tabla channels
cur.execute("SELECT handle FROM channels")
rows = cur.fetchall()

for (handle,) in rows:
    url = f"https://www.youtube.com/@{handle}/live"
    print("Scrappeando:", url)

cur.close()
conn.close()