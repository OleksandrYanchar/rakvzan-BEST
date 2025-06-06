import io
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
import uvicorn
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from costs.ml_models import predict_losses, train_model
from costs.models import LossRequest, LossResponse
from esteblishments import create_accessibility_model

FEATURE_NAMES = [
    "ramp", "parking", "bathroom", "elevator", "tactical_floor",
    "signage", "braille", "audio", "guide", "sign_language", "veterans_discounts"
]

app = FastAPI(
    docs_url="/docs",
)
esteblishments_model = create_accessibility_model()

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):

    image_bytes = await image.read()
    
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    except Exception:
        return {"error": "Invalid image format. Please upload a valid image file."}
    
    img = img.resize((224, 224))
    img_array = np.array(img)
    
    img_batch = np.expand_dims(img_array, axis=0)
    img_batch = preprocess_input(img_batch)
    
    predictions = esteblishments_model.predict(img_batch)[0]
    
    prediction_results = {
        feature: bool(prediction >= 0.5)
        for feature, prediction in zip(FEATURE_NAMES, predictions)
    }
    
    return {"predictions": prediction_results, "raw": predictions.tolist()}


@app.post("/estimate", response_model=LossResponse)
def estimate(loss_req: LossRequest):
    direct, indirect = predict_losses(loss_req.establishment)
    active_flag = loss_req.establishment.status.lower() == 'active'
    return LossResponse(
        direct_loss_est=direct,
        indirect_loss_est=indirect,
        active=active_flag
    )

if __name__ == "__main__":
    # Тренуємо модель перед запуском сервера
    train_model()
    # Запускаємо FastAPI через Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=False)
