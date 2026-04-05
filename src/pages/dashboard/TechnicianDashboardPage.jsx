import DashboardPageTemplate from './DashboardPageTemplate';

const TechnicianDashboardPage = () => (
  <DashboardPageTemplate
    title="Technician Dashboard"
    subtitle="Track assigned work, create customer tickets, and move project support forward."
    actions={[
      { label: 'Projects Dashboard', to: '/projects', variant: 'contained' },
      { label: 'Create Ticket', to: '/tickets/on-behalf', variant: 'outlined' }
    ]}
    quickActionsTitle="Quick Access"
    quickActions={[
      { label: 'Ticket List', to: '/tickets', description: 'Review all tickets you can access.' },
      { label: 'My Assigned Tickets', to: '/tickets/assigned', description: 'Focus on work assigned to you.' },
      { label: 'My Created Tickets', to: '/tickets/my', description: 'Track tickets you have raised.' }
    ]}
  />
);

export default TechnicianDashboardPage;
