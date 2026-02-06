# Me宝守护 (Guardian) 开发仓库

该仓库是从主项目 `logos-mvp` 中独立出来的 Guardian 端模块。

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   复制 `.env.example` 并改名为 `.env`，填入你的 SDK Key 和后端地址。
   ```bash
   VITE_BACKEND_URL=你的后端地址
   VITE_API_KEY=你的SDK_KEY
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 开发注意事项

- **核心代码**: 主要逻辑在 `src/components/Guardian/index.tsx`。
- **样式**: 编辑 `src/components/Guardian/styles.css`。
- **后端连接**: 项目已保留 Socket.io 和 Fetch 依赖，用于与主后端通信。

## 同步与合并 (备忘)

如果你在本项目中做了大的改进，想合回主仓库，请通知主管理员。建议保持 `src/components/Guardian` 的目录结构，以便主仓库直接覆盖或使用 `git subtree` 拉取。
