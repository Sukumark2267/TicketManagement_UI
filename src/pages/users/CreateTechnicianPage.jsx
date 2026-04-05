import UserFormPage from '../../components/UserFormPage';
import { api } from '../../services/api';

const CreateTechnicianPage = () => (
  <UserFormPage
    title="Create Technician"
    subtitle="Add a new technician account from a dedicated admin page."
    cancelTo="/users/technicians"
    submitLabel="Create Technician"
    onSubmit={api.users.createTechnician}
  />
);

export default CreateTechnicianPage;
