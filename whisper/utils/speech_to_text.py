def speech_to_text(model, file):
    result = model.transcribe(file)
    return result["text"]

