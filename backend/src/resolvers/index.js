const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

const resolvers = {
  Query: {
    accounts: async () => {
      const accounts = await Account.find();
      return accounts.map(account => ({
        ...account.toObject(),
        id: account._id.toString()
      }));
    },
    account: async (_, { id }) => {
      const account = await Account.findById(id);
      return account ? {
        ...account.toObject(),
        id: account._id.toString()
      } : null;
    },
  },
  Mutation: {
    createAccount: async (_, { name, initialBalance }) => {
      console.log('Resolver createAccount chamado:', { name, initialBalance });
      const newAccount = new Account({ name, balance: initialBalance });
      await newAccount.save();
      return {
        ...newAccount.toObject(),
        id: newAccount._id.toString()
      };
    },
    sendTransaction: async (_, { fromAccountId, toAccountId, amount }) => {
      console.log('Resolver sendTransaction chamado:', { fromAccountId, toAccountId, amount });
      const fromAccount = await Account.findById(fromAccountId);
      const toAccount = await Account.findById(toAccountId);
      
      if (!fromAccount || !toAccount) {
        throw new Error('Uma ou ambas as contas não foram encontradas');
      }
      
      if (fromAccount.balance < amount) {
        throw new Error('Saldo insuficiente');
      }
      
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      
      await fromAccount.save();
      await toAccount.save();
      
      const transaction = new Transaction({
        fromAccount: fromAccount._id,
        toAccount: toAccount._id,
        amount
      });
      await transaction.save();
      
      return {
        ...transaction.toObject(),
        id: transaction._id.toString(),
        fromAccount: {
          ...fromAccount.toObject(),
          id: fromAccount._id.toString()
        },
        toAccount: {
          ...toAccount.toObject(),
          id: toAccount._id.toString()
        }
      };
    },
  },
  Account: {
    id: (parent) => parent.id || parent._id.toString()
  },
  Transaction: {
    id: (parent) => parent.id || parent._id.toString(),
    fromAccount: async (parent) => {
      const account = await Account.findById(parent.fromAccount);
      return {
        ...account.toObject(),
        id: account._id.toString()
      };
    },
    toAccount: async (parent) => {
      const account = await Account.findById(parent.toAccount);
      return {
        ...account.toObject(),
        id: account._id.toString()
      };
    }
  }
};

module.exports = resolvers;