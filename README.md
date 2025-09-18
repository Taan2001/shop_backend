# 🚀 Node Express TypeScript Starter

Dự án mẫu backend sử dụng **Node.js + Express + TypeScript**.
node version 20.19.4

## 🛠️ Công nghệ

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Nodemon](https://nodemon.io/) (hot reload)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (code style)

## 📂 Cấu trúc thư mục

src/
├── controllers/ # Xử lý logic input và output cho services
├── middlewares/ # Middleware custom
├── models/ # Định nghĩa interface / schema (nếu có)
├── routes/ # Định nghĩa route Express
├── services/ # Xử lý logic nghiệp vụ
├── utils/ # Hàm tiện ích
├── index.ts # Express config + Entry point
├── type.d.env # Biến môi trường
├ .env #
├ .gitattributes # git contributes
├ .gitignore # git ignore
├ .prettierignore # ignore folder for prettier
├ .prettierrc.js # config prettier
├ build.js # config esbuild
├ eslint.config.js # config eslint
├ nodemon.json # nodemon config
├ package.json
├ README.md
├ tsconfig.json

## 📦 Cài đặt

```bash
npm install
```

## 🔧 Scripts

### Development (hot reload)

```bash
npm run dev
```

### Check code with Prettier

```bash
npm run prettier:fix
```

### Format code with Prettier

```bash
npm run prettier:fix
```

### Check Eslint

```bash
npm run lint
```

### Format code with Eslint

```bash
npm run lint:fix
```

### Build source with esbuild

```bash
npm run build
```

### Start server (production)

```bash
npm start
```
