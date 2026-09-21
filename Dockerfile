FROM node:24-slim
WORKDIR /app
COPY . .
RUN mkdir -p /app/data
ENV PORT=8787
ENV DB_PATH=/app/data/openretention.sqlite
EXPOSE 8787
CMD ["sh", "-c", "node src/seed.js >/dev/null 2>&1 || true; node src/server.js"]
