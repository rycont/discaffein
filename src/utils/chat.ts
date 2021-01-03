import { MessageEmbed } from "discord.js"
import { getOperationChannel } from "../discord/manager"
import { logMessage } from "./console"

const waitRandomSecond = () => new Promise((res) => setTimeout(res, Math.random() * 500 + 500))

export const chatWithDelay = async (...message: string[]) => {
  await waitRandomSecond()
  await logMessage(message.join(' '))
}

export const sendEmbed = async (delay?: boolean, ...messages: MessageEmbed[]) => {
  delay && await waitRandomSecond()
  messages.forEach(message => getOperationChannel().send(message))
}