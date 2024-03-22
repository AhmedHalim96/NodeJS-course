const fs = require("fs");

const requestHandler = (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === "/") {
		res.setHeader("Content-Type", "text/html");
		res.write("<html>");
		res.write("<header><title>Enter message</title><header/>");
		res.write(
			"<body><form action='/message' method='POST'><input name='message' /> <button>submit</button> </form></body>"
		);
		res.write("</html>");
		return res.end();
	} else if (url === "/message" && req.method === "POST") {
		const body = [];

		req.on("data", (chunk) => {
			console.log(chunk);
			body.push(chunk);
		});

		return req.on("end", () => {
			const parsed = Buffer.concat(body).toString();
			const message = parsed.split("=").at(1);
			fs.appendFile("message.text", message, (err) => {
				console.log(err);
				// redirect
				res.writeHead(302, { location: "/" });
				return res.end();
			});
		});
	} else {
		res.setHeader("Content-Type", "text/html");
		res.write("<html>");
		res.write("<header><title>My first page</title><header/>");
		res.write("<body><h1>Hello from my nodejs server</h1></body>");
		res.write("</html>");
		return res.end();
	}
};

module.exports = requestHandler;
