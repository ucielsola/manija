from datetime import datetime
from db import get_connection, get_handles, save_video, delete_video
from yt_scraper import scrape_channel
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_handle(conn, handle):
    url = f"https://www.youtube.com/{handle}/live"
    video, error = scrape_channel(url)

    if error:
        if "not currently live" in error.lower() or "no hay transmisión" in error.lower():
            delete_video(conn, handle)
            return (handle, "deleted")
        else:
            return (handle, f"error: {error}")

    if video:
        save_video(conn, handle, video)
        return (handle, "saved")

    return (handle, "skipped")


def main():
    start_time = datetime.now()
    conn = get_connection()
    handles = get_handles(conn)

    saved = []
    deleted = []
    errors = []

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [executor.submit(process_handle, conn, handle) for handle in handles]

        for future in as_completed(futures):
            handle, result = future.result()
            if result == "saved":
                saved.append(handle)
            elif result == "deleted":
                deleted.append(handle)
            else:
                errors.append((handle, result))

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print("\n📊 --- RESUMEN DE EJECUCIÓN ---")
    print(f"⏰ Inicio    : {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⏱ Duración  : {duration:.2f} segundos")
    print(f"🔍 Total     : {len(handles)} handles procesados\n")

    print("✅ Resultados:")
    print(f"  💾 Guardados : {len(saved)}")
    print(f"  🗑 Eliminados : {len(deleted)}")
    print(f"  🚨 Errores   : {len(errors)}")

    if saved:
        print("\n   → Guardados:")
        for h in saved:
            print(f"     - {h}")

    if deleted:
        print("\n   → Eliminados:")
        for h in deleted:
            print(f"     - {h}")

    if errors:
        print("\n   → Errores:")
        for handle, msg in errors:
            print(f"     - {handle}: {msg}")

    print("\n✅ Finalizado correctamente.\n")

    conn.close()

if __name__ == "__main__":
    main()
