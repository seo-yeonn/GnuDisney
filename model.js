const http = require('https');

const options = {
	method: 'POST',
	hostname: 'toonify.p.rapidapi.com',
	port: null,
	path: '/v0/toonmojihd?proceed_without_face=false&return_aligned=false',
	headers: {
		'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
		'X-RapidAPI-Key': '0ae09b3927msh1247e0115f297dap1ef681jsn68befa161659',
		'X-RapidAPI-Host': 'toonify.p.rapidapi.com'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write('-----011000010111000001101001\r\nContent-Disposition: form-data; name="image"\r\n\r\n\r\n-----011000010111000001101001--\r\n\r\n');
req.end();