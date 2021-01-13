import { Chat, ChatType } from "node-kakao";
import { KakaoAPI } from 'node-kakao/dist/kakao-api'
import { MessageEmbed } from "discord.js";
import * as channel from "../bridge/channelMapper";
import deepmerge from "deepmerge";

const forwardToDiscord = async (kakaoChat: Chat) => {
    const kakaoSender = kakaoChat.Channel.getUserInfo(kakaoChat.Sender)!!
    const discordChannel = await channel.k2d(kakaoChat.Channel)

    if(kakaoChat.RawAttachment?.url && !kakaoChat.RawAttachment.thumbnailUrl) {
        discordChannel.send({
            files: [kakaoChat.RawAttachment.url]
        })
    }
    
    const attaches = kakaoChat.AttachmentList.reduce((acc, attach) => {
        const readableAttach = attach.toJsonAttachment()
        if (attach.RequiredMessageType === ChatType.Sticker) {
            return deepmerge(acc, {
                files: [KakaoAPI.getEmoticonImageURL(readableAttach.path)]
            })
        }
        if (attach.RequiredMessageType === ChatType.Photo) {
            return deepmerge(acc, {
                files: [readableAttach.url]
            })
        }
        if(attach.RequiredMessageType === ChatType.Reply) {
            const replyOriginSender = kakaoChat.Channel.getUserInfoId(readableAttach.src_userId)?.Nickname
            return deepmerge(acc, {
                footer: {
                    iconURL: "https://firebasestorage.googleapis.com/v0/b/rycont-shared.appspot.com/o/reply.png?alt=media",
                    text: `${replyOriginSender} : ${readableAttach.src_message}`,
                }
            })
        }
        return acc
    }, {})

    discordChannel.send(new MessageEmbed({
        author: {
            name: kakaoSender.Nickname,
            iconURL: kakaoSender.FullProfileImageURL
        },
        description: kakaoChat.Text,
        ...attaches
    }))
}

export default forwardToDiscord