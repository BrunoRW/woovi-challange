const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('@koa/cors');

const resolvers = require('./resolvers');

const app = new Koa();

// Use bodyParser antes de outras middlewares
app.use(bodyParser());

// Adicione este middleware para logar todas as requisições
app.use(async (ctx, next) => {
  console.log('Requisição recebida:', ctx.method, ctx.url);
  console.log('Corpo da requisição:', ctx.request.body);
  await next();
});

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Conectar ao MongoDB Atlas
mongoose.connect('mongodb+srv://bankWoovi:bankWooviPass@cluster0.n6ygy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Ler o schema GraphQL
const typeDefs = fs.readFileSync(path.join(__dirname, 'schemas', 'schema.graphql'), 'utf8');

// Criar o schema executável
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Criar o servidor Apollo
const server = new ApolloServer({
  schema,
  context: ({ ctx }) => ctx,
  formatError: (error) => {
    console.error('Erro GraphQL:', error);
    return error;
  },
});

// Aplicar o middleware do Apollo Server ao Koa
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql', cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
});