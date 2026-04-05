import { useEffect, useState } from 'react';
import { Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

import DashboardPanel from '../../components/DashboardPanel';
import PageLoader from '../../components/PageLoader';
import { api } from '../../services/api';

const DashboardPageTemplate = ({ title, subtitle, actions, quickActions, quickActionsTitle }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [summary, byStatus, byPriority, byCategory, monthlyTrend] = await Promise.all([
          api.dashboard.summary(),
          api.dashboard.byStatus(),
          api.dashboard.byPriority(),
          api.dashboard.byCategory(),
          api.dashboard.monthlyTrend()
        ]);

        setData({ summary, byStatus, byPriority, byCategory, monthlyTrend });
      } catch (loadError) {
        setError(loadError.response?.data?.detail ?? 'Unable to load dashboard data.');
      }
    };

    void load();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data) {
    return <PageLoader />;
  }

  const mappedActions = actions?.map((action) => ({ ...action, component: Link })) ?? [];
  const mappedQuickActions = quickActions?.map((action) => ({ ...action, component: Link })) ?? [];

  return (
    <DashboardPanel
      title={title}
      subtitle={subtitle}
      actions={mappedActions}
      quickActions={mappedQuickActions}
      quickActionsTitle={quickActionsTitle}
      data={data}
    />
  );
};

export default DashboardPageTemplate;
