import MasterCrudPage from '../../components/MasterCrudPage';
import { api } from '../../services/api';

const PriorityMasterPage = () => (
  <MasterCrudPage
    title="Priority Master"
    subtitle="Manage ticket priorities with full CRUD."
    service={api.priorities}
    entityName="Priority"
  />
);

export default PriorityMasterPage;
