import { app } from "./app.js";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`\n🚀 Crystal Ball Command Centre API is running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Approvals Queue: http://localhost:${PORT}/api/approvals\n`);
});
