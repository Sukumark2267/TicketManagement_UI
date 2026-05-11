import MasterCrudPage from '../../components/MasterCrudPage';
import { api } from '../../services/api';

const ActivityTypeMasterPage = () => (
  <MasterCrudPage
    title="Activity Master"
    subtitle="Manage ticket activity options with full CRUD."
    service={api.activityTypes}
    entityName="Activity"
  />
);

export default ActivityTypeMasterPage;
