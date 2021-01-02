import { Message, TextChannel } from "discord.js";
import { ChatType, MediaTemplate, PhotoAttachment } from "node-kakao";
import { kakao } from "../kakao";

const forwardToKakao = (chat: Message) => {
    const kakaoChannel = (kakao.ChannelManager.getChannelList().find((channel) => 
        channel.getDisplayName() === (chat.channel as TextChannel).name
    ))
    if(chat.content) kakaoChannel?.sendText(chat.content)
    // console.log(axios)
    // chat.attachments.forEach((attach) => {
    //     kakaoChannel?.sendMedia({
            
    //     } as MediaTemplate<ChatType.Photo>)
    // })
}

export default forwardToKakao