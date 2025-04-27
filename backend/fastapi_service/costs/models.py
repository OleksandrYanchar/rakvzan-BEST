from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class ProcurementRecord(BaseModel):
    documentDate: date
    amount: float

class EstabData(BaseModel):
    employees: Optional[int] = None
    avg_monthly_income: Optional[float] = None
    annual_tax: Optional[float] = None
    premises_area: Optional[float] = None
    status: str
    destruction_date: Optional[date] = None
    city: Optional[str] = None

class LossRequest(BaseModel):
    records: List[ProcurementRecord]
    establishment: EstabData

class LossResponse(BaseModel):
    direct_loss_est: float
    indirect_loss_est: float
    active: bool