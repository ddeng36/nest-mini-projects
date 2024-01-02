const { exec, ChildProcess } = require("child_process");
const child_process = exec("tail -f ./log");

child_process.stdout.on("data", (data) => {
  console.log(data);
});
