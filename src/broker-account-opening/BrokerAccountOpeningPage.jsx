import React, { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ApplicationSummary,
  BrokerCard,
  BrokerStepper,
  DocumentUploadStep,
  FeeConfirmationStep,
  ReviewSubmitStep,
  SuccessState,
} from './components';
import { brokerSteps, brokers } from './brokers';

const nextLabels = ['下一步：确认费用', '下一步：上传资料', '下一步：提交审核', '提交审核'];

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

export default function BrokerAccountOpeningPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBrokerId, setSelectedBrokerId] = useState('');
  const [feeConfirmed, setFeeConfirmed] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [submitConfirmed, setSubmitConfirmed] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const selectedBroker = useMemo(
    () => brokers.find((broker) => broker.id === selectedBrokerId) ?? null,
    [selectedBrokerId],
  );

  const allDocumentsUploaded = useMemo(() => {
    if (!selectedBroker) return false;
    return selectedBroker.requiredDocuments.every((documentName) => uploadedDocuments[documentName]);
  }, [selectedBroker, uploadedDocuments]);

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

  const handleUpload = (documentName, file) => {
    setUploadedDocuments((current) => ({
      ...current,
      [documentName]: {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    }));
  };

  const handleDeleteUpload = (documentName) => {
    setUploadedDocuments((current) => {
      const next = { ...current };
      delete next[documentName];
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
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedBrokerId('');
    setFeeConfirmed(false);
    setUploadedDocuments({});
    setSubmitConfirmed(false);
    setSubmittedApplication(null);
  };

  const handleViewProgress = () => {
    return undefined;
  };

  const renderStepContent = () => {
    if (submittedApplication) {
      return (
        <SuccessState
          application={submittedApplication}
          onBackToAccounts={handleReset}
          onViewProgress={handleViewProgress}
        />
      );
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
              sx={{ minWidth: 160, height: 46, whiteSpace: 'nowrap', lineHeight: 1 }}
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

  return (
    <Container maxWidth="lg" sx={(theme) => ({ py: { xs: theme.spacing(2.5), md: theme.spacing(4) } })}>
      <Stack spacing={3}>
        {!submittedApplication ? <BrokerStepper activeStep={activeStep} /> : null}

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>{renderStepContent()}</Grid>

          <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
            <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
              <ApplicationSummary
                selectedBroker={selectedBroker}
                activeStep={activeStep}
                canProceed={canProceed}
                nextLabel={nextLabels[activeStep]}
                onNext={activeStep === 3 ? handleSubmit : handleNext}
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
      </Stack>

    </Container>
  );
}
