import { Role } from "discord.js";
import { Chat, ChatUser, FriendStruct, Long, UserInfo } from "node-kakao";
import DB from "../db";
import { discord } from "../discord";
import { kakao } from "../kakao";
import config from "../storages/config";
import { Bridge, getMainGuild } from "./channelMapper";

const isChatUser = (user: any): user is UserInfo => {
    return user.Id instanceof Long
}

const getKakaoUserInfo = (user: UserInfo | FriendStruct) => {
    if(isChatUser(user)) {
        return {
            name: user.Nickname,
            id: user.Id
        }
    }
    return {
        name: user.friendNickName || user.nickName,
        id: user.userId
    }
}

export default {
    async d2k(discordRole: Role): Promise<FriendStruct> {
        const exist = await DB.findOne<Bridge>({
            discordid: discordRole.id
        })
        if (exist) {
            return (await kakao.Service.findFriendById(Long.fromString(exist.kakaoid))).friend
        }
        throw new Error(`Cannot find user from discord : ${discordRole.name}(${discordRole.id})`)
    },
    async k2d(kakaoUser: UserInfo | FriendStruct) {
        const userInfo = getKakaoUserInfo(kakaoUser)
        const exist = await DB.findOne<Bridge>({
            kakaoid: userInfo.id.toString()
        })
        if (exist) {
            const discordRole = (await getMainGuild()).roles.cache.get(exist.discordid) || await (await getMainGuild()).roles.fetch(exist.discordid)
            if (discordRole) return discordRole
        }
        try {
            console.log('새 역할을 생성합니다 : ', userInfo.name)
            const createdRole = await (await getMainGuild()).roles.create({
                data: {
                    name: userInfo.name,
                    color: config.USER_ROLE_COLOR
                }
            })
            console.log('Document Inserted,', await DB.insert<Bridge>({
                discordid: createdRole.id,
                kakaoid: userInfo.id.toString()
            }))
            return createdRole
        } catch(e) {
            console.log(e)
        }
    }
}