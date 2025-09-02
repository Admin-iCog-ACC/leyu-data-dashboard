import json
from sqlalchemy import text
from models import DatapointWithCount, Base
from database import engine
from tokenizer import count_tokens_for_text

def process_datapoint_table():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, data, created_at FROM datapoint"))
        rows = result.fetchall()
        upserts = []
        for row in rows:
            id, data_json, created_at = row
            try:
                data = json.loads(data_json) if isinstance(data_json, str) else data_json
                answer = data.get("answer", "")
                count = count_tokens_for_text(answer)
                accepted_val = data.get("accepted", False)
                accepted = 1 if accepted_val is True or str(accepted_val).lower() == "true" else 0
                # Try to get date from data JSON, otherwise use created_at from database
                date_val = data.get("date") or data.get("created_at") or data.get("timestamp")
                if date_val:
                    # If date is a string, try to parse it
                    if isinstance(date_val, str):
                        try:
                            from datetime import datetime
                            date = datetime.fromisoformat(date_val.replace('Z', '+00:00'))
                        except:
                            date = created_at  # fallback to database timestamp
                    else:
                        date = date_val
                else:
                    date = created_at  # use database timestamp
                data_to_store = {"answer": answer}
            except Exception:
                count = 0
                accepted = 0
                date = created_at if created_at else None
                data_to_store = {"answer": ""}
            # Convert date to ISO string if it's a datetime object and not None
            if date is not None and hasattr(date, 'isoformat'):
                date_to_store = date.isoformat()
            else:
                date_to_store = date
            upserts.append({
                "id": id,
                "data": data_to_store,
                "count": count,
                "accepted": accepted,
                "date": date_to_store
            })
        if upserts:
            upsert_sql = text("""
                INSERT INTO datapoint_with_count (id, data, count, accepted, date)
                VALUES (:id, :data, :count, :accepted, :date)
                ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data, count=EXCLUDED.count, accepted=EXCLUDED.accepted, date=EXCLUDED.date;
            """)
            for u in upserts:
                conn.execute(
                    upsert_sql,
                    {
                        "id": u["id"],
                        "data": json.dumps(u["data"]),
                        "count": u["count"],
                        "accepted": u["accepted"],
                        "date": u["date"]
                    }
                )
