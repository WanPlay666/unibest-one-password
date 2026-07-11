// ─── 导入模版示例 ─────────────────────────────────────

import { TYPE_SCHEMAS } from './importSchema'
import type { TypeName } from './importSchema'

/**
 * 导入模版示例 —— 新增页数据字段的"权威示例字典"
 *
 * 每条记录由三部分组成,顺序固定:
 *   1. 顶层固定字段:`type` / `name` / `relatedApps`
 *   2. 业务字段:从该 type 的 `schema.fields` 派生,key 与之一一对应
 *   3. 兜底字段:`account` 仍可作为顶层字段冗余存放,normalizeItem 优先取
 *      `schema.accountField` 对应的值,其次 `raw.account` 兜底
 *
 * 字段 key 必须与 TYPE_SCHEMAS[type].fields[].key 严格一致。
 * 缺示例值时 buildImportTemplate 会用 `示例<label>` 占位,不会留空。
 */
interface TemplateExample {
  /** 记录名称 (用户自定义别名,如 "GitHub"、"我的身份证") */
  name: string
  /** 关联网址 / APP 列表 */
  relatedApps: string[]
  /**
   * 业务字段示例。key 必须是 schema.fields[].key;label 见同位置的 schema。
   * 缺失字段会回落到 `示例<label>`,不阻断模板生成。
   */
  fields: Record<string, string>
}

const TEMPLATE_EXAMPLES: Record<TypeName, TemplateExample> = {
  // ── 基础登录 (login / categoryId=1) ─────────────────
  login: {
    name: 'GitHub',
    relatedApps: ['github.com'],
    fields: {
      account: 'user@example.com', // 账号
      password: 'your-password',   // 密码
    },
  },

  // ── 身份信息 (identity / categoryId=2) ───────────────
  identity: {
    name: '我的身份证',
    relatedApps: [],
    fields: {
      idType: '身份证',                  // 证件类型
      realName: '张三',                  // 姓名
      idNumber: '110101199001011234',    // 证件号码
      validFrom: '2020-01-01',           // 生效日期 (YYYY-MM-DD)
      validTo: '2030-01-01',             // 失效日期 (YYYY-MM-DD)
      authority: '北京市公安局',           // 签发机关
    },
  },

  // ── 银行支付 (bank / categoryId=3) ───────────────────
  bank: {
    name: '招商银行 (6666)',
    relatedApps: [],
    fields: {
      bankName: '招商银行',              // 银行名称
      cardType: '储蓄卡',                // 卡片类型 (储蓄卡 / 信用卡 / 其它)
      cardNumber: '6225880137666666',    // 卡号
      holderName: '张三',                // 持卡人
      phone: '13800138000',              // 预留手机
      cvv: '123 / 09-28',                // CVV / 有效期 (信用卡专用,可选)
      remark: '工资卡',                   // 备注说明 (可选)
    },
  },

  // ── 社交通讯 (social / categoryId=4) ─────────────────
  social: {
    name: '个人微信',
    relatedApps: [],
    fields: {
      platform: '微信',                  // 平台
      account: 'wxid_abc123',            // 账号
      payPassword: 'pay-pass-123',       // 支付密码
    },
  },

  // ── 车辆信息 (vehicle / categoryId=5) ─────────────────
  vehicle: {
    name: '粤B·XXXXX',
    relatedApps: [],
    fields: {
      plateNumber: '粤B·XXXXX',          // 车牌号
      vin: 'LSGPC52U8AF123456',          // 车辆识别号 (VIN)
      engineNumber: 'ENG123456',         // 发动机号
      registerDate: '2022-03-15',        // 注册日期 (YYYY-MM-DD)
      insurance: '平安保险 PA-2024-001', // 保险信息
      insuranceExpiry: '2025-03-15',     // 保险到期日 (YYYY-MM-DD)
    },
  },

  // ── 企业开票 (business / categoryId=6) ───────────────
  business: {
    name: '我的公司',
    relatedApps: [],
    fields: {
      companyName: '某某科技有限公司',    // 公司全称
      taxId: '91110000123456789X',       // 税号 (统一社会信用代码)
      addressPhone: '北京市朝阳区xxx路 010-12345678', // 地址电话
      bankAccount: '招商银行 6225880137666666',       // 开户行账号
      email: 'billing@example.com',      // 接收发票邮箱
    },
  },

  // ── 医疗社保 (medical / categoryId=7) ────────────────
  medical: {
    name: '个人社保',
    relatedApps: [],
    fields: {
      cardNumber: '1234567890',          // 社保卡号
      password: 'query-pass',            // 查询密码
      fundAccount: 'G123456',            // 公积金账号
      hospital: '北京协和医院',           // 定点医院
    },
  },

  // ── Wi-Fi 网络 (wifi / categoryId=8) ─────────────────
  wifi: {
    name: '家里 WiFi',
    relatedApps: [],
    fields: {
      ssid: 'Home-WiFi-5G',              // 网络名称 (SSID)
      wifiPassword: 'wifi-pass-123',     // Wi-Fi 密码
      adminAccount: 'admin',             // 路由器后台账号
      adminPassword: 'admin-pass',       // 路由器后台密码
    },
  },

  // ── 软件授权 (software / categoryId=9) ───────────────
  software: {
    name: 'JetBrains IDEA',
    relatedApps: [],
    fields: {
      softwareName: 'JetBrains IntelliJ IDEA', // 软件名称
      licenseKey: 'ABCD-1234-EFGH-5678',       // 激活码 / 许可证
      limitation: '1年个人订阅',                 // 限制条件 (可选)
    },
  },
}

/**
 * 生成一份覆盖 9 种 type 的导入模版。
 * 字段 key 全部从 TYPE_SCHEMAS[type].fields 派生 —— Schema 是字段的唯一权威来源,
 * 之后给某个 type 加字段,模板会自动包含;示例值缺失时用 `示例<label>` 兜底。
 *
 * 顶层结构:`{ type, name, <schema.fields 字段...>, relatedApps }`
 *   - `name` 顶层:记录别名,UI 中由 RecordNameCard 输入
 *   - `account`:作为 schema.fields 的字段出现(login / social),
 *                normalizeItem 仍兼容顶层 `account` 兜底
 *   - `relatedApps` 顶层:关联网址 / APP 列表
 */
export function buildImportTemplate(): string {
  const items = Object.values(TYPE_SCHEMAS).map((schema) => {
    const ex: TemplateExample = TEMPLATE_EXAMPLES[schema.type] ?? {
      name: '示例',
      relatedApps: [],
      fields: {},
    }
    const item: Record<string, any> = {
      type: schema.type,
      name: ex.name,
    }
    // 按 schema.fields 顺序填入示例,缺失则用 `示例<label>` 占位
    for (const f of schema.fields) {
      item[f.key] = ex.fields[f.key] ?? `示例${f.label}`
    }
    item.relatedApps = ex.relatedApps
    return item
  })

  return JSON.stringify({ version: '1.0', exportedAt: Date.now(), items }, null, 2)
}
