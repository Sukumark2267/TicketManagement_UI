import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

const STATUS_CHART_COLORS = ['#145b82', '#ff8f3d', '#16a34a', '#7c3aed'];
const PRIORITY_CHART_COLORS = ['#38bdf8', '#f59e0b', '#ef4444', '#9333ea'];
const CATEGORY_CHART_COLORS = ['#145b82', '#0ea5e9', '#14b8a6', '#ff8f3d', '#7c3aed'];

const toDoughnutData = (items, colors) => ({
  labels: items.map((item) => item.label),
  datasets: [{
    data: items.map((item) => item.count),
    backgroundColor: items.map((_, index) => colors[index % colors.length]),
    borderWidth: 0,
    hoverOffset: 6,
    spacing: 3
  }]
});

const toBarData = (items) => ({
  labels: items.map((item) => item.month),
  datasets: [{
    label: 'Tickets',
    data: items.map((item) => item.count),
    backgroundColor: 'rgba(20, 91, 130, 0.9)',
    hoverBackgroundColor: '#145b82',
    borderRadius: 14,
    borderSkipped: false,
    maxBarThickness: 72
  }]
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '78%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#10233a',
      padding: 12,
      displayColors: true,
      usePointStyle: true,
      titleColor: '#ffffff',
      bodyColor: '#dbe7f3',
      cornerRadius: 12
    }
  }
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#10233a',
      padding: 12,
      displayColors: false,
      titleColor: '#ffffff',
      bodyColor: '#dbe7f3',
      cornerRadius: 12
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#607086',
        font: {
          size: 12,
          weight: 600
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(215, 227, 239, 0.78)' },
      border: { display: false },
      ticks: {
        precision: 0,
        color: '#607086',
        font: {
          size: 12,
          weight: 600
        }
      }
    }
  }
};

const getTotalCount = (items) => items.reduce((sum, item) => sum + item.count, 0);

const toLegendItems = (items, colors) => {
  const total = getTotalCount(items);

  return items.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    percentage: total ? Math.round((item.count / total) * 100) : 0
  }));
};

const statItems = (summary) => [
  { label: 'Total Tickets', value: summary.totalTickets, accent: '#145b82', tint: 'rgba(20, 91, 130, 0.08)' },
  { label: 'Open Tickets', value: summary.openTickets, accent: '#1d7fb8', tint: 'rgba(29, 127, 184, 0.08)' },
  { label: 'In Progress', value: summary.inProgressTickets, accent: '#ff8f3d', tint: 'rgba(255, 143, 61, 0.12)' },
  { label: 'Closed Tickets', value: summary.closedTickets, accent: '#16a34a', tint: 'rgba(22, 163, 74, 0.10)' },
  { label: 'High Priority', value: summary.highPriorityTickets, accent: '#dc2626', tint: 'rgba(220, 38, 38, 0.08)' },
  { label: 'Created Today', value: summary.ticketsCreatedToday, accent: '#7c3aed', tint: 'rgba(124, 58, 237, 0.08)' },
  { label: 'My Assigned', value: summary.myAssignedTickets, accent: '#0f766e', tint: 'rgba(15, 118, 110, 0.08)' },
  { label: 'My Created', value: summary.myCreatedTickets, accent: '#475569', tint: 'rgba(71, 85, 105, 0.08)' }
];

const surfaceSx = {
  borderRadius: { xs: 3, md: 4 },
  border: '1px solid rgba(215, 227, 239, 0.9)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99), rgba(251,253,255,0.98))',
  boxShadow: '0 18px 38px rgba(16, 35, 58, 0.06)'
};

const heroCardSx = {
  ...surfaceSx,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(20, 91, 130, 0.08), transparent 34%), radial-gradient(circle at bottom left, rgba(47, 137, 184, 0.06), transparent 30%)',
    pointerEvents: 'none'
  }
};

const chartPanelSx = {
  ...surfaceSx,
  overflow: 'hidden',
  height: '100%'
};

const metricTileSx = (item) => ({
  '--metric-accent': item.accent,
  '--metric-glow': item.tint,
  position: 'relative',
  minHeight: { xs: 58, sm: 64, md: 68 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: { xs: 'flex-start', sm: 'center' },
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  borderRadius: 2.5,
  border: '1px solid rgba(215,227,239,0.9)',
  background: '#ffffff',
  boxShadow: '0 8px 20px rgba(16, 35, 58, 0.05)',
  px: { xs: 1.35, sm: 1.25 },
  py: { xs: 0.8, sm: 0.85 },
  overflow: 'hidden',
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 14px 28px rgba(16, 35, 58, 0.08)',
    borderColor: 'rgba(176, 193, 208, 0.95)'
  },
  '&:hover .metric-value': {
    color: 'var(--metric-accent)',
    transform: 'scale(1.07)',
    textShadow: '0 10px 20px var(--metric-glow)'
  },
  '&:hover .metric-label': {
    color: '#425166'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    background: item.accent
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 10,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 8,
    background: item.tint,
    display: { xs: 'none', sm: 'block' }
  }
});

