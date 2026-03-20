from fastapi import APIRouter
from pydantic import BaseModel
from services.recommendation import suggest_tasks, predict_low_inventory

router = APIRouter()

class UsageData(BaseModel):
    items: list

@router.post("/suggest-tasks")
def suggest(data: UsageData):
    tasks = suggest_tasks(data.items)
    return {"suggested_tasks": tasks}

@router.post("/predict-inventory")
def predict_inventory(data: UsageData):
    predictions = predict_low_inventory(data.items)
    return {"low_inventory_predictions": predictions}

class ExpenseData(BaseModel):
    expenses: list

@router.post("/expense-insights")
def analyze_expenses(data: ExpenseData):
    from services.recommendation import provide_expense_insights
    insights = provide_expense_insights(data.expenses)
    return {"insights": insights}
