# Project Rule: Automatic Version Increment on Push

## Rule Description
Her güncelleme veya değişiklik GitHub'a pushlanmadan önce:
1. `npm run version:bump` çalıştırılarak veya doğrudan `package.json`, `package-lock.json`, ve `AdminSidebar.tsx` badge güncellenerek sürüm bir kademe artırılmalıdır (örn. `v1.0.1` -> `v1.0.2`).
2. Son güncel durum her zaman `main` branch'inde olmalı ve `origin/main`'e pushlanmalıdır.
3. İsteğe bağlı olarak yeni versiyon için git tag eklenmelidir (`git tag vX.Y.Z`).
