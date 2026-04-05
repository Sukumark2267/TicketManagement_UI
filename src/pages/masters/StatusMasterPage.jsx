import MasterCrudPage from '../../components/MasterCrudPage';
import { api } from '../../services/api';

const StatusMasterPage = () => (
  <MasterCrudPage
    title="Status Master"
    subtitle="Manage workflow statuses with full CRUD."
    service={api.statuses}
    entityName="Status"
  />
);

export default StatusMasterPage;
