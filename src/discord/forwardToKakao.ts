import axios from "axios";
import { Message, TextChannel } from "discord.js";
import { ChatType, MediaTemplate, PhotoAttachment } from "node-kakao";
import { kakao } from "../kakao";

const forwardToKakao = (chat: Message) => {
    const kakaoChannel = (kakao.ChannelManager.getChannelList().find((channel) => 
        channel.getDisplayName() === (chat.channel as TextChannel).name
    ))
    if(chat.content) kakaoChannel?.sendText(chat.content)
    
    chat.attachments.forEach(async (attach) => {
        await kakaoChannel?.sendMedia({
            data: Buffer.from((await axios(attach.url, {
                responseType: 'arraybuffer'
            })).data),
            name: attach.name!!,
            type: ChatType.Photo,
            ext: attach.url.slice(attach.url.lastIndexOf('.') + 1),
            width: attach.width!!,
            height: attach.height!!
        })
    })
}

export default forwardToKakao