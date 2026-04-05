import MasterCrudPage from '../../components/MasterCrudPage';
import { api } from '../../services/api';

const CategoryMasterPage = () => (
  <MasterCrudPage
    title="Category Master"
    subtitle="Manage ticket categories with full CRUD."
    service={api.categories}
    entityName="Category"
  />
);

export default CategoryMasterPage;
