import DashboardPageTemplate from './DashboardPageTemplate';

const CustomerDashboardPage = () => (
  <DashboardPageTemplate
    title="Customer Dashboard"
    subtitle="Create your own tickets, track ticket progress, and review your support history."
    actions={[
      { label: 'Create Ticket', to: '/tickets/create', variant: 'contained' },
      { label: 'My Tickets', to: '/tickets/my', variant: 'outlined' }
    ]}
  />
);

export default CustomerDashboardPage;
