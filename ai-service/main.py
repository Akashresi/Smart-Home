from fastapi import FastAPI
from routes import predict

app = FastAPI(title="Smart Home AI Service")

app.include_router(predict.router)

@app.get("/")
def read_root():
    return {"message": "AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
