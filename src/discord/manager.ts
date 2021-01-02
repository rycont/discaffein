import { Message, MessageEmbed, TextChannel } from "discord.js"

let operationChannel: TextChannel

export const setOperationChannel = (_channel: TextChannel) => operationChannel = _channel
export const getOperationChannel = () => operationChannel

export const sendNotice = async (message: string) => {
    getOperationChannel().send(new MessageEmbed({
        description: message,
        footer: {
            text: "DisCaffein"
        }
    }))
}

// const createNewChatChannel = () => {

// }

const manager = (message: Message) => {
    // if(message.content.
    // console.log()
}

export default manager