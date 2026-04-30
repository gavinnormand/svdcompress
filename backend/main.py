from fastapi import FastAPI, UploadFile, File
import numpy as np
from PIL import Image
import io
import base64
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://svdcompress.vercel.app", "https://compress.gavinnormand.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/svd")
async def svd(image: UploadFile = File(...)):
    contents = await image.read()
    img = Image.open(io.BytesIO(contents))

    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    else:
        img = img.convert("RGB")

    pixels = np.array(img)
    height, width = pixels.shape[:2]

    R = pixels[:, :, 0].astype(np.float64)
    G = pixels[:, :, 1].astype(np.float64)
    B = pixels[:, :, 2].astype(np.float64)

    red_U,   red_S,   red_Vt   = np.linalg.svd(R, full_matrices=False)
    green_U, green_S, green_Vt = np.linalg.svd(G, full_matrices=False)
    blue_U,  blue_S,  blue_Vt  = np.linalg.svd(B, full_matrices=False)

    rank = int(len(red_S))
    num_frames = min(rank, 50)
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
            Image.fromarray(arr).save(buf, format="JPEG", quality=100)
            frames.append({
                "k": i + 1,
                "data": "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode(),
            })

    preview_buf = io.BytesIO()
    img.save(preview_buf, format="JPEG", quality=100)
    preview = "data:image/jpeg;base64," + base64.b64encode(preview_buf.getvalue()).decode()

    return {
        "preview": preview,
        "rank": rank,
        "width": width,
        "height": height,
        "frames": frames,
    }
