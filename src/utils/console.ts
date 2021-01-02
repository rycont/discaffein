import { sendNotice } from "../discord/manager"

export const logMessage = async (...message: (string | number)[]) => {
    await sendNotice(message.join(' '))
    console.log(message)
}