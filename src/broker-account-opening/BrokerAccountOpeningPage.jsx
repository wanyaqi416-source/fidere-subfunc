import React, { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ActionRequiredPage,
  ActionRequiredSidebar,
  ApplicationSummary,
  ApplicationProgressPage,
  BrokerAccountOverviewPage,
  BrokerCard,
  BrokerStepper,
  DocumentUploadStep,
  FeeConfirmationStep,
  ReviewSubmitStep,
} from './components';
import { brokerDocumentRequirements, brokerSteps, brokers } from './brokers';

const readOnlyProgressStatuses = new Set(['under_review']);

const statusProgressApplications = {
  rejected: {
    applicationId: 'BRK-2026-0001',
    submittedAt: '2026-06-24 09:30',
    progressStatus: 'rejected',
    statusLabel: 'Rejected / 已拒绝',
  },
  under_review: {
    applicationId: 'BRK-2026-0001',
    submittedAt: '2026-06-24 09:30',
    progressStatus: 'under_review',
    statusLabel: 'Pending Review / 审核中',
  },
};

const supplementalDocumentRequirements = [
  {
    id: 'addressProofSupplement',
    name: '地址证明补充文件',
    description: '请上传近 3 个月内显示申请人姓名、完整居住地址和签发日期的地址证明。',
    reason: '原地址证明未显示完整居住地址，券商无法完成地址核验。',
    required: true,
    acceptedFormats: 'PDF / JPG / PNG',
    maxSizeLabel: '单个文件不超过 10MB',
  },
];

const statusAlerts = {
  under_review: {
    severity: 'info',
    title: '开户申请审核中',
    message: '您的开户申请正在审核中，请留意 FIDERE Trust 的后续通知。',
  },
  rejected: {
    severity: 'warning',
    title: '开户申请已拒绝',
    message: '当前开户申请已被退回，请查看拒绝原因并重新提交补充资料。',
  },
};

