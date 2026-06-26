import ibkrLogo from '../assets/ibkr-logo.png';
import webullLogo from '../assets/webull-logo.png';

export const brokerSteps = ['选择券商', '确认费用', '上传资料', '提交审核'];

export const brokerDocumentRequirements = {
  ibkr: [
    {
      id: 'addressProof',
      name: '地址证明',
      description: '请上传近 3 个月内显示申请人姓名和居住地址的文件。',
      required: true,
      acceptedFormats: 'PDF / JPG / PNG',
      maxSizeLabel: '单个文件不超过 10MB',
    },
  ],
  webull: [
    {
      id: 'basicAccountInfo',
      name: '账户基础资料',
      description: '用于确认开户人身份、联系方式及账户基础信息。',
      templateUrl: '/templates/sub-account-opening-form-trust.docx',
      templateLabel: '模板下载',
      required: true,
      acceptedFormats: 'PDF / JPG / PNG',
      maxSizeLabel: '单个文件不超过 10MB',
    },
    {
      id: 'w8BenForm',
      name: 'W8-BEN 表格',
      description: '请上传已通过第三方签署平台完成签署的 W8-BEN 表格。',
      categoryLabel: '第三方签署文档',
      required: true,
      acceptedFormats: 'PDF / JPG / PNG',
      maxSizeLabel: '单个文件不超过 10MB',
    },
    {
      id: 'crsControllingPersonForm',
      name: 'CRS-Controlling Person 表格',
      description: '请上传已通过第三方签署平台完成签署的 CRS-Controlling Person 表格。',
      categoryLabel: '第三方签署文档',
      required: true,
      acceptedFormats: 'PDF / JPG / PNG',
      maxSizeLabel: '单个文件不超过 10MB',
    },
  ],
};

export const brokers = [
  {
    id: 'ibkr',
    name: 'IBKR 盈透证券',
    shortName: 'IBKR',
    logoSrc: ibkrLogo,
    logoAlt: 'IBKR',
    tags: ['全球市场', '官网'],
    description: '适合需要配置多市场资产、股票、ETF、债券及其他投资产品的客户。',
    markets: ['美股', '港股', '全球市场'],
    requiredDocuments: ['地址证明'],
    fee: 100,
    feeCurrency: 'USD',
    processingTime: '3–7 个工作日',
    status: '可选择',
  },
  {
    id: 'webull',
    name: 'Webull 微牛证券',
    shortName: 'Webull',
    logoSrc: webullLogo,
    logoAlt: 'Webull',
    tags: ['流程便捷', '官网'],
    description: '适合希望通过线上签署文件完成开户准备的客户。',
    markets: ['美股', '港股'],
    requiredDocuments: ['账户基础资料', 'W8-BEN 表格', 'CRS-Controlling Person 表格'],
    fee: 100,
    feeCurrency: 'USD',
    processingTime: '3–7 个工作日',
    status: '可选择',
  },
];

export const accountType = '现金账户';
