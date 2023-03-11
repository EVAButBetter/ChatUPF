import os
import whisper
from fastapi import APIRouter, UploadFile
from utils.speech_to_text import speech_to_text

router = APIRouter()
model = whisper.load_model("base")
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

@router.get("/")
async def test():
    print("test")