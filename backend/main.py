from fastapi import FastAPI, UploadFile, File
import numpy as np
from PIL import Image
import io
import uuid
import base64
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

    rank = int(len(red_S))

    num_frames = min(rank, 100)
    k_targets = set(int(k) for k in np.round(np.geomspace(1, rank, num_frames)).astype(int))

    cumR = np.zeros((height, width))
    cumG = np.zeros((height, width))
    cumB = np.zeros((height, width))
    frames = []
    for i in range(rank):
        cumR += np.outer(red_U[:, i],   red_Vt[i, :])   * red_S[i]
        cumG += np.outer(green_U[:, i], green_Vt[i, :]) * green_S[i]
        cumB += np.outer(blue_U[:, i],  blue_Vt[i, :])  * blue_S[i]
        if (i + 1) in k_targets:
            arr = np.stack([
                np.clip(cumR, 0, 255).astype(np.uint8),
                np.clip(cumG, 0, 255).astype(np.uint8),
                np.clip(cumB, 0, 255).astype(np.uint8),
            ], axis=2)
            buf = io.BytesIO()
            Image.fromarray(arr).save(buf, format="JPEG", quality=85)
            frames.append({
                "k": i + 1,
                "data": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode(),
            })

    session_id = str(uuid.uuid4())
    cache[session_id] = {
        "shape": (height, width),
        "red":   (red_U,   red_S,   red_Vt),
        "green": (green_U, green_S, green_Vt),
        "blue":  (blue_U,  blue_S,  blue_Vt),
    }

    return {
        "session_id": session_id,
        "rank": rank,
        "width": width,
        "height": height,
        "frames": frames,
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