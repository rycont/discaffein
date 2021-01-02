import { Message, MessageEmbed, TextChannel } from "discord.js"
import { ensureChannel, getMainGuild } from "../bridge/channelFinder"

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

const locoLogin = () => {

}