const quickActionsShellSx = surfaceSx;

const quickActionCardSx = {
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 3.5,
  borderColor: 'rgba(215,227,239,0.9)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99), rgba(249,251,255,0.98))',
  boxShadow: '0 14px 28px rgba(16, 35, 58, 0.05)',
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(135deg, rgba(20, 91, 130, 0.05), transparent 42%)',
    pointerEvents: 'none'
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 18px 34px rgba(16, 35, 58, 0.08)',
    borderColor: 'rgba(20, 91, 130, 0.2)'
  }
};

const actionButtonSx = (variant) => ({
  minHeight: 44,
  px: 2.25,
  borderRadius: 2.75,
  textTransform: 'none',
  fontWeight: 700,
  letterSpacing: '0.01em',
  borderColor: 'rgba(20, 91, 130, 0.18)',
  boxShadow: variant === 'contained' ? '0 14px 30px rgba(20, 91, 130, 0.18)' : 'none',
  background:
    variant === 'contained'
      ? 'linear-gradient(180deg, #1d6d99 0%, #145b82 100%)'
      : 'rgba(255,255,255,0.92)',
  color: variant === 'contained' ? '#fff' : '#145b82',
  '&:hover': {
    borderColor: 'rgba(20, 91, 130, 0.26)',
    background:
      variant === 'contained'
        ? 'linear-gradient(180deg, #165f87 0%, #0f4f74 100%)'
        : 'rgba(245, 249, 253, 1)',
    boxShadow:
      variant === 'contained'
        ? '0 18px 34px rgba(20, 91, 130, 0.22)'
        : '0 10px 22px rgba(16, 35, 58, 0.06)'
  }
});

const sectionTitleSx = {
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '-0.02em'
};

const chartTitleSx = {
  fontSize: '1.05rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  mb: 2
};

const chartShellSx = {
  p: { xs: 1.2, md: 1.4 },
  borderRadius: 3,
  border: '1px solid rgba(226, 234, 243, 0.95)',
  background: 'linear-gradient(180deg, rgba(249,252,255,0.9), rgba(255,255,255,0.98))',
  minWidth: 0
};

const donutWrapSx = {
  position: 'relative',
  width: { xs: 210, md: 224 },
  height: { xs: 210, md: 224 },
  mx: 'auto'
};

const donutCenterSx = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 94,
  height: 94,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(255,255,255,0.96)',
  border: '1px solid rgba(226, 234, 243, 0.95)',
  boxShadow: '0 12px 24px rgba(16, 35, 58, 0.06)',
  pointerEvents: 'none'
};

