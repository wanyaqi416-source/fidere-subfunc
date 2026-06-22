import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const brokersSource = readFileSync(new URL('./brokers.js', import.meta.url), 'utf8');
const componentsSource = readFileSync(new URL('./components.jsx', import.meta.url), 'utf8');
const themeSource = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');

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

test('submitted applications can move from success to a progress tracking page', () => {
  const pageSource = readFileSync(new URL('./BrokerAccountOpeningPage.jsx', import.meta.url), 'utf8');
  const progressSource = extractFunction(componentsSource, 'ApplicationProgressPage');

  assert.match(pageSource, /const \[submittedView,\s*setSubmittedView\]\s*=\s*useState\('success'\)/);
  assert.match(pageSource, /setSubmittedView\('progress'\)/);
  assert.match(pageSource, /<ApplicationProgressPage/);
  assert.match(progressSource, /申请进度/);
  assert.match(progressSource, /Pending Review/);
  assert.match(progressSource, /初步审核/);
  assert.match(progressSource, /预计 3–7 个工作日/);
  assert.match(progressSource, /返回提交结果/);
});

test('site icon scale is compact', () => {
  assert.match(themeSource, /MuiSvgIcon:\s*\{/);
  assert.match(themeSource, /fontSizeSmall:\s*\{\s*fontSize:\s*18/);
  assert.match(themeSource, /fontSizeMedium:\s*\{\s*fontSize:\s*20/);
  assert.doesNotMatch(componentsSource, /fontSize:\s*(22|38)/);
});
