from fastapi import FastAPI, Depends, Header, HTTPException
from routes import predict

app = FastAPI(title="Smart Home AI Service")

async def verify_token(authorization: str = Header(...)):
    if authorization != "Bearer YOUR_AI_KEY":
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return authorization

app.include_router(predict.router, prefix="/api/v1", dependencies=[Depends(verify_token)])

@app.get("/")
def read_root(): return {"message": "AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
