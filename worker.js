const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err1, connection) => {
	if (err1) {
		throw err1;
	}

	connection.createChannel((err2, channel) => {
		if (err2) {
			throw err2;
		}

		const queue = 'task_queue';

		// This makes sure the queue is declared before attempting to consume from it
		channel.assertQueue(queue, {
			durable: true,
		});

		channel.prefetch(1);

		channel.consume(
			queue,
			function (msg) {
				var secs = msg.content.toString().split('.').length - 1;
				console.log(secs);

				console.log(' [x] Received %s', msg.content.toString());
				setTimeout(function () {
					console.log(' [x] Done');
					channel.ack(msg);
				}, secs * 1000);
			},
			{
				noAck: false,
			}
		);
	});
});
