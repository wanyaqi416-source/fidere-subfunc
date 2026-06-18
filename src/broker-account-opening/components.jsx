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
import { accountType, brokerSteps } from './brokers';

const buttonSx = {
  height: 44,
  minWidth: 140,
  whiteSpace: 'nowrap',
  lineHeight: 1,
  flexShrink: 0,
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

function SectionCard({ title, description, children }) {
  return (
    <Card variant="outlined">
      <CardContent sx={(theme) => ({ p: theme.spacing(3), '&:last-child': { pb: theme.spacing(3) } })}>
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
    <Card variant="outlined">
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
              <QueryBuilder sx={{ color: 'text.secondary', fontSize: 18 }} />
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
                fontSize: 20,
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
                      '& .MuiChip-icon': { fontSize: 14, ml: 0.75 },
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

export function ApplicationSummary({ selectedBroker, activeStep, canProceed, nextLabel, onNext, submittedApplication }) {
  if (submittedApplication) {
    return (
      <Card variant="outlined">
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
    <Card variant="outlined">
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={(theme) => ({ p: theme.spacing(3) })}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                已选择券商
              </Typography>
              <Typography
                variant="subtitle1"
                color={selectedBroker ? 'primary.main' : 'text.secondary'}
                sx={{ mt: 0.5, fontWeight: 600 }}
              >
                {selectedBroker ? selectedBroker.name : '尚未选择'}
              </Typography>
            </Box>
            <Chip label={`STEP ${activeStep + 1}/4`} size="small" sx={{ fontWeight: 600, flexShrink: 0 }} />
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1.5} sx={(theme) => ({ p: theme.spacing(3) })}>
          <SummaryRow label="开户行政费" value={selectedBroker ? formatFee(selectedBroker) : '$100.00'} strong />
          <SummaryRow label="预计处理时间" value={selectedBroker?.processingTime ?? '3–7 个工作日'} />
          <SummaryRow label="账户类型" value={accountType} />
        </Stack>

        <Divider />

        <Box sx={(theme) => ({ p: theme.spacing(3) })}>
          {!selectedBroker ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              请选择一家券商继续。
            </Typography>
          ) : null}
          <Button
            variant="contained"
            fullWidth
            disabled={!canProceed}
            onClick={onNext}
            sx={{ height: 46, whiteSpace: 'nowrap', lineHeight: 1, fontWeight: 600 }}
          >
            {nextLabel}
          </Button>
        </Box>
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
      description="请确认本次券商账户开通所涉及的一次性行政处理费用。"
    >
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: theme.spacing(2.5),
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.025),
        })}
      >
        <Stack spacing={2}>
          <SummaryRow label="选择券商" value={selectedBroker.name} />
          <SummaryRow label="开户行政费" value={`${selectedBroker.fee} ${selectedBroker.feeCurrency}`} strong />
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

      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Button variant="outlined" onClick={onBack} sx={buttonSx}>
          上一步
        </Button>
        <Button variant="contained" disabled={!feeConfirmed} onClick={onNext} sx={buttonSx}>
          下一步：上传资料
        </Button>
      </Stack>
    </SectionCard>
  );
}

export function UploadDocumentCard({ documentName, uploadedFile, onUpload, onDelete }) {
  const inputRef = useRef(null);

  return (
    <Card variant="outlined">
      <CardContent sx={(theme) => ({ p: theme.spacing(2.5), '&:last-child': { pb: theme.spacing(2.5) } })}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
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
                <DescriptionOutlined fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {documentName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF / JPG / PNG，单个文件不超过 10MB
                </Typography>
              </Box>
            </Stack>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(documentName, file);
                event.target.value = '';
              }}
            />
            <Button
              variant={uploadedFile ? 'outlined' : 'contained'}
              startIcon={<UploadFileOutlined />}
              onClick={() => inputRef.current?.click()}
              sx={buttonSx}
            >
              {uploadedFile ? '重新上传' : '上传文件'}
            </Button>
          </Stack>

          {uploadedFile ? (
            <Paper variant="outlined" sx={(theme) => ({ p: theme.spacing(1.5), borderRadius: 1 })}>
              <Stack spacing={1.25}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                    <InsertDriveFileOutlined sx={{ color: 'text.secondary', fontSize: 22, flexShrink: 0 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(uploadedFile.size)} · Uploaded
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    color="inherit"
                    startIcon={<DeleteOutline />}
                    onClick={() => onDelete(documentName)}
                    sx={{ minWidth: 88, height: 36, whiteSpace: 'nowrap', flexShrink: 0 }}
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
  const requiredDocuments = selectedBroker.requiredDocuments;
  const completedCount = requiredDocuments.filter((documentName) => uploadedDocuments[documentName]).length;
  const allUploaded = completedCount === requiredDocuments.length;

  return (
    <SectionCard title="上传开户资料" description={`请根据 ${selectedBroker.name} 的要求上传开户审核资料。`}>
      <Alert severity="info">
        所有文件将用于券商开户审核，请确保资料真实、清晰、有效。
      </Alert>

      <Stack spacing={2}>
        {requiredDocuments.map((documentName) => (
          <UploadDocumentCard
            key={documentName}
            documentName={documentName}
            uploadedFile={uploadedDocuments[documentName]}
            onUpload={onUpload}
            onDelete={onDelete}
          />
        ))}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="caption" color="text.secondary">
          已完成 {completedCount}/{requiredDocuments.length} 项必填资料
        </Typography>
        <Chip
          size="small"
          color={allUploaded ? 'success' : 'default'}
          label={allUploaded ? '资料已完整' : '等待上传'}
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <Divider />

      <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Button variant="outlined" onClick={onBack} sx={buttonSx}>
          上一步
        </Button>
        <Button variant="contained" disabled={!allUploaded} onClick={onNext} sx={buttonSx}>
          下一步：提交审核
        </Button>
      </Stack>
    </SectionCard>
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
  const uploadedFiles = selectedBroker.requiredDocuments.map((documentName) => ({
    documentName,
    file: uploadedDocuments[documentName],
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
              <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }}>
                {file?.name ?? '-'}
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
            <CheckCircleOutline sx={{ fontSize: 38 }} />
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