function formatSubmitTime(date) {
  return new Intl.DateTimeFormat('zh-Hans-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function createApplicationId(date) {
  return `BRK-${date.getFullYear()}-0001`;
}

export default function BrokerAccountOpeningPage({ accountStatus = 'not_opened' }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBrokerId, setSelectedBrokerId] = useState('webull');
  const [feeConfirmed, setFeeConfirmed] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [submitConfirmed, setSubmitConfirmed] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const selectedBroker = useMemo(
    () => brokers.find((broker) => broker.id === selectedBrokerId) ?? null,
    [selectedBrokerId],
  );

  const statusApplication = useMemo(() => {
    const application = statusProgressApplications[accountStatus];
    if (!application) return null;
    return {
      ...application,
      brokerName: selectedBroker?.name ?? brokers[0].name,
    };
  }, [accountStatus, selectedBroker]);

  const allDocumentsUploaded = useMemo(() => {
    if (!selectedBroker) return false;
    const requiredDocuments = brokerDocumentRequirements[selectedBroker.id] ?? [];
    if (requiredDocuments.length === 0) return false;
    return requiredDocuments.every((documentItem) => uploadedDocuments[documentItem.id]?.status === 'uploaded');
  }, [selectedBroker, uploadedDocuments]);

  const allSupplementalDocumentsUploaded = useMemo(() => {
    return supplementalDocumentRequirements.every((documentItem) => uploadedDocuments[documentItem.id]?.status === 'uploaded');
  }, [uploadedDocuments]);

  const canProceed = useMemo(() => {
    if (submittedApplication) return false;
    if (activeStep === 0) return Boolean(selectedBroker);
    if (activeStep === 1) return feeConfirmed;
    if (activeStep === 2) return allDocumentsUploaded;
    if (activeStep === 3) return submitConfirmed;
    return false;
  }, [activeStep, allDocumentsUploaded, feeConfirmed, selectedBroker, submitConfirmed, submittedApplication]);

  const handleSelectBroker = (broker) => {
    setSelectedBrokerId(broker.id);
    setFeeConfirmed(false);
    setUploadedDocuments({});
    setSubmitConfirmed(false);
  };

  const handleNext = () => {
    if (!canProceed || activeStep >= brokerSteps.length - 1) return;
    setActiveStep((current) => current + 1);
  };

  const handleBack = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleUpload = (documentId, file) => {
    setUploadedDocuments((current) => ({
      ...current,
      [documentId]: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
      },
    }));
  };

  const handleDeleteUpload = (documentId) => {
    setUploadedDocuments((current) => {
      const next = { ...current };
      delete next[documentId];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!selectedBroker || !submitConfirmed) return;
    const now = new Date();
    setSubmittedApplication({
      applicationId: createApplicationId(now),
      brokerName: selectedBroker.name,
      submittedAt: formatSubmitTime(now),
      progressStatus: 'under_review',
      statusLabel: 'Pending Review / 审核中',
    });
  };

  const handleResubmitSupplementalDocuments = () => {
    if (!selectedBroker || !allSupplementalDocumentsUploaded) return;
    const now = new Date();
    setSubmittedApplication({
      applicationId: statusApplication?.applicationId ?? createApplicationId(now),
      brokerName: selectedBroker.name,
      submittedAt: formatSubmitTime(now),
      progressStatus: 'under_review',
      statusLabel: 'Pending Review / 审核中',
    });
  };

  if (accountStatus === 'opened') {
    return (
      <Container
        component="main"
        maxWidth={false}
        sx={(theme) => ({
          flex: 1,
          width: '100%',
          maxWidth: 1200,
          pt: { xs: theme.spacing(2.5), md: theme.spacing(4.5) },
          pb: { xs: theme.spacing(8), md: theme.spacing(7) },
        })}
      >
        <BrokerAccountOverviewPage />
      </Container>
    );
  }

  if (accountStatus === 'rejected' && statusApplication) {
    const statusAlert = statusAlerts[accountStatus];

    return (
      <Container
        component="main"
        maxWidth={false}
        sx={(theme) => ({
          flex: 1,
          width: '100%',
          maxWidth: 1200,
          pt: { xs: theme.spacing(2.5), md: theme.spacing(4.5) },
          pb: { xs: theme.spacing(8), md: theme.spacing(7) },
        })}
      >
        <Stack spacing={3}>
          {statusAlert ? (
            <Alert severity={statusAlert.severity}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {statusAlert.title}
              </Typography>
              <Typography variant="body2">{statusAlert.message}</Typography>
            </Alert>
          ) : null}

          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
              {submittedApplication ? (
                <ApplicationProgressPage application={submittedApplication} status={submittedApplication.progressStatus} />
              ) : (
                <ActionRequiredPage
                  application={statusApplication}
                  selectedBroker={selectedBroker}
                  documents={supplementalDocumentRequirements}
                  uploadedDocuments={uploadedDocuments}
                  onUpload={handleUpload}
                  onDelete={handleDeleteUpload}
                  onSubmit={handleResubmitSupplementalDocuments}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                <ApplicationSummary
                  selectedBroker={selectedBroker}
                  activeStep={activeStep}
                  submittedApplication={submittedApplication ?? statusApplication}
                />
                {!submittedApplication ? <ActionRequiredSidebar documents={supplementalDocumentRequirements} /> : null}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (readOnlyProgressStatuses.has(accountStatus) && statusApplication) {
    const statusAlert = statusAlerts[accountStatus];

    return (
      <Container
        component="main"
        maxWidth={false}
        sx={(theme) => ({
          flex: 1,
          width: '100%',
          maxWidth: 1200,
          pt: { xs: theme.spacing(2.5), md: theme.spacing(4.5) },
          pb: { xs: theme.spacing(8), md: theme.spacing(7) },
        })}
      >
        <Stack spacing={3}>
          {statusAlert ? (
            <Alert severity={statusAlert.severity}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {statusAlert.title}
              </Typography>
              <Typography variant="body2">{statusAlert.message}</Typography>
            </Alert>
          ) : null}

          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
              <ApplicationProgressPage application={statusApplication} status={statusApplication.progressStatus} />
            </Grid>

            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                <ApplicationSummary
                  selectedBroker={selectedBroker}
                  activeStep={activeStep}
                  submittedApplication={statusApplication}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  const renderStepContent = () => {
    if (submittedApplication) {
      return <ApplicationProgressPage application={submittedApplication} status={submittedApplication.progressStatus} />;
    }

    if (activeStep === 0) {
      return (
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              选择券商
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              请选择一家券商继续开户流程。不同券商会对应不同的资料要求。
            </Typography>
          </Box>

          {brokers.map((broker) => (
            <BrokerCard
              key={broker.id}
              broker={broker}
              selected={broker.id === selectedBrokerId}
              onSelect={() => handleSelectBroker(broker)}
            />
          ))}

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1.5}>
            <Button
              variant="contained"
              disabled={!selectedBroker}
              onClick={handleNext}
              sx={{ minWidth: 144, height: 40, whiteSpace: 'nowrap', lineHeight: 1 }}
            >
              下一步：确认费用
            </Button>
          </Stack>
        </Stack>
      );
    }

    if (activeStep === 1 && selectedBroker) {
      return (
        <FeeConfirmationStep
          selectedBroker={selectedBroker}
          feeConfirmed={feeConfirmed}
          onFeeConfirmedChange={setFeeConfirmed}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    }

    if (activeStep === 2 && selectedBroker) {
      return (
        <DocumentUploadStep
          selectedBroker={selectedBroker}
          uploadedDocuments={uploadedDocuments}
          onUpload={handleUpload}
          onDelete={handleDeleteUpload}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    }

    if (activeStep === 3 && selectedBroker) {
      return (
        <ReviewSubmitStep
          selectedBroker={selectedBroker}
          uploadedDocuments={uploadedDocuments}
          submitConfirmed={submitConfirmed}
          onSubmitConfirmedChange={setSubmitConfirmed}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      );
    }

    return null;
  };

  const statusAlert = statusAlerts[accountStatus];

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={(theme) => ({
        flex: 1,
        width: '100%',
        maxWidth: 1200,
        pt: { xs: theme.spacing(2.5), md: theme.spacing(4.5) },
        pb: { xs: theme.spacing(14), md: theme.spacing(7) },
      })}
    >
      <Stack spacing={3}>
        {statusAlert ? (
          <Alert severity={statusAlert.severity}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {statusAlert.title}
            </Typography>
            <Typography variant="body2">{statusAlert.message}</Typography>
          </Alert>
        ) : null}

        {!submittedApplication && activeStep !== 2 ? <BrokerStepper activeStep={activeStep} /> : null}

        {!submittedApplication && activeStep === 2 ? (
          renderStepContent()
        ) : (
          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>{renderStepContent()}</Grid>

            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                <ApplicationSummary
                  selectedBroker={selectedBroker}
                  activeStep={activeStep}
                  submittedApplication={submittedApplication}
                />
                {!submittedApplication ? (
                  <Alert severity="info">
                    FIDERE Trust 将协助完成资料预审、券商对接与开户进度更新。
                  </Alert>
                ) : null}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Stack>

    </Container>
  );
}