const chartLegendRowSx = (color) => ({
  display: 'grid',
  gridTemplateColumns: { xs: 'auto 1fr auto', sm: 'auto 1fr auto auto' },
  alignItems: 'center',
  gap: 1,
  px: 1.2,
  py: 1,
  borderRadius: 2.5,
  border: '1px solid rgba(226, 234, 243, 0.9)',
  background: '#ffffff',
  boxShadow: '0 8px 18px rgba(16, 35, 58, 0.04)',
  '&::before': {
    content: '""',
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 0 5px ${color}22`
  }
});

const DonutAnalyticsCard = ({ title, items, colors }) => {
  const total = getTotalCount(items);
  const legendItems = toLegendItems(items, colors);

  return (
    <Card className="glass-panel" sx={chartPanelSx}>
      <CardContent sx={{ p: { xs: 2.25, md: 2.5 }, '&:last-child': { pb: { xs: 2.25, md: 2.5 } } }}>
        <Typography sx={chartTitleSx}>{title}</Typography>
        <Box sx={chartShellSx}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 180px' },
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box sx={donutWrapSx}>
              <Doughnut data={toDoughnutData(items, colors)} options={doughnutOptions} />
              <Box sx={donutCenterSx}>
                <Typography
                  sx={{
                    fontSize: { xs: '1.85rem', md: '2rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.05em',
                    color: '#101828',
                    lineHeight: 1
                  }}
                >
                  {total}
                </Typography>
              </Box>
            </Box>
            <Stack spacing={1}>
              {legendItems.map((item) => (
                <Box key={item.label} sx={chartLegendRowSx(item.color)}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#304255' }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#101828' }}>
                    {item.count}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#6b7b8d' }}>
                    {item.percentage}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TrendAnalyticsCard = ({ title, items }) => (
  <Card className="glass-panel" sx={chartPanelSx}>
    <CardContent sx={{ p: { xs: 2.25, md: 2.5 }, '&:last-child': { pb: { xs: 2.25, md: 2.5 } } }}>
      <Typography sx={chartTitleSx}>{title}</Typography>
      <Box sx={chartShellSx}>
        <Box sx={{ height: 250 }}>
          <Bar data={toBarData(items)} options={barOptions} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPanel = ({ title, subtitle, actions, quickActions, quickActionsTitle = 'Quick Actions', data }) => (
  <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'clip' }}>
    <Card className="glass-panel" sx={heroCardSx}>
      <CardContent sx={{ p: { xs: 2.25, md: 3 }, '&:last-child': { pb: { xs: 2.25, md: 3 } }, position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xs: 'flex-start', xl: 'center' },
            justifyContent: 'space-between',
            gap: 2.5,
            minWidth: 0
          }}
        >
          <Box sx={{ maxWidth: 760, minWidth: 0, width: '100%' }}>
            <Typography
              sx={{
                fontSize: { xs: '1.45rem', sm: '1.7rem', md: '2.15rem' },
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                wordBreak: 'break-word'
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                maxWidth: 760,
                color: '#526173',
                fontSize: { xs: '0.92rem', md: '1.02rem' },
                lineHeight: 1.65
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            useFlexGap
            flexWrap="wrap"
            sx={{ width: { xs: '100%', xl: 'auto' } }}
          >
            {actions?.map((action) => (
              <Button
                key={action.label}
                component={action.component}
                to={action.to}
                variant={action.variant || 'contained'}
                sx={{
                  ...actionButtonSx(action.variant || 'contained'),
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, minmax(0, 1fr))',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(4, minmax(0, 1fr))'
        },
        gap: 1.25,
        width: '100%',
        minWidth: 0
      }}
    >
      {statItems(data.summary).map((item) => (
        <Box key={item.label} sx={metricTileSx(item)}>
          <Box sx={{ width: '100%', textAlign: { xs: 'left', sm: 'center' }, position: 'relative', zIndex: 1, minWidth: 0, pr: { xs: 3.5, sm: 0 } }}>
            <Typography
              className="metric-label"
              sx={{
                fontSize: { xs: '0.6rem', sm: '0.64rem' },
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6b7b8d',
                transition: 'color 160ms ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {item.label}
            </Typography>
            <Typography
              className="metric-value"
              sx={{
                mt: 0.45,
                fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.72rem' },
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#101828',
                transition: 'transform 160ms ease, color 160ms ease, text-shadow 160ms ease'
              }}
            >
              {item.value}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 9,
              zIndex: 1,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#ffffff',
              display: { xs: 'none', sm: 'grid' },
              placeItems: 'center',
              boxShadow: '0 4px 10px rgba(16, 35, 58, 0.05)'
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: item.accent,
                boxShadow: `0 0 0 4px ${item.tint}`
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>

    {quickActions?.length ? (
      <Card className="glass-panel" sx={quickActionsShellSx}>
        <CardContent sx={{ p: { xs: 2.25, md: 2.5 }, '&:last-child': { pb: { xs: 2.25, md: 2.5 } } }}>
          <Typography sx={sectionTitleSx}>{quickActionsTitle}</Typography>
          <Box
            sx={{
              mt: 1.75,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))'
              },
              gap: 1.5,
              minWidth: 0
            }}
          >
            {quickActions.map((action) => (
              <Card key={action.label} variant="outlined" sx={quickActionCardSx}>
                <CardActionArea
                  component={action.component}
                  to={action.to}
                  sx={{
                    px: { xs: 1.6, md: 2.1 },
                    py: { xs: 1.5, md: 1.8 },
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>{action.label}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, lineHeight: 1.6 }}>
                      {action.description}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    ) : null}

    <Grid container spacing={{ xs: 2, md: 2.5 }}>
      <Grid item xs={12} md={6}>
        <DonutAnalyticsCard title="Tickets by Status" items={data.byStatus} colors={STATUS_CHART_COLORS} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DonutAnalyticsCard title="Tickets by Priority" items={data.byPriority} colors={PRIORITY_CHART_COLORS} />
      </Grid>
      <Grid item xs={12} md={6}>
        <DonutAnalyticsCard title="Tickets by Category" items={data.byCategory} colors={CATEGORY_CHART_COLORS} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TrendAnalyticsCard title="Monthly Ticket Trend" items={data.monthlyTrend} />
      </Grid>
    </Grid>
  </Stack>
);

export default DashboardPanel;
