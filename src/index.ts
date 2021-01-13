import dotenv from "dotenv";
import { promises as fs } from "fs";
import yargs from "yargs"
dotenv.config();

import { listenInit } from "./bridge/init";
import discordLogin from "./discord/login";
import { clearChannelsAndRoles } from "./discord/manager";
import kakaoLogin, { initKakaoService } from "./kakao/login";

const {
    clearData
} = yargs(process.argv).argv as unknown as {
    clearData: boolean
};

(async () => {
    await discordLogin({
        clearData
    })
    await kakaoLogin(clearData)
    if(clearData) {
        try {
            await fs.unlink('./bridgemap.db')
            await clearChannelsAndRoles()
            await initKakaoService()
        } catch(e) {
            console.error("연결DB 파일을 제거할 수 없었습니다.")
        }
    }
})()

listenInit()
