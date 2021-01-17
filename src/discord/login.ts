import { getMainGuild } from "../bridge/channelMapper";
import discord from "../storages/discord";
import storage from "../storages/static";
import { chatWithDelay } from "../utils/chat";
import { logMessage } from "../utils/console";
import { clearChannels } from "./manager";

const login = async ({
  clearData
} : {
  clearData?: boolean;
} = {}) => {
  try {
    await discord.login(storage.botToken)
  } catch(e) {
    throw new Error(`Cannot log in to Discord, Discord Says : "${e.message}"`)
  }

  logMessage('디스코드에 로그인했습니다✌')
  if(clearData) {
    logMessage('동기화정보를 초기화중입니다')
    await clearChannels()
    logMessage('초기화를 완료했습니다')
  }
  await (await getMainGuild()).fetch()
  
};

export default login;
