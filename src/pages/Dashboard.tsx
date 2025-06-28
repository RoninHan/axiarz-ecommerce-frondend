import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Inventory,
  Assessment,
  Visibility,
  Star,
  LocalShipping,
  Payment,
  Notifications,
  MoreVert
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendDirection = 'up',
  subtitle 
}) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trendDirection === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, mr: 0.5, color: 'error.main' }} />
              )}
              <Typography 
                variant="body2" 
                color={trendDirection === 'up' ? 'success.main' : 'error.main'}
                fontWeight={500}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 4px 12px ${color}40`
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 进度卡片组件
interface ProgressCardProps {
  title: string;
  value: number;
  total: number;
  color: string;
  icon?: React.ReactNode;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, total, color, icon }) => {
  const percentage = (value / total) * 100;
  
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box sx={{ mr: 2, color }}>
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {value.toLocaleString()} / {total.toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={600} color={color}>
          {percentage.toFixed(1)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 5,
          }
        }}
      />
    </Paper>
  );
};

// 最近活动组件
const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'order',
      title: '新订单 #12345',
      description: '客户张三下单了 iPhone 15 Pro',
      time: '2分钟前',
      avatar: <ShoppingCart />,
      color: '#2196f3'
    },
    {
      id: 2,
      type: 'user',
      title: '新用户注册',
      description: '李四完成了注册',
      time: '5分钟前',
      avatar: <People />,
      color: '#4caf50'
    },
    {
      id: 3,
      type: 'payment',
      title: '支付成功',
      description: '订单 #12344 支付完成',
      time: '10分钟前',
      avatar: <Payment />,
      color: '#ff9800'
    },
    {
      id: 4,
      type: 'shipping',
      title: '发货通知',
      description: '订单 #12343 已发货',
      time: '15分钟前',
      avatar: <LocalShipping />,
      color: '#9c27b0'
    }
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            最近活动
          </Typography>
          <Button size="small" color="primary">
            查看全部
          </Button>
        </Box>
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activity.color, width: 40, height: 40 }}>
                    {activity.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                  secondary={activity.description}
                  secondaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// 快速操作组件
const QuickActions: React.FC = () => {
  const actions = [
    { title: '添加商品', icon: <Inventory />, color: '#4caf50' },
    { title: '查看订单', icon: <ShoppingCart />, color: '#2196f3' },
    { title: '用户管理', icon: <People />, color: '#ff9800' },
    { title: '数据分析', icon: <Assessment />, color: '#9c27b0' }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          快速操作
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Button
                variant="outlined"
                startIcon={action.icon}
                fullWidth
                sx={{
                  py: 2,
                  borderColor: action.color,
                  color: action.color,
                  '&:hover': {
                    borderColor: action.color,
                    backgroundColor: `${action.color}10`
                  }
                }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = observer(() => {
  // 模拟数据
  const stats = [
    {
      title: '总销售额',
      value: '¥128,500',
      icon: <AttachMoney />,
      color: '#4caf50',
      trend: '+12.5%',
      trendDirection: 'up' as const,
      subtitle: '本月累计'
    },
    {
      title: '订单数量',
      value: '1,234',
      icon: <ShoppingCart />,
      color: '#2196f3',
      trend: '+8.2%',
      trendDirection: 'up' as const,
      subtitle: '本月订单'
    },
    {
      title: '用户数量',
      value: '5,678',
      icon: <People />,
      color: '#ff9800',
      trend: '+15.3%',
      trendDirection: 'up' as const,
      subtitle: '注册用户'
    },
    {
      title: '商品数量',
      value: '892',
      icon: <Inventory />,
      color: '#9c27b0',
      trend: '+5.7%',
      trendDirection: 'up' as const,
      subtitle: '在售商品'
    }
  ];

  const progressData = [
    { 
      title: '本月销售目标', 
      value: 128500, 
      total: 150000, 
      color: '#4caf50',
      icon: <AttachMoney />
    },
    { 
      title: '库存周转率', 
      value: 75, 
      total: 100, 
      color: '#2196f3',
      icon: <Inventory />
    },
    { 
      title: '客户满意度', 
      value: 92, 
      total: 100, 
      color: '#ff9800',
      icon: <Star />
    },
    { 
      title: '系统性能', 
      value: 98, 
      total: 100, 
      color: '#9c27b0',
      icon: <Assessment />
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            仪表盘
          </Typography>
          <Typography variant="body1" color="textSecondary">
            欢迎回来！这里是您的系统概览。
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Visibility />}>
            导出报告
          </Button>
          <Button variant="contained" startIcon={<Notifications />}>
            通知设置
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* 快速操作 */}
      <Box sx={{ mb: 4 }}>
        <QuickActions />
      </Box>

      {/* 进度卡片和最近活动 */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            目标进度
          </Typography>
          <Grid container spacing={2}>
            {progressData.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <ProgressCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}); 