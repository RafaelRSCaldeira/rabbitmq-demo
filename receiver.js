let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err1, connection) => {
    if(err1) {
        throw err1;
    }
    
    connection.createChannel((err2, channel) => {
        if(err2) {
            throw err2;
        }
        
        let queue = 'hello';

        channel.assertQueue(queue, {
            durable: false,
        });

        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, (msg) => {
            console.log("[x] Received %s", msg.content.toString());
        }, {
            noAck: true,
        });
    });
})