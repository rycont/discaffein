import { promises as fs } from "fs";
import { AuthStatusCode } from "node-kakao";
import { waitForDiscordChat } from "../discord";
import kakao from "../storages/kakao";
import storage from "../storages/static";
import { logMessage } from "../utils/console";

const waitRandomSecond = () => new Promise((res) => setTimeout(res, Math.random() * 1800 + 1000))

const saveAutologinToken = async () => {
  await fs.writeFile('./auth.json', JSON.stringify([
    kakao.ClientUser.MainUserInfo.EmailAddress,
    kakao.Auth.generateAutoLoginToken()
  ]))
}

const getAutologin = async (): Promise<[string, string] | null> => {
  try {
    return JSON.parse(await fs.readFile('./auth.json', 'utf8'))
  } catch {
    return null
  }
}

const errorMessageTable =  
  ({
    [AuthStatusCode.DEVICE_NOT_REGISTERED]: '등록되지 않은 디바이스입니다.',
    [AuthStatusCode.ACCOUNT_RESTRICTED]: '계정이 정지되었습니다.',
    [AuthStatusCode.LOGIN_FAILED_REASON]: '로그인에 실패했습니다.',
    [AuthStatusCode.LOGIN_FAILED]: '로그인에 실패했습니다.',
    [AuthStatusCode.MOBILE_UNREGISTERED]: '모바일 기기가 등록되지 않은 계정입니다.',
    [AuthStatusCode.ANOTHER_LOGON]: '다른 기기에서 로그인중입니다.',
    [AuthStatusCode.DEVICE_REGISTER_FAILED]: '기기 등록에 실패했습니다.',
    [AuthStatusCode.INVALID_DEVICE_REGISTER]: '기기 등록이 유효하지 않습니다.',
    [AuthStatusCode.INCORRECT_PASSCODE]: '비밀번호가 일치하지 않습니다',
    [AuthStatusCode.PASSCODE_REQUEST_FAILED]: '인증번호 요청에 실패했습니다.',
    [-910]: '인증이 만료되었습니다. 계정을 다시 등록해주세요.'
  })

const chatWithDelay = async (...message: string[]) => {
  await waitRandomSecond()
  await logMessage(message.join(' '))
}

const passcodeLoop = async (email: string, password: string) => {
  await kakao.Auth.requestPasscode(email, password)
  await chatWithDelay('로그인되어있는 디바이스로 인증번호를 보냈어요.')
  await chatWithDelay('4자리 인증번호를 입력해주세요.')
  const { content: passcode } = await waitForDiscordChat()
  try {
    await kakao.Auth.registerDevice(passcode, email, password, true)
    await chatWithDelay('인증이 완료되었어요👌')
  } catch(e) {
    await chatWithDelay('올바르지 않은 인증번호에요😢')
    await passcodeLoop(email, password)
  }
}

const loginLoop = async (isNotFirstAttempt?: boolean) => {
  await chatWithDelay(`${isNotFirstAttempt ? "" : "먼저, 카카오계정에 로그인할 수 있는 "}이메일을 알려주세요.`)
  
  const email = (await waitForDiscordChat()).content
  
  await chatWithDelay(`${isNotFirstAttempt ? "" : "좋은 이메일이에요! 이제 "}비밀번호를 알려주세요.`)
  const password = (await waitForDiscordChat()).content
  await chatWithDelay(`로그인을 시도하고있어요.`)
  
  try {
    await kakao.login(email, password)
    await chatWithDelay(`반가워요 ${kakao.ClientUser.MainUserInfo.Nickname}님🖐 카카오계정에 로그인되었어요.`)
    await saveAutologinToken()
    await chatWithDelay(`로그인 정보가 저장되었습니다`)
  } catch(e) {
    if(e.status === AuthStatusCode.DEVICE_NOT_REGISTERED) await passcodeLoop(email, password)
    if(e.status === AuthStatusCode.LOGIN_FAILED) await chatWithDelay('이메일과 일치하는 계정을 찾을 수 없어요.')
    if(e.status === AuthStatusCode.LOGIN_FAILED_REASON) await chatWithDelay('비밀번호가 일치하지 않아요.')
    else await chatWithDelay('카카오계정 로그인에 실패했어요😢', errorMessageTable[e.status as AuthStatusCode])
    await loginLoop(true)
  }
}

const kakaoOnboard = async () => {
  await chatWithDelay('디스카페인이 처음이시군요! 첫 설정을 도와줄게요🖐')
  console.log('이 메시지를 터미널에서 보고 있다면, 디스코드로 이동하는게 좋을거에요 :)')
  await loginLoop()
}

const authBootstrap = async () => {
  try {
    const autologin = await getAutologin()
    if(!autologin) {
      return await kakaoOnboard()
    }
    await kakao.loginToken(...autologin)
    await chatWithDelay('카카오계정에 로그인했습니다✌')
    saveAutologinToken()
  } catch (e) {
    if([AuthStatusCode.DEVICE_NOT_REGISTERED, -910].includes(e.status)) {
      await chatWithDelay('계정 등록이 만료되었어요.')
      return await loginLoop()
    }
    console.log(e)
    await chatWithDelay('카카오계정 로그인에 실패했습니다.', errorMessageTable[e.status as AuthStatusCode])
  }
};

export default authBootstrap;
