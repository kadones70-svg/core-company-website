# 발행 파이프라인 (Core Auth Hub 경유)

Core Company 블로그 글 발행은 Core Auth Hub의 GitHub API 대리 호출로 수행한다.
(이 파일은 허브 경유 커밋으로 생성됨 — 글 추가와 동일한 경로 검증)

- 리포: kadones70-svg/core-company-website (branch main)
- 글 추가: PUT /repos/.../contents/blog-app/src/content/posts/<slug>.md (허브 경유, 커밋 생성)
- 배포: Cloudflare Pages가 main 커밋을 자동 빌드 (scripts/assemble-site.mjs -> dist)
- 공용: 마케팅 스튜디오(makting-studio)와 Claude Code가 같은 경로 사용