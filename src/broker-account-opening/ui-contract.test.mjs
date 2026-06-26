import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const brokersSource = readFileSync(new URL('./brokers.js', import.meta.url), 'utf8');
const componentsSource = readFileSync(new URL('./components.jsx', import.meta.url), 'utf8');
const themeSource = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../App.jsx', import.meta.url), 'utf8');
const pageSource = readFileSync(new URL('./BrokerAccountOpeningPage.jsx', import.meta.url), 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`export function ${name}`);
  assert.notEqual(start, -1, `${name} should exist`);
  const nextExport = source.indexOf('\nexport function ', start + 1);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

test('broker steps match the fee confirmation flow', () => {
  assert.match(
    brokersSource,
    /brokerSteps\s*=\s*\[\s*'选择券商',\s*'确认费用',\s*'上传资料',\s*'提交审核'\s*\]/,
  );
});

test('fee confirmation step owns the only primary continue CTA', () => {
  const feeStepSource = extractFunction(componentsSource, 'FeeConfirmationStep');

  assert.match(feeStepSource, /确认开户费用/);
  assert.match(feeStepSource, /确认并继续上传资料/);
  assert.match(feeStepSource, /disabled=\{!feeConfirmed\}/);
  assert.match(feeStepSource, /position:\s*\{ xs:\s*'fixed'/);
  assert.match(feeStepSource, /bottom:\s*\{ xs:\s*0/);
  assert.match(componentsSource, /const buttonSx = \{\s*height:\s*40,/);
});

test('application summary is informational and does not render a next button', () => {
  const summarySource = extractFunction(componentsSource, 'ApplicationSummary');

  assert.match(summarySource, /已选择券商/);
  assert.match(summarySource, /开户行政费/);
  assert.match(summarySource, /预计处理时间/);
  assert.match(summarySource, /账户类型/);
  assert.match(summarySource, /当前步骤/);
  assert.doesNotMatch(summarySource, /canProceed|nextLabel|onNext/);
  assert.doesNotMatch(summarySource, /<Button/);
});

test('submitted applications render a read-only progress tracking page', () => {
  const progressSource = extractFunction(componentsSource, 'ApplicationProgressPage');

  assert.match(pageSource, /readOnlyProgressStatuses\s*=\s*new Set\(\['under_review', 'opening'\]\)/);
  assert.match(pageSource, /<ApplicationProgressPage/);
  assert.doesNotMatch(pageSource, /<SuccessState/);
  assert.doesNotMatch(pageSource, /setSubmittedView/);
  assert.match(progressSource, /申请进度/);
  assert.match(componentsSource, /Pending Review \/ 审核中/);
  assert.match(componentsSource, /Opening in Progress \/ 开户中/);
  assert.match(componentsSource, /初步审核/);
  assert.match(componentsSource, /预计 3–7 个工作日/);
  assert.match(progressSource, /showActions/);
});

test('not opened account status owns the broker opening flow entry', () => {
  assert.match(appSource, /value:\s*'not_opened'/);
  assert.match(appSource, /label:\s*'未开通'/);
  assert.match(appSource, /const \[accountStatus,\s*setAccountStatus\]\s*=\s*useState\('not_opened'\)/);
  assert.match(pageSource, /BrokerAccountOpeningPage\(\{ accountStatus = 'not_opened' \}\)/);
  assert.match(pageSource, /const \[activeStep,\s*setActiveStep\]\s*=\s*useState\(0\)/);
  assert.doesNotMatch(pageSource, /readOnlyProgressStatuses\s*=\s*new Set\(\['under_review', 'opening', 'not_opened'\]\)/);
});

test('action required status shows return reasons and supplemental resubmission', () => {
  const actionRequiredSource = extractFunction(componentsSource, 'ActionRequiredPage');

  assert.match(pageSource, /accountStatus === 'action_required'/);
  assert.match(pageSource, /supplementalDocumentRequirements/);
  assert.match(pageSource, /<ActionRequiredPage/);
  assert.match(actionRequiredSource, /退回原因/);
  assert.match(actionRequiredSource, /补充资料/);
  assert.match(actionRequiredSource, /重新提交补充资料/);
  assert.match(actionRequiredSource, /disabled=\{!allUploaded\}/);
  assert.match(componentsSource, /title:\s*'需补充资料'/);
  assert.match(componentsSource, /title:\s*'重新审核'/);
});

test('header exposes all broker account status preview states', () => {
  assert.match(appSource, /const \[accountStatus,\s*setAccountStatus\]\s*=\s*useState\('not_opened'\)/);
  assert.match(appSource, /value:\s*'not_opened'/);
  assert.match(appSource, /value:\s*'opening'/);
  assert.match(appSource, /value:\s*'under_review'/);
  assert.match(appSource, /value:\s*'opened'/);
  assert.match(appSource, /value:\s*'action_required'/);
  assert.match(appSource, /账户状态：\{selectedStatus\.label\}/);
});

test('opened account status renders an account overview page', () => {
  const overviewSource = extractFunction(componentsSource, 'BrokerAccountOverviewPage');

  assert.match(pageSource, /accountStatus === 'opened'/);
  assert.match(pageSource, /<BrokerAccountOverviewPage/);
  assert.match(componentsSource, /券商账户已开通/);
  assert.match(componentsSource, /Net Asset Value/);
  assert.match(componentsSource, /资金划转/);
  assert.match(componentsSource, /FIDERE Trust 仅提供账户查看/);
  assert.doesNotMatch(overviewSource, /Buy|Sell|Trade|Order|买入|卖出|下单|交易|充值|提现/);
});

test('confirmation checkbox controls align with their labels', () => {
  assert.match(componentsSource, /const confirmationControlSx = \{/);
  assert.match(componentsSource, /alignItems:\s*'center'/);
  assert.match(componentsSource, /'& \.MuiCheckbox-root':\s*\{\s*p:\s*0/);
  assert.equal((componentsSource.match(/sx=\{confirmationControlSx\}/g) ?? []).length, 2);
  assert.doesNotMatch(componentsSource, /FormControlLabel[\s\S]{0,400}alignItems:\s*'flex-start'/);
});

test('site icon scale is compact', () => {
  assert.match(themeSource, /MuiSvgIcon:\s*\{/);
  assert.match(themeSource, /fontSizeSmall:\s*\{\s*fontSize:\s*18/);
  assert.match(themeSource, /fontSizeMedium:\s*\{\s*fontSize:\s*20/);
  assert.doesNotMatch(componentsSource, /fontSize:\s*(22|38)/);
});
