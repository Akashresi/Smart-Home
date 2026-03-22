from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.recommendation import suggest_tasks, predict_low_inventory

router = APIRouter()

class ItemList(BaseModel):
    items: List[dict]

@router.post("/suggest-tasks")
def route_suggest_tasks(data: ItemList):
    suggestions = suggest_tasks(data.items)
    return {"suggestions": suggestions}

@router.post("/predict-inventory")
def route_predict_inventory(data: ItemList):
    predictions = predict_low_inventory(data.items)
    return {"at_risk": predictions}
