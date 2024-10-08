const { exec } = require("child_process");

const command = `npx concurrently \
  -n "APP_ONE,APP_TWO" \
  -c "bgBlue.bold,bgMagenta.bold" \
  "cd app_one && pnpm dev" \
  "cd app_two && pnpm dev"`;

const process = exec(command);

process.stdout.on("data", (data) => {
  console.log(data);
});

process.stderr.on("data", (data) => {
  console.error(data);
});

process.on("close", (code) => {
  console.log(`Process exited with code: ${code}`);
});
