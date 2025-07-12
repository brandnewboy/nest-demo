# 使用 Node.js 基础镜像
FROM node:20.10.0

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run build

# 暴露端口
EXPOSE 8001

# 启动应用
CMD ["pnpm", "start:prod"]