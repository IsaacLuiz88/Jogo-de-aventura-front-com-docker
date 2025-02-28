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

# Expõe a porta padrão do React
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]