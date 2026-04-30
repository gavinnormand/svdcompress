function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#c6d3e3] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#304674] text-sm font-bold text-white">
          {n}
        </span>
        <h3 className="font-semibold text-[#304674]">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-[#304674]/80">{children}</div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div className="w-full max-w-200">
      <h2 className="mb-4 text-2xl font-semibold text-[#304674]">How it works</h2>
      <div className="flex flex-col gap-3">
        <Step n={1} title="Images are matrices">
          Each color channel (R, G, B) of an image is a matrix of pixel values. A 600x400 image is
          three 600x400 matrices, one per channel.
        </Step>
        <Step n={2} title="SVD decomposes each matrix">
          Singular Value Decomposition factors every matrix A into{" "}
          <span className="font-mono font-medium">A = U Σ Vᵀ</span>. The diagonal of Σ holds
          singular values{" "}
          <span className="font-mono font-medium">σ₁ ≥ σ₂ ≥ … ≥ 0</span>, sorted by how much each
          contributes to the image.
        </Step>
        <Step n={3} title="Keep only the top k components">
          Truncating to k singular values gives the best rank-k approximation:{" "}
          <span className="font-mono font-medium">Aₖ ≈ Σᵢ₌₁ᵏ σᵢ uᵢ vᵢᵀ</span>. Each component is
          a rank-1 outer product, a single column of U times a single row of Vᵀ, scaled by σᵢ.
        </Step>
        <Step n={4} title="Far less data to store">
          Instead of <span className="font-mono font-medium">H x W</span> pixel values you only
          need <span className="font-mono font-medium">k x (H + 1 + W)</span> values per channel,
          one column of U, one singular value, one row of Vᵀ. For small k this is a fraction of
          the original. Drag the slider to see the trade-off live.
        </Step>
      </div>
      <p className="mt-3 text-xs text-[#304674]/50">
        Note: SVD is mathematically elegant but not as efficient as purpose-built codecs like JPEG
        for photographs. It is most useful as a teaching tool.
      </p>
    </div>
  );
}

export default HowItWorks;
