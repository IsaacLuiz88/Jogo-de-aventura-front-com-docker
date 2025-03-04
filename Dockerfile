# Usa a imagem do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código para dentro do contêiner
COPY . .

# Constrói a aplicação React
RUN npm run build

# Usa o servidor Nginx para servir a aplicação
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80

# Expõe a porta padrão do React
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["nginx", "-g", "daemon off;"]