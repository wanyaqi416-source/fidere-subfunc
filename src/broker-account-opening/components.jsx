import React, { useRef } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import QueryBuilder from '@mui/icons-material/QueryBuilder';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import { accountType, brokerDocumentRequirements, brokerSteps, brokers } from './brokers';

const buttonSx = {
  height: 40,
  minHeight: 40,
  maxHeight: 40,
  minWidth: 120,
  py: 0,
  whiteSpace: 'nowrap',
  lineHeight: 1,
  borderRadius: 1.5,
  flexShrink: 0,
};

const cardSx = {
  borderRadius: '16px',
};

const submitButtonSx = {
  ...buttonSx,
  minWidth: 144,
};

const confirmationControlSx = {
  alignItems: 'center',
  m: 0,
  gap: 1.5,
  '& .MuiCheckbox-root': { p: 0 },
  '& .MuiFormControlLabel-label': {
    display: 'flex',
    alignItems: 'center',
    minHeight: 24,
  },
};

function formatFee(broker) {
  if (!broker) return '$0.00';
  return `$${broker.fee.toFixed(2)}`;
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getDocumentItems(selectedBroker) {
  return brokerDocumentRequirements[selectedBroker.id] ?? [];
}

function getUploadedFileName(file) {
  return file?.fileName ?? file?.name ?? '';
}

function getUploadedFileSize(file) {
  return file?.fileSize ?? file?.size ?? 0;
}

function SectionCard({ title, description, children }) {
  return (
    <Card variant="outlined" sx={{ ...cardSx, overflow: { xs: 'visible', sm: 'hidden' } }}>
      <CardContent
        sx={(theme) => ({
          p: { xs: theme.spacing(3), md: theme.spacing(4) },
          '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4) } },
        })}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function MetaChips({ title, values }) {
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            size="small"
            sx={(theme) => ({
              height: 24,
              borderRadius: 1,
              bgcolor: theme.palette.action.hover,
              color: 'text.secondary',
              '& .MuiChip-label': { px: 1 },
            })}
          />
        ))}
      </Stack>
    </Stack>
  );
}

const sharedTransferRecords = [
  {
    date: '2026-06-20',
    type: 'Transfer In',
    sourceAccount: 'FIDERE Trust Account',
    targetAccount: '券商账户',
    currency: 'USD',
    amount: '50,000.00',
    status: 'Completed',
    reference: 'FT-BR-20260620-001',
  },
  {
    date: '2026-06-18',
    type: 'Transfer Out',
    sourceAccount: '券商账户',
    targetAccount: 'FIDERE Trust Account',
    currency: 'USD',
    amount: '10,000.00',
    status: 'Processing',
    reference: 'BR-FT-20260618-002',
  },
  {
    date: '2026-06-12',
    type: 'Transfer In',
    sourceAccount: 'FIDERE Trust Account',
    targetAccount: '券商账户',
    currency: 'HKD',
    amount: '80,000.00',
    status: 'Completed',
    reference: 'FT-BR-20260612-003',
  },
  {
    date: '2026-06-05',
    type: 'Transfer In',
    sourceAccount: 'FIDERE Trust Account',
    targetAccount: '券商账户',
    currency: 'CNY',
    amount: '120,000.00',
    status: 'Completed',
    reference: 'FT-BR-20260605-004',
  },
];

export const brokerAccountRecords = [
  {
    brokerId: 'ibkr',
    brokerName: 'IBKR 盈透证券',
    accountName: 'IBKR Securities Account',
    accountNumber: 'IBKR-****-6118',
    accountStatus: 'Active / 已开通',
    accountType,
    currencies: 'USD / HKD / CNY',
    openedAt: '2026-06-18',
    updatedAt: '2026-06-22 09:40',
    trustAccount: 'FIDERE Trust Account',
    trustRelation: '该券商账户已与您的 FIDERE Trust 信托账户完成关联，用于账户信息查看与内部资金划转申请。',
    transferAccountLabel: 'IBKR Account',
    transferRecords: sharedTransferRecords.map((record) => ({
      ...record,
      targetAccount: record.targetAccount === '券商账户' ? 'IBKR Account' : record.targetAccount,
      sourceAccount: record.sourceAccount === '券商账户' ? 'IBKR Account' : record.sourceAccount,
      reference: record.reference.replace('BR', 'IB'),
    })),
  },
  {
    brokerId: 'webull',
    brokerName: 'Webull 微牛证券',
    accountName: 'Webull Securities Account',
    accountNumber: 'WB-****-2841',
    accountStatus: 'Active / 已开通',
    accountType,
    currencies: 'USD / HKD / CNY',
    openedAt: '2026-06-22',
    updatedAt: '2026-06-22 10:30',
    trustAccount: 'FIDERE Trust Account',
    trustRelation: '该券商账户已与您的 FIDERE Trust 信托账户完成关联，用于账户信息查看与内部资金划转申请。',
    transferAccountLabel: 'Webull Account',
    transferRecords: sharedTransferRecords.map((record) => ({
      ...record,
      targetAccount: record.targetAccount === '券商账户' ? 'Webull Account' : record.targetAccount,
      sourceAccount: record.sourceAccount === '券商账户' ? 'Webull Account' : record.sourceAccount,
      reference: record.reference.replace('BR', 'WB'),
    })),
  },
];

const trustAccountCurrencyOptions = {
  香港账户: ['USD', 'HKD', 'CNY'],
  美国账户: ['USD'],
};

