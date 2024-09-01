import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($name: String!, $initialBalance: Float!) {
    createAccount(name: $name, initialBalance: $initialBalance) {
      id
      name
      balance
    }
  }
`;

export default function CreateAccount() {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const { data } = await createAccount({ 
        variables: { 
          name, 
          initialBalance: parseFloat(initialBalance) 
        },
      });
      if (data && data.createAccount) {
        navigate('/accounts');
      } else {
        setErrorMessage('Erro desconhecido ao criar conta.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao criar conta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Saldo Inicial</Label>
              <Input
                id="initialBalance"
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                required
                step="0.01"
                min="0"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Conta'}
            </Button>
          </form>
          {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
          {error && <p className="mt-4 text-red-500 text-center">{error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
