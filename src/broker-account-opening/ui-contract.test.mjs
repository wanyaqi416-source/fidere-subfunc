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

test('broker documents include third-party signed tax forms', () => {
  assert.match(brokersSource, /W8-BEN 表格/);
  assert.match(brokersSource, /CRS-Controlling Person 表格/);
  assert.match(brokersSource, /第三方签署文档/);
  assert.match(brokersSource, /templateUrl:\s*'\/templates\/sub-account-opening-form-trust\.docx'/);
  assert.match(brokersSource, /templateLabel:\s*'模板下载'/);
  assert.doesNotMatch(brokersSource, /JCRS-Controlling Person|授权书|风险披露文件/);
  assert.match(componentsSource, /documentItem\.categoryLabel/);
  assert.match(componentsSource, /documentItem\.templateUrl/);
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

test('broker account type is consistently shown as cash account', () => {
  const summarySource = extractFunction(componentsSource, 'ApplicationSummary');
  const progressSource = extractFunction(componentsSource, 'ApplicationProgressPage');
  const reviewSubmitSource = extractFunction(componentsSource, 'ReviewSubmitStep');
  const sidebarSource = extractFunction(componentsSource, 'BrokerAccountSidebar');

  assert.match(brokersSource, /export const accountType = '现金账户'/);
  assert.match(appSource, /现金账户/);
  assert.match(summarySource, /账户类型/);
  assert.match(progressSource, /账户类型/);
  assert.match(reviewSubmitSource, /申请人账户类型/);
  assert.match(sidebarSource, /账户类型/);
  assert.doesNotMatch(`${appSource}\n${brokersSource}\n${componentsSource}`, /Individual Account|INDIVIDUAL ACCOUNT/);
});

test('submitted applications render a read-only progress tracking page', () => {
  const progressSource = extractFunction(componentsSource, 'ApplicationProgressPage');
  const reviewStepsSource = componentsSource.slice(
    componentsSource.indexOf('const reviewProgressSteps = ['),
    componentsSource.indexOf('const progressSteps = {'),
  );

  assert.match(pageSource, /readOnlyProgressStatuses\s*=\s*new Set\(\['under_review'\]\)/);
  assert.match(pageSource, /<ApplicationProgressPage/);
  assert.doesNotMatch(pageSource, /<SuccessState/);
  assert.doesNotMatch(pageSource, /setSubmittedView/);
  assert.match(progressSource, /申请进度/);
  assert.match(componentsSource, /Pending Review \/ 审核中/);
  assert.match(componentsSource, /初步审核/);
  assert.match(reviewStepsSource, /title:\s*'初步审核'[\s\S]*?status:\s*'active'/);
  assert.doesNotMatch(reviewStepsSource, /券商处理/);
  assert.match(componentsSource, /预计 3–7 个工作日/);
  assert.match(progressSource, /showActions/);
});

test('opening status is removed from the account status switcher', () => {
  assert.doesNotMatch(appSource, /value:\s*'opening'/);
  assert.doesNotMatch(appSource, /label:\s*'开户中'/);
  assert.doesNotMatch(pageSource, /progressStatus:\s*'opening'/);
  assert.doesNotMatch(componentsSource, /开户中/);
});

test('not opened account status owns the broker opening flow entry', () => {
  assert.match(appSource, /value:\s*'not_opened'/);
  assert.match(appSource, /label:\s*'未开通'/);
  assert.match(appSource, /const \[accountStatus,\s*setAccountStatus\]\s*=\s*useState\('not_opened'\)/);
  assert.match(pageSource, /BrokerAccountOpeningPage\(\{ accountStatus = 'not_opened' \}\)/);
  assert.doesNotMatch(pageSource, /accountStatus === 'not_opened' && !isOpeningFlow/);
  assert.doesNotMatch(pageSource, /<BrokerAccountListPage accounts=\{\[\]\}/);
  assert.match(pageSource, /const \[activeStep,\s*setActiveStep\]\s*=\s*useState\(0\)/);
  assert.match(pageSource, /<BrokerStepper activeStep=\{activeStep\}/);
  assert.doesNotMatch(pageSource, /readOnlyProgressStatuses\s*=\s*new Set\(\['under_review', 'opening', 'not_opened'\]\)/);
});

test('broker account entry renders a selectable account list first', () => {
  const listSource = extractFunction(componentsSource, 'BrokerAccountListPage');
  const dashboardSource = extractFunction(componentsSource, 'BrokerAccountDashboard');

  assert.match(pageSource, /accountStatus === 'opened'/);
  assert.match(pageSource, /const \[selectedAccount,\s*setSelectedAccount\]\s*=\s*useState\(null\)/);
  assert.match(pageSource, /<BrokerAccountListPage/);
  assert.match(pageSource, /accounts=\{brokerAccountRecords\}/);
  assert.match(pageSource, /selectedAccount \?/);
  assert.match(pageSource, /<BrokerAccountDashboard account=\{selectedAccount\}/);
  assert.doesNotMatch(listSource, /我的券商账户/);
  assert.match(listSource, /accounts\.length === 0/);
  assert.match(listSource, /暂无已开通券商账户/);
  assert.match(listSource, /立即开通券商账户/);
  assert.match(listSource, /accountsByBrokerId = new Map/);
  assert.match(listSource, /brokers\.map/);
  assert.match(listSource, /size=\{\{ xs: 12 \}\}/);
  assert.doesNotMatch(listSource, /size=\{\{ xs: 12, md: 6 \}\}/);
  assert.match(componentsSource, /查看详情/);
  assert.doesNotMatch(listSource, /资金互转/);
  assert.match(componentsSource, /券商账户号码/);
  assert.match(componentsSource, /未开通/);
  assert.match(componentsSource, /brokerId:\s*'ibkr'/);
  assert.match(componentsSource, /brokerId:\s*'webull'/);
  assert.match(dashboardSource, /返回账户列表/);
  assert.doesNotMatch(pageSource, /<BrokerAccountOverviewPage/);
});

test('rejected status shows rejection reasons and supplemental resubmission', () => {
  const actionRequiredSource = extractFunction(componentsSource, 'ActionRequiredPage');
  const actionRequiredSidebarSource = extractFunction(componentsSource, 'ActionRequiredSidebar');

  assert.match(appSource, /value:\s*'rejected'/);
  assert.match(appSource, /label:\s*'已拒绝'/);
  assert.match(pageSource, /accountStatus === 'rejected'/);
  assert.match(pageSource, /supplementalDocumentRequirements/);
  assert.match(pageSource, /<ActionRequiredPage/);
  assert.match(pageSource, /<ActionRequiredSidebar/);
  assert.doesNotMatch(pageSource, /w8BenSupplement|crsControllingPersonSupplement/);
  assert.doesNotMatch(pageSource, /categoryLabel:\s*'第三方签署文档'/);
  assert.match(actionRequiredSource, /已拒绝/);
  assert.match(actionRequiredSidebarSource, /拒绝原因/);
  assert.match(actionRequiredSidebarSource, /处理时间线/);
  assert.doesNotMatch(actionRequiredSource, /处理时间线/);
  assert.doesNotMatch(actionRequiredSource, /ProgressStepItem/);
  assert.match(actionRequiredSource, /补充资料/);
  assert.match(actionRequiredSource, /重新提交补充资料/);
  assert.match(actionRequiredSource, /disabled=\{!allUploaded\}/);
  assert.match(componentsSource, /title:\s*'已拒绝'/);
  assert.match(componentsSource, /title:\s*'重新审核'/);
});

test('header exposes all broker account status preview states', () => {
  assert.match(appSource, /const \[accountStatus,\s*setAccountStatus\]\s*=\s*useState\('not_opened'\)/);
  assert.match(appSource, /value:\s*'not_opened'/);
  assert.match(appSource, /value:\s*'under_review'/);
  assert.match(appSource, /value:\s*'opened'/);
  assert.match(appSource, /value:\s*'rejected'/);
  assert.doesNotMatch(appSource, /value:\s*'opening'/);
  assert.doesNotMatch(appSource, /value:\s*'action_required'/);
  assert.match(appSource, /账户状态：\{selectedStatus\.label\}/);
});

test('opened broker account detail renders an account overview page', () => {
  const dashboardSource = extractFunction(componentsSource, 'BrokerAccountDashboard');
  const sidebarSource = extractFunction(componentsSource, 'BrokerAccountSidebar');
  const transferTableSource = extractFunction(componentsSource, 'RecentTransferTable');
  const transferCardSource = extractFunction(componentsSource, 'InternalTransferCard');
  const transferDialogSource = extractFunction(componentsSource, 'TransferRequestDialog');
  const heroSource = extractFunction(componentsSource, 'BrokerAccountHero');

  assert.match(pageSource, /accountStatus === 'opened'/);
  assert.match(pageSource, /<BrokerAccountDashboard account=\{selectedAccount\}/);
  assert.match(componentsSource, /券商账户已开通/);
  assert.doesNotMatch(dashboardSource, /<BalanceOverview/);
  assert.doesNotMatch(componentsSource, /BalanceMetricCard/);
  assert.doesNotMatch(componentsSource, /Net Asset Value|Available Cash|资金余额/);
  assert.match(dashboardSource, /<BrokerAccountSidebar account=\{account\}/);
  assert.match(sidebarSource, /title="券商账户信息"/);
  assert.match(sidebarSource, /信托账户关联信息/);
  assert.match(componentsSource, /currencies:\s*'USD \/ HKD \/ CNY'/);
  assert.equal((sidebarSource.match(/<AccountOverviewCard/g) ?? []).length, 1);
  assert.match(componentsSource, /资金划转/);
  assert.doesNotMatch(heroSource, /资金互转/);
  assert.match(transferCardSource, /onRequestTransfer\('trustToBroker'\)/);
  assert.match(transferCardSource, /onRequestTransfer\('brokerToTrust'\)/);
  assert.match(dashboardSource, /<InternalTransferCard onRequestTransfer=\{setTransferDirection\}/);
  assert.match(dashboardSource, /<TransferRequestDialog/);
  assert.match(dashboardSource, /account=\{account\}/);
  assert.match(dashboardSource, /initialDirection=\{transferDirection \?\? 'trustToBroker'\}/);
  assert.match(dashboardSource, /资金互转申请已提交，请等待审核/);
  assert.match(transferDialogSource, /maxWidth="md"/);
  assert.match(transferDialogSource, /dialogTitle = directionType === 'trustToBroker'/);
  assert.match(transferDialogSource, /从信托账户转入券商账户/);
  assert.match(transferDialogSource, /从券商账户转出至信托账户/);
  assert.doesNotMatch(transferDialogSource, /<DialogTitle[\s\S]{0,80}>资金互转申请/);
  assert.match(transferDialogSource, /directionType = initialDirection === 'brokerToTrust'/);
  assert.doesNotMatch(transferDialogSource, /setDirectionType/);
  assert.match(transferDialogSource, /label="付款账户"/);
  assert.match(transferDialogSource, /label="收款账户"/);
  assert.doesNotMatch(transferDialogSource, /付款账户类型/);
  assert.doesNotMatch(transferDialogSource, /收款账户类型/);
  assert.doesNotMatch(transferDialogSource, /label="收款账户" value="FIDERE Trust 信托账户"/);
  assert.match(componentsSource, /香港账户/);
  assert.match(componentsSource, /美国账户/);
  assert.match(transferDialogSource, /brokerName\.replace\(\/\\s\+\/g,\s*''\)/);
  assert.match(transferDialogSource, /brokerAccountLabel/);
  assert.match(transferDialogSource, /券商账户号码/);
  assert.match(transferDialogSource, /variant="filled"/);
  assert.match(transferDialogSource, /disableUnderline:\s*true/);
  assert.match(transferDialogSource, /sx=\{brokerReadonlyFieldSx\}/);
  assert.match(
    transferDialogSource,
    /directionType === 'trustToBroker'[\s\S]*label="金额"[\s\S]*directionType === 'trustToBroker'[\s\S]*label="收款账户"[\s\S]*label="券商账户号码"/,
  );
  assert.match(componentsSource, /const brokerReadonlyFieldSx/);
  assert.match(transferDialogSource, /availableCurrencies/);
  assert.match(transferDialogSource, /预计到账金额/);
  assert.match(transferDialogSource, /请输入大于 0 的金额/);
  assert.match(transferDialogSource, /提交审核/);
  assert.match(transferTableSource, /latest three transfer records/);
  assert.match(transferTableSource, /records\.slice\(0,\s*3\)/);
  assert.match(componentsSource, /FIDERE Trust 仅提供账户查看/);
  assert.doesNotMatch(dashboardSource, /<HoldingsOverviewTable/);
  assert.doesNotMatch(dashboardSource, /Buy|Sell|Trade|Order|买入|卖出|下单|交易|充值|提现/);
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
