import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
      balance
    }
  }
`;

function Accounts() {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">Erro: {error.message}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Contas</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.accounts.map((account: any) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">ID: {account.id}</p>
              <p className="text-lg font-semibold mt-2">Saldo: R$ {account.balance.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button asChild>
          <Link to="/send-transaction">Enviar Transação</Link>
        </Button>
      </div>
    </div>
  );
}

export default Accounts;
