from fastapi import FastAPI, UploadFile, File
import numpy as np
from PIL import Image
import io
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse


app = FastAPI()

cache: dict = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/svd")
async def svd(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    pixels = np.array(img)
    height, width = pixels.shape[:2]

    R = pixels[:, :, 0]
    G = pixels[:, :, 1]
    B = pixels[:, :, 2]

    red_U, red_S, red_Vt = np.linalg.svd(R, full_matrices=False)
    green_U, green_S, green_Vt = np.linalg.svd(G, full_matrices=False)
    blue_U, blue_S, blue_Vt = np.linalg.svd(B, full_matrices=False)

    session_id = str(uuid.uuid4())
    cache[session_id] = {
        "shape": (height, width),
        "red":   (red_U,   red_S,   red_Vt),
        "green": (green_U, green_S, green_Vt),
        "blue":  (blue_U,  blue_S,  blue_Vt),
    }

    return {
        "session_id": session_id,
        "rank": int(len(red_S)),
        "width": width,
        "height": height,
    }

@app.get("/reconstruct")
async def reconstruct(session_id: str, k: int):
    entry = cache[session_id]
    rows, cols = entry["shape"]

    def recon(U, S, Vh):
        return np.clip(U[:, :k] @ np.diag(S[:k]) @ Vh[:k, :], 0, 255).astype(np.uint8)

    R = recon(*entry["red"])
    G = recon(*entry["green"])
    B = recon(*entry["blue"])

    img = Image.fromarray(np.stack([R, G, B], axis=2))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")