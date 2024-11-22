export default function handler(req, res) {
  const embedCode = `
    <iframe
      src="https://bsky-users.theo.io/embed"
      width="300"
      height="200"
      frameborder="0"
      allowfullscreen
    ></iframe>
  `;

  res.status(200).json({ embedCode });
}
