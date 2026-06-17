FROM node:latest
WORKDIR /app
COPY . .
RUN npm install package.json
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost:3000/health" ]
CMD ["npm","run","web"]