const brokerReadonlyFieldSx = (theme) => ({
  '& .MuiFilledInput-root': {
    borderRadius: 1.5,
    bgcolor: alpha(theme.palette.primary.main, 0.08),
    boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.26)}`,
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
    },
    '&.Mui-focused': {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
    },
  },
  '& .MuiFilledInput-input': {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 700,
  },
});

const dashboardCardSx = {
  borderRadius: 2,
};

const dashboardCardContentSx = (theme) => ({
  p: { xs: theme.spacing(3), md: theme.spacing(3.5) },
  '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(3.5) } },
});

const tableHeadCellSx = {
  color: 'text.secondary',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  bgcolor: 'background.default',
};

function AccountOverviewCard({ title, description, action, children }) {
  return (
    <Card variant="outlined" sx={dashboardCardSx}>
      <CardContent sx={dashboardCardContentSx}>
        <Stack spacing={2.75}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusPill({ label, color = 'success' }) {
  return <Chip size="small" color={color} label={label} sx={{ height: 24, fontWeight: 700 }} />;
}

function EmptyTableRow({ colSpan, label }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function getRecordStatusChipProps(status) {
  if (status === 'Completed') {
    return { color: 'success', variant: 'filled' };
  }
  if (status === 'Rejected') {
    return { color: 'error', variant: 'filled' };
  }
  return { color: 'primary', variant: 'outlined' };
}

function BrokerAccountListCard({ broker, account, onViewAccount, onOpenAccount }) {
  const isOpened = Boolean(account);

  return (
    <Card
      variant="outlined"
      onClick={isOpened ? () => onViewAccount(account) : undefined}
      sx={(theme) => ({
        ...dashboardCardSx,
        height: '100%',
        cursor: isOpened ? 'pointer' : 'default',
        transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': isOpened
          ? {
              borderColor: alpha(theme.palette.primary.main, 0.42),
              boxShadow: theme.shadows[2],
              transform: 'translateY(-1px)',
            }
          : undefined,
      })}
    >
      <CardContent sx={dashboardCardContentSx}>
        <Stack spacing={2.5} sx={{ height: '100%' }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {broker.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {broker.description}
              </Typography>
            </Box>
            <Chip
              size="small"
              color={isOpened ? 'success' : 'default'}
              variant={isOpened ? 'filled' : 'outlined'}
              label={isOpened ? account.accountStatus : '未开通'}
              sx={{ height: 24, flexShrink: 0, fontWeight: 700 }}
            />
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <SummaryRow label="账户类型" value={accountType} />
            <SummaryRow label="券商账户号码" value={account?.accountNumber ?? '--'} />
            <SummaryRow label="结算币种" value={account?.currencies ?? '--'} />
            <SummaryRow label="开户日期" value={account?.openedAt ?? '--'} />
            <SummaryRow label="更新时间" value={account?.updatedAt ?? '--'} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ mt: 'auto' }}>
            {isOpened ? (
              <Button
                variant="contained"
                onClick={(event) => {
                  event.stopPropagation();
                  onViewAccount(account);
                }}
                sx={{ ...buttonSx, minWidth: 120 }}
              >
                查看详情
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => onOpenAccount(broker.id)}
                sx={{ ...buttonSx, minWidth: 144 }}
              >
                立即开通
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function BrokerAccountListPage({ accounts, onOpenAccount, onViewAccount }) {
  const accountsByBrokerId = new Map(accounts.map((account) => [account.brokerId, account]));

  return (
    <Stack spacing={{ xs: 3, md: 3.5 }}>
      {accounts.length === 0 ? (
        <Paper
          variant="outlined"
          sx={(theme) => ({
            p: { xs: theme.spacing(3), md: theme.spacing(4) },
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.025),
          })}
        >
          <Stack spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} textAlign={{ xs: 'left', sm: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              暂无已开通券商账户
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
              当前尚未开通 IBKR 或 Webull 券商账户。您可以先选择一家券商提交开户申请；同一家券商仅允许保留一个有效账户。
            </Typography>
            <Button variant="contained" onClick={() => onOpenAccount()} sx={{ ...buttonSx, minWidth: 168 }}>
              立即开通券商账户
            </Button>
          </Stack>
        </Paper>
      ) : null}

      <Grid container spacing={3}>
        {brokers.map((broker) => (
          <Grid key={broker.id} size={{ xs: 12 }}>
            <BrokerAccountListCard
              broker={broker}
              account={accountsByBrokerId.get(broker.id)}
              onViewAccount={onViewAccount}
              onOpenAccount={onOpenAccount}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export function BrokerAccountDashboard({ account, onBackToList }) {
  const [transferDirection, setTransferDirection] = React.useState(null);
  const [transferSubmitted, setTransferSubmitted] = React.useState(false);

  const handleSubmitTransfer = () => {
    setTransferDirection(null);
    setTransferSubmitted(true);
  };

  return (
    <Stack spacing={{ xs: 3, md: 3.5 }}>
      {onBackToList ? (
        <Box>
          <Button variant="outlined" onClick={onBackToList} sx={{ ...buttonSx, minWidth: 132 }}>
            返回账户列表
          </Button>
        </Box>
      ) : null}

      {transferSubmitted ? (
        <Alert severity="success" onClose={() => setTransferSubmitted(false)}>
          资金互转申请已提交，请等待审核
        </Alert>
      ) : null}

      <BrokerAccountHero account={account} />

      <Grid container spacing={{ xs: 3, md: 3.5 }} alignItems="flex-start">
        <Grid size={{ xs: 12 }}>
          <Stack spacing={{ xs: 3, md: 3.5 }}>
            <BrokerAccountSidebar account={account} />
            <InternalTransferCard onRequestTransfer={setTransferDirection} />
            <RecentTransferTable records={account.transferRecords} />
          </Stack>
        </Grid>
      </Grid>

      <TransferRequestDialog
        account={account}
        initialDirection={transferDirection ?? 'trustToBroker'}
        open={Boolean(transferDirection)}
        onClose={() => setTransferDirection(null)}
        onSubmit={handleSubmitTransfer}
      />
    </Stack>
  );
}

export function BrokerAccountHero({ account }) {
  return (
    <Card variant="outlined" sx={dashboardCardSx}>
      <CardContent
        sx={(theme) => ({
          p: { xs: theme.spacing(3), md: theme.spacing(4.5) },
          '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4.5) } },
        })}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7.6 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                <StatusPill label="Active / 已开通" />
                <Chip
                  size="small"
                  variant="outlined"
                  color="primary"
                  label={account.brokerName}
                  sx={{ height: 24, fontWeight: 600 }}
                />
              </Stack>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  券商账户已开通
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
                  您已成功开通 {account.brokerName} 账户，可在此查看账户信息与信托内资金划转记录。
                </Typography>
              </Box>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: theme.spacing(2),
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.info.main, 0.045),
                  borderColor: alpha(theme.palette.info.main, 0.18),
                })}
              >
                <Typography variant="body2" color="text.secondary">
                  FIDERE Trust 仅提供账户查看、信托管理及内部资金划转服务，本页面不提供证券相关操作功能。
                </Typography>
              </Paper>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4.4 }}>
            <Paper
              variant="outlined"
              sx={(theme) => ({
                p: theme.spacing(2.5),
                borderRadius: 1.5,
                bgcolor: theme.palette.background.paper,
              })}
            >
              <Stack spacing={1.75}>
                <SummaryRow label="券商名称" value={account.brokerName} />
                <SummaryRow label="账户类型" value={account.accountType} />
                <SummaryRow label="开户日期" value={account.openedAt} />
                <SummaryRow label="状态" value={account.accountStatus} strong />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export function InternalTransferCard({ onRequestTransfer }) {
  return (
    <AccountOverviewCard
      title="资金划转"
      description="您可以在 FIDERE Trust 信托账户与券商账户之间提交内部资金划转申请，申请将由 FIDERE Trust 审核及处理。"
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Stack spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            onClick={() => onRequestTransfer('trustToBroker')}
            sx={{ ...buttonSx, minWidth: { sm: 220 }, width: { xs: '100%', sm: 'auto' } }}
          >
            从信托账户转入券商账户
          </Button>
          <Typography variant="caption" color="text.secondary">
            Transfer In from Trust Account
          </Typography>
        </Stack>
        <Stack spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            onClick={() => onRequestTransfer('brokerToTrust')}
            sx={{ ...buttonSx, minWidth: { sm: 220 }, width: { xs: '100%', sm: 'auto' } }}
          >
            从券商账户转出至信托账户
          </Button>
          <Typography variant="caption" color="text.secondary">
            Transfer Out to Trust Account
          </Typography>
        </Stack>
      </Stack>
    </AccountOverviewCard>
  );
}

export function HoldingsOverviewTable({ holdings }) {
  return (
    <AccountOverviewCard
      title="持仓概览"
      description="当前券商账户持仓数据为只读展示，不支持线上证券操作。"
      action={
        <Button variant="outlined" size="small" sx={{ height: 32, minWidth: 96, whiteSpace: 'nowrap' }}>
          View Details
        </Button>
      }
    >
      <Box sx={{ overflowX: 'auto', borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table sx={{ minWidth: 920 }}>
          <TableHead>
            <TableRow>
              {['Security Name', 'Ticker', 'Market', 'Quantity', 'Market Value', 'Cost', 'Unrealized P/L', 'Allocation'].map(
                (header) => (
                  <TableCell key={header} sx={tableHeadCellSx}>
                    {header}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.length === 0 ? (
              <EmptyTableRow colSpan={8} label="暂无持仓记录" />
            ) : (
              holdings.map((holding) => {
                const isGain = holding.unrealizedPl.startsWith('+');
                return (
                  <TableRow key={holding.ticker} hover sx={{ '& .MuiTableCell-root': { py: 1.5 } }}>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{holding.securityName}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{holding.ticker}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{holding.market}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{holding.quantity}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{holding.marketValue}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{holding.cost}</TableCell>
                    <TableCell
                      sx={{
                        color: isGain ? 'success.main' : 'error.main',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {holding.unrealizedPl}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{holding.allocation}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </AccountOverviewCard>
  );
}

export function RecentTransferTable({ records }) {
  // Product requirement: the opened-account page only previews the latest three transfer records.
  const recentRecords = records.slice(0, 3);

  return (
    <AccountOverviewCard title="最近资金划转记录" description="展示信托账户与券商账户之间的内部资金划转记录。">
      <Box sx={{ overflowX: 'auto', borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table sx={{ minWidth: 940 }}>
          <TableHead>
            <TableRow>
              {['日期', '类型', '来源账户', '目标账户', '币种', '金额', '状态', '参考编号'].map((header) => (
                <TableCell key={header} sx={tableHeadCellSx}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentRecords.length === 0 ? (
              <EmptyTableRow colSpan={8} label="暂无资金划转记录" />
            ) : (
              recentRecords.map((record) => {
                const chipProps = getRecordStatusChipProps(record.status);
                return (
                  <TableRow key={record.reference} hover sx={{ '& .MuiTableCell-root': { py: 1.5 } }}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{record.type}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.sourceAccount}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.targetAccount}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.currency}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{record.amount}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={chipProps.color}
                        variant={chipProps.variant}
                        label={record.status}
                        sx={{ height: 22, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.reference}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </AccountOverviewCard>
  );
}

export function BrokerAccountSidebar({ account }) {
  return (
    <AccountOverviewCard title="券商账户信息">
      <Stack spacing={2.5}>
        <Stack spacing={1.5}>
          <SummaryRow label="账户名称" value={account.accountName} strong />
          <SummaryRow label="账户号码" value={account.accountNumber} />
          <SummaryRow label="账户状态" value={account.accountStatus} />
          <SummaryRow label="账户类型" value={account.accountType} />
          <SummaryRow label="结算货币" value={account.currencies} />
          <SummaryRow label="更新时间" value={account.updatedAt} />
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            信托账户关联信息
          </Typography>
          <SummaryRow label="关联账户" value={account.trustAccount} strong />
          <Typography variant="body2" color="text.secondary">
            {account.trustRelation}
          </Typography>
        </Stack>
      </Stack>
    </AccountOverviewCard>
  );
}

export function TransferRequestDialog({ account, initialDirection = 'trustToBroker', open, onClose, onSubmit }) {
  const directionType = initialDirection === 'brokerToTrust' ? 'brokerToTrust' : 'trustToBroker';
  const [trustAccountType, setTrustAccountType] = React.useState('香港账户');
  const [currency, setCurrency] = React.useState('USD');
  const [amount, setAmount] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [amountTouched, setAmountTouched] = React.useState(false);

  const brokerCurrencies = React.useMemo(() => {
    return (account?.currencies ?? 'USD')
      .split('/')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [account]);

  const availableCurrencies = React.useMemo(() => {
    const trustCurrencies = trustAccountCurrencyOptions[trustAccountType] ?? [];
    const sharedCurrencies = brokerCurrencies.filter((item) => trustCurrencies.includes(item));
    return sharedCurrencies.length > 0 ? sharedCurrencies : ['USD'];
  }, [brokerCurrencies, trustAccountType]);

  const amountValue = Number(amount);
  const amountInvalid = amountTouched && (!amount || Number.isNaN(amountValue) || amountValue <= 0);
  const estimatedAmount =
    amount && !Number.isNaN(amountValue) && amountValue > 0 ? `${currency} ${amountValue.toFixed(2)}` : `${currency} 0.00`;
  const brokerAccountLabel = account ? `${account.brokerName.replace(/\s+/g, '')}账户` : '当前券商账户';
  const dialogTitle = directionType === 'trustToBroker' ? '从信托账户转入券商账户' : '从券商账户转出至信托账户';

  React.useEffect(() => {
    if (!open) return;
    setTrustAccountType('香港账户');
    setAmount('');
    setPurpose('');
    setAmountTouched(false);
  }, [initialDirection, open]);

  React.useEffect(() => {
    if (!availableCurrencies.includes(currency)) {
      setCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies, currency]);

  const handleSubmit = () => {
    setAmountTouched(true);
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0) return;
    onSubmit?.({
      brokerId: account?.brokerId,
      directionType,
      trustAccountType,
      currency,
      amount,
      purpose,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            {directionType === 'trustToBroker' ? (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="payer-trust-account-label">付款账户</InputLabel>
                    <Select
                      labelId="payer-trust-account-label"
                      value={trustAccountType}
                      label="付款账户"
                      onChange={(event) => setTrustAccountType(event.target.value)}
                    >
                      {Object.keys(trustAccountCurrencyOptions).map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="付款账户"
                    value={brokerAccountLabel}
                    fullWidth
                    variant="filled"
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    sx={brokerReadonlyFieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="券商账户号码"
                    value={account?.accountNumber ?? ''}
                    fullWidth
                    variant="filled"
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    sx={brokerReadonlyFieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="receiver-trust-account-label">收款账户</InputLabel>
                    <Select
                      labelId="receiver-trust-account-label"
                      value={trustAccountType}
                      label="收款账户"
                      onChange={(event) => setTrustAccountType(event.target.value)}
                    >
                      {Object.keys(trustAccountCurrencyOptions).map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="transfer-currency-label">币种</InputLabel>
                <Select
                  labelId="transfer-currency-label"
                  value={currency}
                  label="币种"
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {availableCurrencies.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="金额"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                onBlur={() => setAmountTouched(true)}
                error={amountInvalid}
                helperText={amountInvalid ? '请输入大于 0 的金额' : ' '}
                fullWidth
                placeholder="0.00"
                inputMode="decimal"
              />
            </Grid>
            {directionType === 'trustToBroker' ? (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="收款账户"
                    value={brokerAccountLabel}
                    fullWidth
                    variant="filled"
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    sx={brokerReadonlyFieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="券商账户号码"
                    value={account?.accountNumber ?? ''}
                    fullWidth
                    variant="filled"
                    InputProps={{ readOnly: true, disableUnderline: true }}
                    sx={brokerReadonlyFieldSx}
                  />
                </Grid>
              </>
            ) : null}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="转账用途"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder="请填写本次资金互转用途"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="预计到账金额" value={estimatedAmount} fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={(theme) => ({ px: theme.spacing(3), pb: theme.spacing(3), gap: 1.5 })}>
        <Button variant="outlined" onClick={onClose} sx={buttonSx}>
          取消
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ ...buttonSx, minWidth: 132 }}>
          提交审核
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function BrokerStepper({ activeStep }) {
  return (
    <Card variant="outlined" sx={cardSx}>
      <CardContent sx={(theme) => ({ p: theme.spacing(3), '&:last-child': { pb: theme.spacing(3) } })}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2.5}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.75 }}>
              开通券商账户
            </Typography>
            <Typography variant="body2" color="text.secondary">
              通过受托机构连接全球券商账户，FIDERE 将协助完成资料审核与开户流程。
            </Typography>
          </Box>

          <Stack
            spacing={1}
            sx={(theme) => ({
              flexShrink: 0,
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              minWidth: { md: 220 },
              pl: { md: theme.spacing(3) },
              borderLeft: { md: `1px solid ${theme.palette.divider}` },
            })}
          >
            <Chip color="primary" variant="outlined" label={`Step ${activeStep + 1} of 4`} sx={{ fontWeight: 600 }} />
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <QueryBuilder sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                预计处理时间：3–7 个工作日
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={(theme) => ({ my: theme.spacing(3) })} />

        <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' }, pb: { xs: 0.5, sm: 0 } }}>
          <Stepper
            activeStep={activeStep}
            sx={(theme) => ({
              minWidth: { xs: 520, sm: 'auto' },
              '& .MuiStepLabel-label': {
                ...theme.typography.caption,
                mt: 0.5,
                whiteSpace: 'nowrap',
              },
              '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed': {
                color: 'primary.main',
                fontWeight: 600,
              },
              '& .MuiStepIcon-root': {
                fontSize: 18,
              },
            })}
          >
            {brokerSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </CardContent>
    </Card>
  );
}

export function BrokerCard({ broker, selected, onSelect }) {
  return (
    <Card
      variant="outlined"
      onClick={onSelect}
      sx={(theme) => ({
        ...cardSx,
        cursor: 'pointer',
        borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.03) : theme.palette.background.paper,
        boxShadow: selected ? `inset 3px 0 0 ${theme.palette.primary.main}` : 'none',
        outline: 0,
        transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          borderColor: selected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.45),
          bgcolor: selected ? alpha(theme.palette.primary.main, 0.04) : theme.palette.action.hover,
        },
      })}
    >
      <CardContent sx={(theme) => ({ p: theme.spacing(3), '&:last-child': { pb: theme.spacing(3) } })}>
        <Grid container spacing={2.25} alignItems="stretch">
          <Grid size="auto">
            <Box
              sx={(theme) => ({
                width: 56,
                height: 56,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
              })}
            >
              <Box
                component="img"
                src={broker.logoSrc}
                alt={broker.logoAlt}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </Box>
          </Grid>

          <Grid size="grow" sx={{ minWidth: 0 }}>
            <Stack spacing={1.25} sx={{ height: '100%' }}>
              <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 0 }}>
                  {broker.name}
                </Typography>
                {broker.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color={tag === '官网' ? 'default' : broker.id === 'webull' ? 'success' : 'primary'}
                    variant="outlined"
                    icon={tag === '官网' ? <OpenInNew /> : undefined}
                    sx={{
                      height: 24,
                      fontWeight: 600,
                      '& .MuiChip-icon': { fontSize: 12, ml: 0.75 },
                    }}
                  />
                ))}
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
                {broker.description}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 'auto' }}>
            <Stack
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'flex-end' }}
              spacing={2}
              sx={{ height: '100%', minWidth: { sm: 150 } }}
            >
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  开户费
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
                  {broker.fee} {broker.feeCurrency}
                </Typography>
              </Box>
              <Button
                variant={selected ? 'contained' : 'outlined'}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect();
                }}
                sx={{ ...buttonSx, alignSelf: { xs: 'flex-start', sm: 'flex-end' } }}
              >
                {selected ? '已选择' : `选择 ${broker.shortName}`}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={(theme) => ({ my: theme.spacing(2.25) })} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <MetaChips title="市场覆盖" values={broker.markets} />
          </Grid>
          <Grid size={{ xs: 12, sm: 7 }}>
            <MetaChips title="所需资料" values={broker.requiredDocuments} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export function ApplicationSummary({ selectedBroker, activeStep, submittedApplication }) {
  if (submittedApplication) {
    return (
      <Card variant="outlined" sx={cardSx}>
        <CardContent sx={(theme) => ({ p: theme.spacing(3), '&:last-child': { pb: theme.spacing(3) } })}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Application Summary
            </Typography>
            <Divider />
            <SummaryRow label="申请编号" value={submittedApplication.applicationId} />
            <SummaryRow label="券商名称" value={submittedApplication.brokerName} />
            <SummaryRow label="账户类型" value={accountType} />
            <SummaryRow label="当前状态" value={submittedApplication.statusLabel ?? 'Pending Review / 审核中'} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={cardSx}>
      <CardContent
        sx={(theme) => ({
          p: { xs: theme.spacing(3), md: theme.spacing(4) },
          '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4) } },
        })}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              开户摘要
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              请核对本次开户申请的基础信息。
            </Typography>
          </Box>
          <Divider />
          <SummaryRow label="已选择券商" value={selectedBroker ? selectedBroker.name : '尚未选择'} />
          <SummaryRow label="开户行政费" value={selectedBroker ? formatFee(selectedBroker) : '$100.00'} strong />
          <SummaryRow label="预计处理时间" value={selectedBroker?.processingTime ?? '3–7 个工作日'} />
          <SummaryRow label="账户类型" value={accountType} />
          <SummaryRow label="当前步骤" value={`STEP ${activeStep + 1}/4`} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant={strong ? 'subtitle1' : 'body2'}
        sx={{
          fontWeight: strong ? 700 : 600,
          lineHeight: 1.45,
          textAlign: 'right',
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export function FeeConfirmationStep({ selectedBroker, feeConfirmed, onFeeConfirmedChange, onBack, onNext }) {
  return (
    <SectionCard
      title="确认开户费用"
      description="请核对已选择券商与本次开户行政费。确认后将进入资料上传步骤。"
    >
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: theme.spacing(3),
          borderRadius: '16px',
          bgcolor: alpha(theme.palette.primary.main, 0.025),
        })}
      >
        <Stack spacing={2}>
          <SummaryRow label="已选择券商" value={selectedBroker.name} />
          <SummaryRow label="开户行政费" value={formatFee(selectedBroker)} strong />
          <Divider />
          <Typography variant="body2" color="text.secondary">
            该费用为一次性行政处理费用，不包含后续交易佣金、平台费或第三方费用。
          </Typography>
        </Stack>
      </Paper>

      <FormControlLabel
        control={<Checkbox checked={feeConfirmed} onChange={(event) => onFeeConfirmedChange(event.target.checked)} />}
        label={
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            我已阅读并确认开户费用及相关说明。
          </Typography>
        }
        sx={confirmationControlSx}
      />

      <Divider />

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1.5}
        sx={(theme) => ({
          position: { xs: 'fixed', sm: 'static' },
          left: { xs: 0, sm: 'auto' },
          right: { xs: 0, sm: 'auto' },
          bottom: { xs: 0, sm: 'auto' },
          zIndex: { xs: theme.zIndex.appBar, sm: 'auto' },
          mx: 0,
          mb: 0,
          p: { xs: theme.spacing(2), sm: 0 },
          bgcolor: 'background.paper',
          borderTop: { xs: `1px solid ${theme.palette.divider}`, sm: 0 },
          boxShadow: { xs: theme.shadows[8], sm: 'none' },
        })}
      >
        <Button variant="outlined" onClick={onBack} sx={{ ...buttonSx, minWidth: { xs: 88, sm: 120 } }}>
          上一步
        </Button>
        <Button
          variant="contained"
          disabled={!feeConfirmed}
          onClick={onNext}
          sx={{ ...buttonSx, minWidth: { xs: 0, sm: 184 }, flex: { xs: 1, sm: '0 0 auto' } }}
        >
          确认并继续上传资料
        </Button>
      </Stack>
    </SectionCard>
  );
}

export function UploadInstructionCard() {
  return (
    <Alert
      severity="info"
      sx={(theme) => ({
        alignItems: 'flex-start',
        border: `1px solid ${alpha(theme.palette.info.main, 0.22)}`,
        bgcolor: alpha(theme.palette.info.main, 0.06),
        '& .MuiAlert-message': { width: '100%' },
      })}
    >
      <Stack spacing={0.5}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          所有文件将用于券商开户审核，请确保资料真实、清晰、有效。
        </Typography>
        <Typography variant="caption" color="text.secondary">
          支持 PDF / JPG / PNG，单个文件不超过 10MB。文件上传后可随时删除或替换。
        </Typography>
      </Stack>
    </Alert>
  );
}

export function UploadProgressCard({ completedCount, totalCount }) {
  const progressValue = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: theme.spacing(2),
        borderRadius: 1,
        bgcolor: alpha(theme.palette.primary.main, 0.025),
      })}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              资料完成进度
            </Typography>
            <Typography variant="caption" color="text.secondary">
              完成所有必填资料后即可提交审核
            </Typography>
          </Box>
          <Chip
            size="small"
            color={isComplete ? 'success' : 'default'}
            label={`${completedCount}/${totalCount} 已上传`}
            sx={{ fontWeight: 600, flexShrink: 0 }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={(theme) => ({
            height: 8,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          })}
        />
      </Stack>
    </Paper>
  );
}

export function UploadDocumentCard({ documentItem, uploadedFile, onUpload, onDelete }) {
  const inputRef = useRef(null);
  const isUploaded = uploadedFile?.status === 'uploaded' || Boolean(uploadedFile);
  const fileName = getUploadedFileName(uploadedFile);
  const fileSize = getUploadedFileSize(uploadedFile);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderColor: isUploaded ? alpha(theme.palette.success.main, 0.45) : theme.palette.divider,
        boxShadow: 'none',
      })}
    >
      <CardContent sx={(theme) => ({ p: { xs: theme.spacing(2), sm: theme.spacing(2.5) }, '&:last-child': { pb: { xs: theme.spacing(2), sm: theme.spacing(2.5) } } })}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
              <Box
                sx={(theme) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  flexShrink: 0,
                })}
              >
                {isUploaded ? <CheckCircleOutline fontSize="small" /> : <DescriptionOutlined fontSize="small" />}
              </Box>
              <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 0 }}>
                    {documentItem.name}
                  </Typography>
                  {documentItem.templateUrl ? (
                    <Button
                      component="a"
                      href={documentItem.templateUrl}
                      download
                      variant="text"
                      size="small"
                      sx={{ minWidth: 0, height: 24, px: 0.75, fontWeight: 600 }}
                    >
                      {documentItem.templateLabel ?? '模板下载'}
                    </Button>
                  ) : null}
                  {documentItem.required ? (
                    <Chip
                      label="必填"
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, borderRadius: 1, fontWeight: 600 }}
                    />
                  ) : null}
                  {documentItem.categoryLabel ? (
                    <Chip
                      label={documentItem.categoryLabel}
                      color="secondary"
                      size="small"
                      variant="outlined"
                      sx={{ height: 22, borderRadius: 1, fontWeight: 600 }}
                    />
                  ) : null}
                  <Chip
                    label={isUploaded ? '已上传' : '未上传'}
                    color={isUploaded ? 'success' : 'default'}
                    size="small"
                    sx={{ height: 22, borderRadius: 1, fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {documentItem.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {documentItem.acceptedFormats} · {documentItem.maxSizeLabel}
                </Typography>
              </Stack>
            </Stack>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(documentItem.id, file);
                event.target.value = '';
              }}
            />
            <Button
              variant={isUploaded ? 'outlined' : 'contained'}
              startIcon={<UploadFileOutlined />}
              onClick={() => inputRef.current?.click()}
              sx={{
                ...buttonSx,
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 132 },
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {isUploaded ? '重新上传' : '上传文件'}
            </Button>
          </Stack>

          {isUploaded ? (
            <Paper
              variant="outlined"
              sx={(theme) => ({
                p: theme.spacing(1.5),
                borderRadius: 1,
                bgcolor: alpha(theme.palette.success.main, 0.035),
              })}
            >
              <Stack spacing={1.25} sx={{ minWidth: 0 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={1.5}
                  sx={{ minWidth: 0 }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                    <InsertDriveFileOutlined sx={{ color: 'text.secondary', fontSize: 18, flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        title={fileName}
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileSize)} · 上传完成
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    color="inherit"
                    startIcon={<DeleteOutline />}
                    onClick={() => onDelete(documentItem.id)}
                    sx={{
                      minWidth: 72,
                      height: 32,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                    }}
                  >
                    删除
                  </Button>
                </Stack>
                <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 1 }} />
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DocumentUploadStep({ selectedBroker, uploadedDocuments, onUpload, onDelete, onBack, onNext }) {
  const requiredDocuments = getDocumentItems(selectedBroker);
  const completedCount = requiredDocuments.filter((documentItem) => uploadedDocuments[documentItem.id]?.status === 'uploaded').length;
  const allUploaded = requiredDocuments.length > 0 && completedCount === requiredDocuments.length;

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent sx={(theme) => ({ p: { xs: theme.spacing(2.5), md: theme.spacing(3) }, '&:last-child': { pb: { xs: theme.spacing(2.5), md: theme.spacing(3) } } })}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2.5}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.75 }}>
                  上传开户资料
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                  请根据所选券商要求上传完整文件，FIDERE Trust 将协助进行预审并提交券商审核。
                </Typography>
              </Box>

              <Chip
                color="primary"
                variant="outlined"
                label="Step 3 of 4"
                sx={{ fontWeight: 600, alignSelf: { xs: 'flex-start', md: 'center' }, whiteSpace: 'nowrap' }}
              />
            </Stack>

            <Divider />

            <Box sx={{ overflowX: { xs: 'auto', sm: 'visible' }, pb: { xs: 0.5, sm: 0 } }}>
              <Stepper
                activeStep={2}
                sx={(theme) => ({
                  minWidth: { xs: 520, sm: 'auto' },
                  '& .MuiStepLabel-label': {
                    ...theme.typography.caption,
                    mt: 0.5,
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: 18,
                  },
                })}
              >
                {brokerSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 3,
          alignItems: 'flex-start',
          '@media (min-width:900px)': {
            gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          },
        }}
      >
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Stack spacing={2.5}>
            <UploadInstructionCard />
            <UploadProgressCard completedCount={completedCount} totalCount={requiredDocuments.length} />

            <Stack spacing={1}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  资料任务列表
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedBroker.name} 当前需要 {requiredDocuments.length} 项必填资料。
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              {requiredDocuments.map((documentItem) => (
                <UploadDocumentCard
                  key={documentItem.id}
                  documentItem={documentItem}
                  uploadedFile={uploadedDocuments[documentItem.id]}
                  onUpload={onUpload}
                  onDelete={onDelete}
                />
              ))}
            </Stack>

            <UploadActionBar allUploaded={allUploaded} onBack={onBack} onNext={onNext} />
          </Stack>
        </Box>

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Stack spacing={2.5}>
            <UploadSummaryCard
              selectedBroker={selectedBroker}
              completedCount={completedCount}
              totalCount={requiredDocuments.length}
              canProceed={allUploaded}
              onNext={onNext}
            />

            <Alert severity="info">
              FIDERE Trust 将协助完成资料预审、券商对接与开户进度更新。
            </Alert>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export function UploadSummaryCard({ selectedBroker, completedCount, totalCount, canProceed, onNext }) {
  const progressValue = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card
      variant="outlined"
      sx={{
        '@media (min-width:900px)': {
          position: 'sticky',
          top: 96,
        },
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={(theme) => ({ p: theme.spacing(3) })}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                已选择券商
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary.main"
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={selectedBroker.name}
              >
                {selectedBroker.name}
              </Typography>
            </Box>
            <Chip label="STEP 3/4" size="small" sx={{ fontWeight: 600, flexShrink: 0 }} />
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.5} sx={(theme) => ({ p: theme.spacing(3) })}>
          <SummaryRow label="开户行政费" value={formatFee(selectedBroker)} strong />
          <SummaryRow label="预计处理时间" value={selectedBroker.processingTime} />
          <SummaryRow label="账户类型" value={accountType} />
        </Stack>

        <Divider />

        <Stack spacing={1.25} sx={(theme) => ({ p: theme.spacing(3) })}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              资料完成进度
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {completedCount}/{totalCount} 已上传
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={(theme) => ({
              height: 8,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
            })}
          />
        </Stack>

        <Divider />

        <Box sx={(theme) => ({ p: theme.spacing(3), display: 'none', '@media (min-width:900px)': { display: 'block' } })}>
          <Button
            variant="contained"
            fullWidth
            disabled={!canProceed}
            onClick={onNext}
            sx={{ ...submitButtonSx, fontWeight: 600 }}
          >
            下一步：提交审核
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export function UploadActionBar({ allUploaded, onBack, onNext }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        p: theme.spacing(2),
        mt: theme.spacing(3),
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
        '@media (max-width:899.95px)': {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
      })}
    >
      <Button variant="outlined" onClick={onBack} sx={{ ...buttonSx, width: '100%', '@media (min-width:900px)': { width: 'auto' } }}>
        上一步
      </Button>
      <Button
        variant="contained"
        disabled={!allUploaded}
        onClick={onNext}
        sx={{
          ...submitButtonSx,
          display: 'inline-flex',
          width: '100%',
          '@media (min-width:900px)': {
            display: 'none',
          },
        }}
      >
        下一步：提交审核
      </Button>
    </Paper>
  );
}

export function ReviewSubmitStep({
  selectedBroker,
  uploadedDocuments,
  submitConfirmed,
  onSubmitConfirmedChange,
  onBack,
  onSubmit,
}) {
  const uploadedFiles = getDocumentItems(selectedBroker).map((documentItem) => ({
    documentName: documentItem.name,
    file: uploadedDocuments[documentItem.id],
  }));

  return (
    <SectionCard title="提交开户申请" description="请在提交前核对以下开户申请信息。">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="选择券商" value={selectedBroker.name} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="申请人账户类型" value={accountType} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="开户费用"
            value={`${selectedBroker.fee} ${selectedBroker.feeCurrency}`}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="预计处理时间" value={selectedBroker.processingTime} fullWidth InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2), borderRadius: 2 })}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            已上传文件
          </Typography>
          <Divider />
          {uploadedFiles.map(({ documentName, file }) => (
            <Stack key={documentName} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {documentName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: 'right',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={getUploadedFileName(file)}
              >
                {getUploadedFileName(file) || '-'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      <FormControlLabel
        control={
          <Checkbox checked={submitConfirmed} onChange={(event) => onSubmitConfirmedChange(event.target.checked)} />
        }
        label={
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            我确认以上资料真实、完整，并授权 FIDERE Trust 协助提交券商开户申请。
          </Typography>
        }
        sx={confirmationControlSx}
      />

      <Divider />

      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Button variant="outlined" onClick={onBack} sx={buttonSx}>
          上一步
        </Button>
        <Button variant="contained" disabled={!submitConfirmed} onClick={onSubmit} sx={buttonSx}>
          提交审核
        </Button>
      </Stack>
    </SectionCard>
  );
}

const reviewProgressSteps = [
  {
    title: '申请已提交',
    status: 'completed',
    description: 'FIDERE Trust 已收到开户申请与基础资料。',
  },
  {
    title: '初步审核',
    status: 'active',
    description: 'FIDERE Trust 正在进行资料预审。期间无需继续操作开户流程。',
  },
  {
    title: '开户完成',
    status: 'pending',
    description: '开户完成后，我们会更新账户开通结果与后续指引。',
  },
];

const progressSteps = {
  under_review: reviewProgressSteps,
  rejected: [
    {
      title: '申请已提交',
      status: 'completed',
      description: 'FIDERE Trust 已收到开户申请与基础资料。',
    },
    {
      title: '初步审核',
      status: 'completed',
      description: '团队已完成资料初审，并确认有部分资料需要补充。',
    },
    {
      title: '已拒绝',
      status: 'active',
      description: '请根据拒绝原因上传补充文件，提交后我们会重新审核。',
    },
    {
      title: '重新审核',
      status: 'pending',
      description: '补充资料提交后，FIDERE Trust 会重新核对并同步至券商。',
    },
    {
      title: '开户完成',
      status: 'pending',
      description: '审核与券商开户完成后，我们会更新账户开通结果。',
    },
  ],
};

const progressStatusContent = {
  under_review: {
    chipLabel: 'Pending Review / 审核中',
    currentStage: '初步审核',
    description: '当前状态为 Pending Review。我们会在预计 3–7 个工作日内完成初步审核，并通过 FIDERE Trust 更新处理结果。',
    nextStep: '暂时无需补充资料。如初步审核发现资料需要更新，我们会联系您确认并重新上传。',
    updateTime: '预计 3–7 个工作日内更新。审核完成后，页面状态将同步为券商审核或开户完成。',
  },
};

const fallbackProgressStatus = 'under_review';

function ProgressStepItem({ step, index }) {
  const isCompleted = step.status === 'completed';
  const isActive = step.status === 'active';

  return (
    <Stack direction="row" spacing={1.75} alignItems="flex-start">
      <Box
        sx={(theme) => ({
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: isCompleted || isActive ? alpha(theme.palette.primary.main, 0.1) : theme.palette.action.hover,
          color: isCompleted || isActive ? 'primary.main' : 'text.secondary',
          border: `1px solid ${
            isCompleted || isActive ? alpha(theme.palette.primary.main, 0.36) : theme.palette.divider
          }`,
          fontSize: 13,
          fontWeight: 700,
        })}
      >
        {isCompleted ? <CheckCircleOutline sx={{ fontSize: 18 }} /> : index + 1}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {step.title}
          </Typography>
          {isActive ? <Chip label="进行中" color="primary" size="small" sx={{ height: 22, borderRadius: 1, fontWeight: 600 }} /> : null}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {step.description}
        </Typography>
      </Box>
    </Stack>
  );
}

export function ActionRequiredPage({
  application,
  selectedBroker,
  documents,
  uploadedDocuments,
  onUpload,
  onDelete,
  onSubmit,
}) {
  const completedCount = documents.filter((documentItem) => uploadedDocuments[documentItem.id]?.status === 'uploaded').length;
  const allUploaded = documents.length > 0 && completedCount === documents.length;

  return (
    <Stack spacing={3}>
      <Card variant="outlined" sx={cardSx}>
        <CardContent
          sx={(theme) => ({
            p: { xs: theme.spacing(3), md: theme.spacing(4) },
            '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4) } },
          })}
        >
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  已拒绝
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
                  当前开户申请已被拒绝。请查看拒绝原因，上传补充资料后重新提交审核。
                </Typography>
              </Box>
              <Chip
                color="warning"
                variant="outlined"
                label={application.statusLabel ?? 'Rejected / 已拒绝'}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, fontWeight: 600 }}
              />
            </Stack>

            <Paper
              variant="outlined"
              sx={(theme) => ({
                p: theme.spacing(2.5),
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.04),
                borderColor: alpha(theme.palette.warning.main, 0.24),
              })}
            >
              <Stack spacing={1.5}>
                <SummaryRow label="申请编号" value={application.applicationId} strong />
                <SummaryRow label="券商名称" value={application.brokerName} />
                <SummaryRow label="当前阶段" value="已拒绝" />
                <SummaryRow label="原提交时间" value={application.submittedAt} />
              </Stack>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2.5}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            补充资料
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedBroker.name} 当前需要补充 {documents.length} 项资料。全部上传后即可重新提交审核。
          </Typography>
        </Box>

        <Stack spacing={2}>
          {documents.map((documentItem) => (
            <UploadDocumentCard
              key={documentItem.id}
              documentItem={documentItem}
              uploadedFile={uploadedDocuments[documentItem.id]}
              onUpload={onUpload}
              onDelete={onDelete}
            />
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            p: theme.spacing(2),
            borderRadius: 1,
            bgcolor: theme.palette.background.paper,
          })}
        >
          <Typography variant="body2" color="text.secondary">
            已上传 {completedCount}/{documents.length} 项补充资料
          </Typography>
          <Button variant="contained" disabled={!allUploaded} onClick={onSubmit} sx={submitButtonSx}>
            重新提交补充资料
          </Button>
        </Paper>
      </Stack>
    </Stack>
  );
}

export function ActionRequiredSidebar({ documents }) {
  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.5), borderRadius: 2 })}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            拒绝原因
          </Typography>
          <Divider />
          {documents.map((documentItem) => (
            <Box key={documentItem.id}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {documentItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {documentItem.reason}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.5), borderRadius: 2 })}>
        <Stack spacing={2.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            处理时间线
          </Typography>
          {progressSteps.rejected.map((step, index) => (
            <ProgressStepItem key={step.title} step={step} index={index} />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

export function ApplicationProgressPage({ application, status = 'under_review', onBackToResult, onBackToAccounts }) {
  const progressStatus = progressStatusContent[status] ? status : fallbackProgressStatus;
  const content = progressStatusContent[progressStatus];
  const steps = progressSteps[progressStatus];
  const showActions = Boolean(onBackToAccounts || onBackToResult);

  return (
    <Card variant="outlined" sx={cardSx}>
      <CardContent
        sx={(theme) => ({
          p: { xs: theme.spacing(3), md: theme.spacing(4) },
          '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4) } },
        })}
      >
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                申请进度
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
                {content.description}
              </Typography>
            </Box>
            <Chip
              color="primary"
              variant="outlined"
              label={application.statusLabel ?? content.chipLabel}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, fontWeight: 600 }}
            />
          </Stack>

          <Paper
            variant="outlined"
            sx={(theme) => ({
              p: theme.spacing(2.5),
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.025),
            })}
          >
            <Stack spacing={1.5}>
              <SummaryRow label="申请编号" value={application.applicationId} strong />
              <SummaryRow label="券商名称" value={application.brokerName} />
              <SummaryRow label="账户类型" value={accountType} />
              <SummaryRow label="当前阶段" value={content.currentStage} />
              <SummaryRow label="提交时间" value={application.submittedAt} />
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              处理时间线
            </Typography>
            <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.5), borderRadius: 2 })}>
              <Stack spacing={2.5}>
                {steps.map((step, index) => (
                  <ProgressStepItem key={step.title} step={step} index={index} />
                ))}
              </Stack>
            </Paper>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.25), height: '100%', borderRadius: 2 })}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  下一步
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {content.nextStep}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.25), height: '100%', borderRadius: 2 })}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  更新时间
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {content.updateTime}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {showActions ? (
            <>
              <Divider />

              <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                {onBackToAccounts ? (
                  <Button variant="outlined" onClick={onBackToAccounts} sx={buttonSx}>
                    返回账户页
                  </Button>
                ) : (
                  <Box />
                )}
                {onBackToResult ? (
                  <Button variant="contained" onClick={onBackToResult} sx={buttonSx}>
                    返回提交结果
                  </Button>
                ) : null}
              </Stack>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function SuccessState({ application, onBackToAccounts, onViewProgress }) {
  return (
    <Card variant="outlined">
      <CardContent sx={(theme) => ({ p: { xs: theme.spacing(3), md: theme.spacing(4) }, '&:last-child': { pb: { xs: theme.spacing(3), md: theme.spacing(4) } } })}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Box
            sx={(theme) => ({
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              color: theme.palette.success.main,
              bgcolor: alpha(theme.palette.success.main, 0.1),
            })}
          >
            <CheckCircleOutline sx={{ fontSize: 30 }} />
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              开户申请已提交
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
              FIDERE Trust 已收到您的券商开户申请，我们将进行初步审核，并在 3–7 个工作日内更新处理进度。
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={(theme) => ({
              width: '100%',
              maxWidth: 560,
              p: theme.spacing(2.5),
              borderRadius: 2,
              textAlign: 'left',
            })}
          >
            <Stack spacing={1.5}>
              <SummaryRow label="申请编号" value={application.applicationId} strong />
              <SummaryRow label="券商名称" value={application.brokerName} />
              <SummaryRow label="账户类型" value={accountType} />
              <SummaryRow label="当前状态" value="Pending Review" />
              <SummaryRow label="提交时间" value={application.submittedAt} />
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button variant="outlined" onClick={onBackToAccounts} sx={buttonSx}>
              返回账户页
            </Button>
            <Button variant="contained" onClick={onViewProgress} sx={buttonSx}>
              查看申请进度
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
