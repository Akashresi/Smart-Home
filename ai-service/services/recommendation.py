def suggest_tasks(usage_data):
    # Dummy logic. Replace with TF model inference.
    if len(usage_data) > 3:
        return ["Clean up room", "Restock frequently used items"]
    return ["General maintenance"]

def predict_low_inventory(usage_data):
    # Dummy logic. Replace with TF model inference.
    return ["Milk", "Soap"]

def provide_expense_insights(expenses_data):
    # Dummy AI logic for expense analysis
    total = sum(item.get('amount', 0) for item in expenses_data)
    if total > 500:
        return ["High spending detected! Consider reducing discretionary purchases."]
    return ["Spending is within normal limits. Great job!"]
