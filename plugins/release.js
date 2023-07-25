const upload = (source, target, serverInfo) => {
  const { Client } = require("ssh2");
  const { execSync } = require("node:child_process");

  const conn = new Client();
  conn
    .on("ready", () => {
      conn.shell((err, stream) => {
        if (err) {
          console.log(err);
          throw err;
        }
        stream
          .on("close", () => {
            conn.end();
            const result = execSync(
              `scp -r ${source} ${serverInfo.username}@${serverInfo.host}:${target}`,
            );

            if (!result.toString()) {
              console.log("发布成功！！！");
            }
          })
          .on("data", (data) => {
            console.log("RELEASE-OUTPUT: " + data);
          });
        stream.end(`rm -rf ${target}/* \n rmdir ${target} \nexit\n`);
      });
    })
    .connect({
      host: serverInfo.host,
      port: serverInfo.port,
      username: serverInfo.username,
      password: serverInfo.password,
    });
};

module.exports = class Release {
  constructor(source, to, serverInfo) {
    this.source = source;
    this.to = to;
    this.serverInfo = serverInfo;
  }
  apply(compiler) {
    const { options, hooks } = compiler;

    if (options.mode === "production") {
      hooks.done.tap("upload", (state) => {
        upload(this.source, this.to, this.serverInfo);
      });
      //
    }
  }
};
