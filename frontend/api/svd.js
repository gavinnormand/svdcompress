export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  const upstream = await fetch(`http://aws.gavinnormand.com:8888/svd`, {
    method: "POST",
    headers: {
      "content-type": req.headers["content-type"],
    },
    body,
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
}
