# HOW_TO_UPLOAD_TO_GITHUB

이 문서는 GitHub에 처음 업로드하는 순서를 초보자 기준으로 설명합니다.

## 1. GitHub에서 새 저장소 만들기

GitHub에서 새 repository를 하나 만듭니다.

예시 이름:

- `memory-group-app`

## 2. 이 프로젝트에서 중요한 파일

처음 업로드할 때 핵심은 아래입니다.

- `app/`
- `src/`
- `assets/`
- `package.json`
- `package-lock.json`
- `app.json`
- `tsconfig.json`
- `.gitignore`
- 문서 파일들

올리면 안 되는 것:

- `node_modules/`
- `.expo/`
- `dist/`

## 3. 기본 업로드 명령

아직 Git 저장소가 아니라면:

```bash
git init
git add .
git commit -m "Initial project setup"
```

## 4. GitHub 저장소 연결

GitHub에서 만든 저장소 주소를 연결합니다.

```bash
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git branch -M main
git push -u origin main
```

## 5. 자주 하는 실수

- `node_modules`를 올리려고 하는 경우
- `.expo`를 올리는 경우
- GitHub 저장소 주소를 잘못 넣는 경우

## 6. 초보자용 체크리스트

- `.gitignore`가 있는가
- `README.md`가 있는가
- 폴더 구조가 너무 복잡하지 않은가
- mock 데이터와 실제 연결 위치가 문서에 설명되어 있는가

## 7. 추천 커밋 순서

처음에는 아래처럼 짧게 나누면 보기 좋습니다.

1. `Initial project setup`
2. `Add app screens and mock data`
3. `Add project documentation`
