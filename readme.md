# DisCaffein
디스코드로 카페인을 섭취 :) 노드카카오를 백엔드로 하는 디스코드 봇입니다.

**본 프로젝트는 카카오톡, 디스코드와의 협의 없이 독자적으로 개발되었으며, 본 프로그램을 사용함으로써 얻는 불이익은 사용자의 책임입니다.**

# How to use
nodejs, npm이 사전에 설치되어있어야 합니다.

1. 새 서버를 하나 생성하고, 봇을 그 서버에 초대해주세요. 봇은 하나의 서버에만 소속되어있어야 합니다. (권장권한 52240)
초대 방법 : https://discord.com/oauth2/authorize?scope=bot&permissions=권한&client_id=CLIENT_ID
2. 이 저장소를 클론하고, npm 의존성을 설치해주세요
```bash
git clone https://github.com/rycont/discaffein
cd discaffein
npm i
# or `yarn`
```
3. 아래의 정보로 `.env` 파일을 생성해주세요.
```
uuid=discaffein
name=DisCaffein
botToken=디스코드 봇 토큰
```
4. 서버를 실행해주세요.
```
npm run run
# or `yarn run run`
```
4. 디스코드에 안내되는 내용대로, 카카오계정에 로그인해주세요.

# Credit
Made by [RyCont](https://github.com/rycont)