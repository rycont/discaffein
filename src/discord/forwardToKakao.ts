import axios from "axios";
import { Message, TextChannel } from "discord.js";
import { ChatMention, ChatType, MediaTemplate, MediaTemplates, PhotoAttachment, SizedMediaItemTemplate } from "node-kakao";
import * as channelMapper from "../bridge/channelMapper";
import friendMapper from "../bridge/friendMapper";
import { kakao } from "../kakao";

const getTypeByExtension = (ext: string) => {
    if (["jpg", "jpeg", "gif", "bmp", "png"].includes(ext)) return ChatType.Photo
    if (["mp4", "m4v", "avi", "asf", "wmv", "mkv", "ts", "mpg", "mpeg", "mov", "flv", "ogv"].includes(ext)) return ChatType.Video
    // if (["mp3", "wav", "flac", "tta", "tak", "aac", "wma", "ogg", "m4a"].includes(ext)) return ChatType.Audio
    // IDK IT'S NOT WORKING WHY WHY WHY
    return ChatType.File
}

const forwardToKakao = async (chat: Message) => {
    const kakaoChannel = await channelMapper.d2k(chat.channel as TextChannel)
    if (chat.content) {
        const mentionParsedContent = await Promise.all((JSON.parse('["' + chat.content.replace(/<@&.[0-9]*>/gi, (d) => '",' + JSON.stringify({ id: d}) + ',"') + '"]') as (string | {
            id: string
        })[]).map(async (e, i) => {
            if(typeof e === 'string') return e
            console.log(chat.mentions.roles.array(), i - 1)
            return new ChatMention((
                (kakaoChannel.getUserInfoId((await friendMapper.d2k(chat.mentions.roles.array()[i - 1])).userId))!!
            ))
        }))
        kakaoChannel.sendText(...mentionParsedContent)
    }
    // if (chat.mentions.roles.size)
    // chat.mentions.roles.map(async mention => {
        // console.log(mention.id)
        // kakaoChannel.sendText("")
        // await friendMapper.d2k(mention)
    // })

    chat.attachments.forEach(async (attach) => {
        const ext = attach.url.slice(attach.url.lastIndexOf('.') + 1)
        const attachType = getTypeByExtension(ext);
        const commonProperty = {
            data: Buffer.from((await axios(attach.url, {
                responseType: 'arraybuffer'
            })).data),
            name: attach.name!!,
            type: getTypeByExtension(ext),
            ext,
        };
        if([ChatType.Photo, ChatType.Video].includes(attachType)) {
            if(!attach.height || !attach.width) throw new Error("알 수 없는 파일")
            return await kakaoChannel?.sendMedia({
                ...commonProperty,
                height: attach.height,
                width: attach.width,
            } as MediaTemplate<ChatType.Photo> & SizedMediaItemTemplate)
        }
        return await kakaoChannel?.sendMedia(commonProperty as MediaTemplate<ChatType.File>)
    })
}

export default forwardToKakao