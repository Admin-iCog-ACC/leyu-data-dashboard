from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Integer, JSON,  Boolean, DateTime, JSON, Float


Base = declarative_base()

class DatapointWithCount(Base):
    __tablename__ = "datapoint_with_count"
    id = Column(String, primary_key=True, index=True)
    data = Column(JSON)
    count = Column(Integer)
    accepted = Column(Integer)
    date = Column(DateTime)


class MicrotaskAssignment(Base):
    __tablename__ = "microtask_assignment"
    id = Column(String, primary_key=True, index=True)
    box_id = Column(Integer)
    local_id = Column(String, nullable=True)
    microtask_id = Column(String)
    task_id = Column(Integer)
    avatar_id = Column(Integer)
    worker_id = Column(Integer)
    test = Column(Boolean)
    wgroup = Column(String, nullable=True)
    sent_to_server_at = Column(DateTime)
    deadline = Column(DateTime, nullable=True)
    status = Column(String)
    completed_at = Column(DateTime)
    output = Column(JSON)
    output_file_id = Column(String, nullable=True)
    logs = Column(JSON)
    submitted_to_box_at = Column(DateTime)
    submitted_to_server_at = Column(DateTime)
    verified_at = Column(DateTime)
    report = Column(JSON)
    max_base_credits = Column(Integer)
    base_credits = Column(Integer)
    max_credits = Column(Integer)
    credits = Column(Integer)
    accepted = Column(Boolean)
    extras = Column(JSON, nullable=True)
    created_at = Column(DateTime)
    last_updated_at = Column(DateTime)
    batch_id = Column(String)