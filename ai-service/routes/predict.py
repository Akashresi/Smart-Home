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

class DeviceData(BaseModel):
    usage_history: List[float]
    room_occupancy: bool = True

@router.post("/recommend")
def get_recommendations(data: DeviceData):
    # Dummy ML recommendation based on logic
    # Real implementation would use TF model predicting over data.usage_history
    if not data.room_occupancy and sum(data.usage_history) > 10:
        return {"suggestion": "Turn off devices in empty rooms to save energy.", "predictedSavings": 15.5}
    return {"suggestion": "Energy consumption is optimal.", "predictedSavings": 0.0}

class BillData(BaseModel):
    image: str

@router.post("/scan-bill")
def scan_bill(data: BillData):
    import random
    # Simulate an AI OCR and classification task.
    # In a real environment, we'd pass data.image (base64) to Google Cloud Vision or a Gemini model.
    # We will randomly assign it to Inventory or Maintenance to simulate classification.
    type_guess = "maintenance" if random.choice([True, False]) else "inventory"
    
    if type_guess == "maintenance":
        return {
            "type": "maintenance",
            "data": {
                "deviceName": "HVAC Filter",
                "taskDescription": "Quarterly HVAC filter replacement and inspection",
                "cost": 85.00
            }
        }
    else:
        return {
            "type": "inventory",
            "data": {
                "itemName": "Bulk Paper Towels",
                "quantity": 12,
                "cost": 24.99
            }
        }
