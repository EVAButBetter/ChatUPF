import os
import uvicorn
import sys,os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append("../")
from router import voice




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    voice.router,
    prefix="/voice",
    tags=["voice"],
    responses={404: {"description": "Not found"}},
)

if __name__ == "__main__":
    port = 8001
    host = "127.0.0.1"
    print("#### STARTING EVA... BUT BETTER! ####\n")
    print("listening on {}:{}".format(host,port))
    uvicorn.run(app, host=host, port=port)



