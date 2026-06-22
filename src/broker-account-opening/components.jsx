import React, { useRef } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
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
import { accountType, brokerDocumentRequirements, brokerSteps } from './brokers';

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
            <SummaryRow label="当前状态" value="Pending Review" />
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
        sx={{ alignItems: 'flex-start', m: 0 }}
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
                  {documentItem.required ? (
                    <Chip
                      label="必填"
                      color="primary"
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
        sx={{ alignItems: 'flex-start', m: 0 }}
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

const progressSteps = [
  {
    title: '申请已提交',
    status: 'completed',
    description: 'FIDERE Trust 已收到开户申请与基础资料。',
  },
  {
    title: '初步审核',
    status: 'active',
    description: '团队正在核对资料完整性，并确认券商开户要求。',
  },
  {
    title: '券商审核',
    status: 'pending',
    description: '资料通过预审后，将提交至券商进行账户开立审核。',
  },
  {
    title: '开户完成',
    status: 'pending',
    description: '审核完成后，我们会更新账户开通结果与后续指引。',
  },
];

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

export function ApplicationProgressPage({ application, onBackToResult, onBackToAccounts }) {
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
                当前状态为 Pending Review。我们会在预计 3–7 个工作日内完成初步审核，并通过 FIDERE Trust 更新处理结果。
              </Typography>
            </Box>
            <Chip
              color="primary"
              variant="outlined"
              label="Pending Review"
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
              <SummaryRow label="当前阶段" value="初步审核" />
              <SummaryRow label="提交时间" value={application.submittedAt} />
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              处理时间线
            </Typography>
            <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.5), borderRadius: 2 })}>
              <Stack spacing={2.5}>
                {progressSteps.map((step, index) => (
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
                  暂时无需补充资料。如初步审核发现资料需要更新，我们会联系您确认并重新上传。
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(2.25), height: '100%', borderRadius: 2 })}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  更新时间
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  预计 3–7 个工作日内更新。审核完成后，页面状态将同步为券商审核或开户完成。
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider />

          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
            <Button variant="outlined" onClick={onBackToAccounts} sx={buttonSx}>
              返回账户页
            </Button>
            <Button variant="contained" onClick={onBackToResult} sx={buttonSx}>
              返回提交结果
            </Button>
          </Stack>
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
