# SVD Compress

An interactive image compression tool powered by Singular Value Decomposition. Upload an image, watch it reconstruct from mathematical components, and drag a slider to explore the quality-versus-size trade-off in real time.

Live at [compress.gavinnormand.com](https://compress.gavinnormand.com)

## How it works

Each color channel of an image is a matrix. SVD factors every matrix into **U Σ Vᵀ**, where the singular values in Σ are sorted by how much they contribute to the image. Keeping only the top *k* components gives the best possible rank-*k* approximation — sharp where it matters, blurry where it doesn't.

The backend computes the decomposition and pre-renders 50 log-spaced frames (k = 1 → full rank). The frontend lets you scrub through them instantly, with a live readout of how many values are stored versus a raw pixel grid.

## Stack

- **Frontend** - React, TypeScript, Vite, Tailwind CSS
- **Backend** - FastAPI, NumPy, Pillow, hosted on AWS
- **API proxy** - Vercel serverless function

## Limitations

SVD is mathematically elegant but not competitive with purpose-built codecs like JPEG for photographs. It works best as a teaching tool — the slider makes the rank-quality relationship immediately intuitive in a way that's hard to convey on paper.

Images over 4 megapixels (roughly 2000×2000) are rejected client-side; the decomposition becomes slow enough to time out at that scale.
