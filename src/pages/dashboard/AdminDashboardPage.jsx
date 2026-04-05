import DashboardPageTemplate from './DashboardPageTemplate';

const AdminDashboardPage = () => (
  <DashboardPageTemplate
    title="Admin Dashboard"
    subtitle="Oversee tickets, customers, technicians, projects, and master data from one clean control center."
    actions={[
      { label: 'View Customers', to: '/users/customers', variant: 'contained' },
      { label: 'View Technicians', to: '/users/technicians', variant: 'outlined' },
      { label: 'Projects Dashboard', to: '/projects', variant: 'outlined' },
      { label: 'Create Ticket', to: '/tickets/on-behalf', variant: 'outlined' }
    ]}
    quickActionsTitle="Quick Create"
    quickActions={[
      { label: 'Create Customer', to: '/users/customers/create', description: 'Register a new customer profile.' },
      { label: 'Create Technician', to: '/users/technicians/create', description: 'Add a new support technician.' },
      { label: 'Create Project', to: '/projects/create', description: 'Add a new customer site and project.' }
    ]}
  />
);

export default AdminDashboardPage;
