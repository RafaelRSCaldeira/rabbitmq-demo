let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err1, connection) => {
	if (err1) {
		throw err1;
	}

	connection.createChannel((err2, channel) => {
		if (err2) {
			throw err2;
		}

		let queue = 'task_queue';

		// This makes sure the queue is declared before attempting to consume from it
		channel.assertQueue(queue, {
			durable: true,
		});

		channel.consume(
			queue,
			function (msg) {
				var secs = msg.content.toString().split('.').length - 1;
				console.log(secs);

				console.log(' [x] Received %s', msg.content.toString());
				setTimeout(function () {
					console.log(' [x] Done');
				}, secs * 1000);
			},
			{
				// automatic acknowledgment mode,
				// see /docs/confirms for details
				noAck: true,
			}
		);
	});
});
