import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

const SEND_TRANSACTION_MUTATION = gql`
  mutation SendTransaction($fromAccountId: ID!, $toAccountId: ID!, $amount: Float!) {
    sendTransaction(fromAccountId: $fromAccountId, toAccountId: $toAccountId, amount: $amount) {
      id
      amount
      fromAccount {
        id
        name
      }
      toAccount {
        id
        name
      }
    }
  }
`;

export default function SendTransaction() {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [sendTransaction, { loading, error }] = useMutation(SEND_TRANSACTION_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await sendTransaction({
        variables: {
          fromAccountId,
          toAccountId,
          amount: parseFloat(amount)
        }
      });
      console.log('Transação enviada:', data);
      navigate('/accounts');
    } catch (err) {
      console.error('Erro ao enviar transação:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Enviar Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccountId">ID da Conta de Origem</Label>
              <Input
                id="fromAccountId"
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAccountId">ID da Conta de Destino</Label>
              <Input
                id="toAccountId"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
          {error && <p className="mt-4 text-red-500 text-center">{error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
