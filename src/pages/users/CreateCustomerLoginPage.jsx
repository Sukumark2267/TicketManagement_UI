import { useParams } from 'react-router-dom';
import UserFormPage from '../../components/UserFormPage';
import { api } from '../../services/api';

const CreateCustomerLoginPage = () => {
  const { customerId } = useParams();

  return (
    <UserFormPage
      title="Create Customer Login"
      subtitle="Add another login user under this customer."
      cancelTo={`/users/customers/${customerId}`}
      submitLabel="Create Customer Login"
      showUsername={false}
      mapPayload={(form) => ({
        ...form,
        username: form.email,
        customerId: Number(customerId)
      })}
      onSubmit={api.users.createCustomer}
    />
  );
};

export default CreateCustomerLoginPage;
