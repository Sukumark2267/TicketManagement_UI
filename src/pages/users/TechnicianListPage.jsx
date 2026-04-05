import UserListPage from '../../components/UserListPage';
import { api } from '../../services/api';

const TechnicianListPage = () => (
  <UserListPage
    title="Technician List"
    subtitle="Review and manage technician accounts."
    createTo="/users/technicians/create"
    createLabel="Create Technician"
    loadUsers={api.users.technicians}
    toggleStatus={(user) => user.isActive ? api.users.deactivate(user.id) : api.users.activate(user.id)}
  />
);

export default TechnicianListPage;
