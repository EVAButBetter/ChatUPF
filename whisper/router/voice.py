import os
import requests
import whisper
from fastapi import APIRouter, UploadFile
from fastapi.responses import JSONResponse
from utils.speech_to_text import speech_to_text

router = APIRouter()
model = whisper.load_model("base")
url = "http://localhost:8002/web"
print("#" * 60)
print("model:{} is loading".format(type(model)))


@router.post("/")
async def upload_voice(file: UploadFile):
    
    fn = file.filename
    save_path = f'./data/'
    os.makedirs(save_path, exist_ok=True)
    save_file = os.path.join(save_path, fn)
    
    f = open(save_file, 'wb')
    data = await file.read()
    f.write(data)
    f.close()
    
    text = speech_to_text(model, save_file)
    print("text from speech: " + text)
    data = {
        'isReceived': True,
        'type': "text",
        'content': text,
    }
    res = requests.post(url=url, json=data)
    # print(res.json())
    return JSONResponse(content=res.json())
