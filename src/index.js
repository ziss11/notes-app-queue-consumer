require('dotenv').config()

const amqp = require('amqplib')
const NotesService = require('./NotesService')
const MailSender = require('./MailSender')
const Listener = require('./listener')

const init = async () => {
  const notesService = new NotesService()
  const mailSender = new MailSender()
  const listener = new Listener(notesService, mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  const queue = 'export:notes'

  await channel.assertQueue(queue, { durable: true })
  channel.consume(queue, listener.listen, { noAck: true })
}

init()
