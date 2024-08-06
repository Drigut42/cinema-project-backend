export default function errorMiddleware(error, req, res, next) {
  res.status(500).json({ servererror: error.message });
  console.error(error.message);
}

export const methodNotAllowed = (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
};
