import MasterCrudPage from '../../components/MasterCrudPage';
import { api } from '../../services/api';

const ServiceTypeMasterPage = () => (
  <MasterCrudPage
    title="Service Type Master"
    subtitle="Manage the paid and free service options available during ticket creation."
    service={api.serviceTypes}
    entityName="Service Type"
  />
);

export default ServiceTypeMasterPage;
