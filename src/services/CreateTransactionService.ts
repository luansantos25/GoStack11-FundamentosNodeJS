import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  private balance: Balance;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
    this.balance = this.transactionsRepository.getBalance();
  }

  public execute({ title, type, value }: Request): Transaction {
    if (!['income', 'outcome'].includes(type))
      throw Error('Invalid Transaction');

    const isValidTransaction = this.balance.total >= value || type === 'income';

    if (!isValidTransaction) {
      throw Error('Yout do not have enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
