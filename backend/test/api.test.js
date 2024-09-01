const request = require('supertest');
const Koa = require('koa');
const { createHandler } = require('graphql-http/lib/use/koa');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Account = require('../src/models/Account');
const Transaction = require('../src/models/Transaction');
const resolvers = require('../src/resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, '..', 'src', 'schemas', 'schema.graphql'), 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = new Koa();
app.use(createHandler({ schema }));

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://bankWoovi:bankWooviPass@cluster0.n6ygy.mongodb.net/banco_test?retryWrites=true&w=majority&appName=Cluster0');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Account.deleteMany({});
  await Transaction.deleteMany({});
});

test('Criar uma conta', async () => {
  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createAccount(name: "Teste", initialBalance: 1000) {
            id
            name
            balance
          }
        }
      `
    });

  expect(response.status).toBe(200);
  expect(response.body.data.createAccount.name).toBe('Teste');
  expect(response.body.data.createAccount.balance).toBe(1000);
});

test('Enviar uma transação', async () => {
  const account1 = await Account.create({ name: 'Conta 1', balance: 1000 });
  const account2 = await Account.create({ name: 'Conta 2', balance: 500 });

  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          sendTransaction(fromAccountId: "${account1.id}", toAccountId: "${account2.id}", amount: 200) {
            id
            amount
          }
        }
      `
    });

  expect(response.status).toBe(200);
  expect(response.body.data.sendTransaction.amount).toBe(200);

  const updatedAccount1 = await Account.findById(account1.id);
  const updatedAccount2 = await Account.findById(account2.id);

  expect(updatedAccount1.balance).toBe(800);
  expect(updatedAccount2.balance).toBe(700);
});
