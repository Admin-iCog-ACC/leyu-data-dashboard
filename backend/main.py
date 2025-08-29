
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from models import DatapointWithCount, MicrotaskAssignment
from database import SessionLocal
from tasks import process_datapoint_table


app = FastAPI()

# Allow CORS for localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def startup_event():
    scheduler = BackgroundScheduler()
    scheduler.add_job(process_datapoint_table, 'interval', days=1)
    scheduler.start()

@app.get("/run-once")
def run_once():
    process_datapoint_table()
    return {"status": "done"}

@app.get("/datapoints-with-count")
def get_datapoints_with_count(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    accepted: int = Query(None, description="Filter by accepted value (0 or 1)")
):
    session: Session = SessionLocal()
    query = session.query(DatapointWithCount)
    if accepted is not None:
        query = query.filter(DatapointWithCount.accepted == accepted)
    query = query.order_by(DatapointWithCount.date).offset(skip).limit(limit)
    result = []
    for row in query:
        result.append({
            "id": row.id,
            "data": row.data,
            "count": row.count,
            "accepted": row.accepted,
            "date": row.date
        })
    session.close()
    return result


# New endpoint to fetch only the required fields in the specified format


# API to show all data from microtask_assignment with column names as output
@app.get("/microtask-assignments")
def get_microtask_assignments():
    session = SessionLocal()
    assignments = []
    try:
        assignments = session.query(MicrotaskAssignment).order_by(MicrotaskAssignment.created_at.desc()).all()
        output = []
        for a in assignments:
            # Extract 'data' and 'files' as separate keys from output
            data = None
            files = None
            output_value = getattr(a, "output", None)
            duration = None
            own_access_code = None
            if output_value and isinstance(output_value, dict):
                data_dict = output_value.get("data")
                if data_dict and isinstance(data_dict, dict):
                    duration = data_dict.get("duration")
                    own_access_code = data_dict.get("own_access_code")
                files = output_value.get("files")
            if duration is not None:
                output.append({
                    "data": {
                        "duration": duration,
                        "own_access_code": own_access_code
                    },
                    "files": files
                })
        return {"output": output}
    finally:
        session.close()
