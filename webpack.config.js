const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    proxy: {
      "/**": {
        //catch all requests
        target: "/index.html", //default target
        secure: false,
        bypass: function (req, res, opt) {
          //your custom code to check for any exceptions
          //console.log('bypass check', {req: req, res:res, opt: opt});
          if (
            req.path.indexOf("/img/") !== -1 ||
            req.path.indexOf("/public/") !== -1
          ) {
            return "/";
          }

          if (req.path.indexOf("/build.css") !== -1) {
            return "/build.css";
          }

          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          } else return;
        },
      },
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
};
