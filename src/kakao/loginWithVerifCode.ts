import kakao from "../storages/kakao";
import storage from "../storages/static";

const loginWithVerifCode = async (code: string) => {
  await kakao.Auth.registerDevice(code, storage.email, storage.pw, true, true);
};

export default loginWithVerifCode;
