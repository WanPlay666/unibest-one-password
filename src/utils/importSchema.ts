// 9 种数据类型的 schema 定义与归一化工具
// 每种 type 自描述:语义名 + categoryId + 字段定义 + 名称/账号派生规则

export type TypeName =
  | 'login'
  | 'identity'
  | 'bank'
  | 'social'
  | 'vehicle'
  | 'business'
  | 'medical'
  | 'wifi'
  | 'software'

export interface TypeSchema {
  type: TypeName
  categoryId: string
  title: string
  icon: string
  color: string
  // 自描述字段:label 来自现有 Add 页,key 与 formData 字段同名
  fields: Array<{ key: string, label: string }>
  // 当记录的 name 为空时,从这些字段里按顺序取第一个非空值
  nameFallback: string[]
  // 当记录的 account 为空时,使用此字段
  accountField: string
  // 当记录的 password 为空时,使用此字段
  passwordField: string | null
  // 默认名称(当所有 fallback 字段都为空时)
  defaultName: string
}

export const TYPE_SCHEMAS: Record<TypeName, TypeSchema> = {
  login: {
    type: 'login',
    categoryId: '1',
    title: '基础登录',
    icon: 'i-carbon-password',
    color: 'bg-blue-600',
    fields: [
      { key: 'account', label: '账号' },
      { key: 'password', label: '密码' },
    ],
    nameFallback: ['account'],
    accountField: 'account',
    passwordField: 'password',
    defaultName: '未命名账号',
  },
  identity: {
    type: 'identity',
    categoryId: '2',
    title: '身份信息',
    icon: 'i-carbon-user',
    color: 'bg-indigo-500',
    fields: [
      { key: 'idType', label: '证件类型' },
      { key: 'realName', label: '姓名' },
      { key: 'idNumber', label: '号码' },
      { key: 'validFrom', label: '生效日期' },
      { key: 'validTo', label: '失效日期' },
      { key: 'authority', label: '签发机关' },
    ],
    nameFallback: ['realName'],
    accountField: 'idNumber',
    passwordField: null,
    defaultName: '未命名身份',
  },
  bank: {
    type: 'bank',
    categoryId: '3',
    title: '银行支付',
    icon: 'i-carbon-wallet',
    color: 'bg-emerald-500',
    fields: [
      { key: 'bankName', label: '银行名称' },
      { key: 'cardType', label: '卡片类型' },
      { key: 'cardNumber', label: '卡号' },
      { key: 'holderName', label: '持卡人' },
      { key: 'phone', label: '预留手机' },
      { key: 'cvv', label: 'CVV / 有效期' },
      { key: 'remark', label: '备注说明' },
    ],
    nameFallback: ['bankName'],
    accountField: 'cardNumber',
    passwordField: null,
    defaultName: '未命名银行卡',
  },
  social: {
    type: 'social',
    categoryId: '4',
    title: '社交通讯',
    icon: 'i-carbon-chat',
    color: 'bg-sky-400',
    fields: [
      { key: 'platform', label: '平台' },
      { key: 'account', label: '账号' },
      { key: 'payPassword', label: '密码' },
    ],
    nameFallback: ['platform', 'account'],
    accountField: 'account',
    passwordField: 'payPassword',
    defaultName: '未命名社交账号',
  },
  vehicle: {
    type: 'vehicle',
    categoryId: '5',
    title: '车辆信息',
    icon: 'i-carbon-car',
    color: 'bg-orange-500',
    fields: [
      { key: 'plateNumber', label: '车牌号' },
      { key: 'vin', label: '识别号 (VIN)' },
      { key: 'engineNumber', label: '发动机号' },
      { key: 'registerDate', label: '注册日期' },
      { key: 'insurance', label: '保险信息' },
      { key: 'insuranceExpiry', label: '到期日' },
    ],
    nameFallback: ['plateNumber'],
    accountField: 'plateNumber',
    passwordField: null,
    defaultName: '未命名车辆',
  },
  business: {
    type: 'business',
    categoryId: '6',
    title: '企业开票',
    icon: 'i-carbon-receipt',
    color: 'bg-pink-400',
    fields: [
      { key: 'companyName', label: '公司全称' },
      { key: 'taxId', label: '税号' },
      { key: 'addressPhone', label: '地址电话' },
      { key: 'bankAccount', label: '开户行账号' },
      { key: 'email', label: '接收邮箱' },
    ],
    nameFallback: ['companyName'],
    accountField: 'taxId',
    passwordField: null,
    defaultName: '未命名企业',
  },
  medical: {
    type: 'medical',
    categoryId: '7',
    title: '医疗社保',
    icon: 'i-carbon-stethoscope',
    color: 'bg-red-500',
    fields: [
      { key: 'cardNumber', label: '卡号' },
      { key: 'password', label: '查询密码' },
      { key: 'fundAccount', label: '公积金号' },
      { key: 'hospital', label: '定点医院' },
    ],
    nameFallback: ['cardNumber'],
    accountField: 'cardNumber',
    passwordField: 'password',
    defaultName: '个人社保卡',
  },
  wifi: {
    type: 'wifi',
    categoryId: '8',
    title: 'Wi-Fi 网络',
    icon: 'i-carbon-wifi',
    color: 'bg-violet-500',
    fields: [
      { key: 'ssid', label: '网络名称' },
      { key: 'wifiPassword', label: 'Wi-Fi 密码' },
      { key: 'adminAccount', label: '后台账号' },
      { key: 'adminPassword', label: '后台密码' },
    ],
    nameFallback: ['ssid'],
    accountField: 'ssid',
    passwordField: 'wifiPassword',
    defaultName: '未命名网络',
  },
  software: {
    type: 'software',
    categoryId: '9',
    title: '软件授权',
    icon: 'i-carbon-code',
    color: 'bg-slate-500',
    fields: [
      { key: 'softwareName', label: '软件名称' },
      { key: 'licenseKey', label: '激活码' },
      { key: 'limitation', label: '限制条件' },
    ],
    nameFallback: ['softwareName'],
    accountField: 'licenseKey',
    passwordField: null,
    defaultName: '未命名授权',
  },
}

export const TYPE_LIST: TypeSchema[] = Object.values(TYPE_SCHEMAS)

const TYPE_BY_CATEGORY_ID: Record<string, TypeSchema> = Object.values(TYPE_SCHEMAS)
  .reduce((acc, s) => {
    acc[s.categoryId] = s
    return acc
  }, {} as Record<string, TypeSchema>)

export function getTypeByCategoryId(id: string | number): TypeSchema | null {
  return TYPE_BY_CATEGORY_ID[String(id)] || null
}

export function getTypeByName(type: string): TypeSchema | null {
  return TYPE_SCHEMAS[type as TypeName] || null
}

export function isKnownType(type: string): type is TypeName {
  return type in TYPE_SCHEMAS
}

/**
 * 从 Schema 派生 formData 初始值。Schema 是字段 key 的唯一权威来源,
 * 9 个新增页应该调用 `useFormEngine(getFormDataInitial('xxx'))` 而不是硬编码字段列表。
 */
export function getFormDataInitial(typeName: TypeName): Record<string, string> {
  const schema = TYPE_SCHEMAS[typeName]
  const result: Record<string, string> = {}
  for (const f of schema.fields) {
    result[f.key] = ''
  }
  return result
}

// ─── 归一化 ─────────────────────────────────────────────

export interface NormalizedItem {
  id: string
  type: TypeName
  categoryId: string
  username: string,
  name: string
  account: string
  password: string
  relatedApps: any[]
  rawData: Array<{ key: string, label: string, value: string }>
  createdAt: number
  updatedAt: number
  // 用于重复检测的指纹
  fingerprint: string
  // 原始 rawData 也可能携带,这里单独保留
  isFavorite?: boolean
}

export interface InvalidItem {
  raw: any
  reason: string
}

function genId(): string {
  return `REC_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function buildFingerprint(categoryId: string, name: string, account: string): string {
  return `${categoryId}|${String(name).trim().toLowerCase()}|${String(account).trim().toLowerCase()}`
}

function pickName(schema: TypeSchema, src: any): string {
  if (src.name && String(src.name).trim())
    return String(src.name).trim()
  for (const key of schema.nameFallback) {
    const v = src[key]
    if (v && String(v).trim()) {
      const val = String(v).trim()
      if (key === 'bankName' && src.cardNumber) {
        return `${val} (${String(src.cardNumber).slice(-4)})`
      }
      if (key === 'platform' && src.account) {
        return `${val} (${String(src.account).trim()})`
      }
      return val
    }
  }
  return schema.defaultName
}

function buildRawData(schema: TypeSchema, src: any): Array<{ key: string, label: string, value: string }> {
  let result: Array<{ key: string, label: string, value: string }> = []

  if (Array.isArray(src.rawData) && src.rawData.length) {
    // 优先使用导入数据自带的 rawData(已经是详情页结构)
    result = src.rawData
      .filter((f: any) => f && (f.value !== undefined && f.value !== ''))
      .map((f: any) => ({
        key: String(f.key || ''),
        label: String(f.label || f.key || ''),
        value: String(f.value ?? ''),
      }))
  }
  else {
    // 否则由 schema 字段定义重建
    result = schema.fields
      .filter(f => src[f.key] !== undefined && src[f.key] !== '')
      .map(f => ({ key: f.key, label: f.label, value: String(src[f.key]) }))
  }

  // 补全账号:用 schema.accountField 找值,找不到时回退 src.account
  if (!result.some(f => f.key === 'account' || f.key === schema.accountField)) {
    const accountVal = schema.accountField
      ? String(src[schema.accountField] ?? src.account ?? '').trim()
      : String(src.account ?? '').trim()
    if (accountVal)
      result.unshift({ key: 'account', label: '账号', value: accountVal })
  }

  // 补全密码
  if (schema.passwordField && !result.some(f => f.key === 'password' || f.key === schema.passwordField)) {
    const passwordVal = String(src[schema.passwordField] ?? src.password ?? '')
    if (passwordVal)
      result.splice(1, 0, { key: 'password', label: '密码', value: passwordVal })
  }

  // 补全关联应用
  if (!result.some(f => f.key === 'relatedApps') && Array.isArray(src.relatedApps) && src.relatedApps.length) {
    const apps = src.relatedApps
      .map((a: any) => {
        if (typeof a === 'string')
          return a
        if (a && a.value)
          return String(a.value)
        return ''
      })
      .filter(Boolean)
    if (apps.length)
      result.push({ key: 'relatedApps', label: '关联应用', value: apps.join(', ') })
  }

  return result
}

function buildRelatedApps(src: any): any[] {
  if (!Array.isArray(src.relatedApps))
    return []
  return src.relatedApps
    .map((app: any) => {
      if (typeof app === 'string')
        return { id: `ID_${Math.random().toString(36).slice(2, 9)}`, value: app }
      if (app && typeof app === 'object' && app.value)
        return { id: app.id || `ID_${Math.random().toString(36).slice(2, 9)}`, value: String(app.value) }
      return null
    })
    .filter(Boolean) as any[]
}

function resolveType(raw: any): { type: TypeName, categoryId: string } | null {
  // 1. 直接读 type 字段
  if (raw.type && isKnownType(raw.type)) {
    const s = TYPE_SCHEMAS[raw.type as TypeName]
    return { type: s.type, categoryId: s.categoryId }
  }
  // 2. 兼容:由 categoryId 反查
  if (raw.categoryId !== undefined && raw.categoryId !== null) {
    const s = getTypeByCategoryId(raw.categoryId)
    if (s)
      return { type: s.type, categoryId: s.categoryId }
  }
  return null
}

export function normalizeItem(raw: any): { ok: true, item: NormalizedItem } | { ok: false, reason: string } {
  if (!raw || typeof raw !== 'object')
    return { ok: false, reason: '记录不是有效对象' }

  const resolved = resolveType(raw)
  if (!resolved)
    return { ok: false, reason: '缺少或未知的 type / categoryId' }
  const schema = TYPE_SCHEMAS[resolved.type]

  const name = pickName(schema, raw)
  const account = schema.accountField
    ? String(raw[schema.accountField] ?? raw.account ?? '').trim()
    : String(raw.account ?? '').trim()
  const password = schema.passwordField
    ? String(raw[schema.passwordField] ?? raw.password ?? '')
    : String(raw.password ?? '')

  const now = Date.now()
  const createdAt = typeof raw.createdAt === 'number' ? raw.createdAt : now
  const updatedAt = typeof raw.updatedAt === 'number' ? raw.updatedAt : now

  const item: NormalizedItem = {
    id: typeof raw.id === 'string' && raw.id ? raw.id : genId(),
    type: resolved.type,
    categoryId: resolved.categoryId,
    name,
    username: account,
    account,
    password,
    relatedApps: buildRelatedApps(raw),
    rawData: buildRawData(schema, raw),
    createdAt,
    updatedAt,
    fingerprint: buildFingerprint(resolved.categoryId, name, account),
    isFavorite: !!raw.isFavorite,
  }
  return { ok: true, item }
}

export interface ParseResult {
  items: NormalizedItem[]
  invalid: InvalidItem[]
}

export function parseImport(rawText: string): ParseResult {
  let parsed: any
  try {
    parsed = JSON.parse(rawText)
  }
  catch (e: any) {
    return { items: [], invalid: [{ raw: rawText, reason: `JSON 解析失败: ${e.message || e}` }] }
  }

  // 兼容三种顶层结构
  let list: any[]
  if (Array.isArray(parsed))
    list = parsed
  else if (parsed && Array.isArray(parsed.items))
    list = parsed.items
  else if (parsed && Array.isArray(parsed.records))
    list = parsed.records
  else
    return { items: [], invalid: [{ raw: parsed, reason: '顶层必须是数组,或包含 items / records 数组' }] }

  const items: NormalizedItem[] = []
  const invalid: InvalidItem[] = []
  for (const entry of list) {
    const r = normalizeItem(entry)
    if (r.ok === true) {
      items.push(r.item)
    }
    else {
      invalid.push({ raw: entry, reason: r.reason })
    }
  }
  return { items, invalid }
}

// ─── 导入模版示例 ─────────────────────────────────────

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

// ─── 重复检测 ───────────────────────────────────────────

export type DupAction = 'skip' | 'overwrite' | 'keep-both'

export interface ItemWithDup {
  item: NormalizedItem
  dupAction: DupAction
  matchedLocalId: string | null
}

export function buildFingerprintOfLocal(item: any): string {
  return buildFingerprint(
    String(item.categoryId ?? ''),
    String(item.name ?? ''),
    String(item.account ?? ''),
  )
}

export function detectDuplicates(items: NormalizedItem[], existingList: any[]): ItemWithDup[] {
  const fpToId: Record<string, string> = {}
  for (const local of existingList) {
    const fp = buildFingerprintOfLocal(local)
    if (!fpToId[fp])
      fpToId[fp] = local.id
  }
  return items.map((item) => {
    const matchedLocalId = fpToId[item.fingerprint] || null
    if (!matchedLocalId) {
      return { item, dupAction: 'keep-both' as DupAction, matchedLocalId: null }
    }
    return { item, dupAction: 'skip' as DupAction, matchedLocalId }
  })
}

// ─── 入库合并 ───────────────────────────────────────────

export interface CommitResult {
  added: number
  overwritten: number
  skipped: number
  total: number
}

export function commitImport(
  entries: ItemWithDup[],
  existingList: any[],
): { nextList: any[], result: CommitResult } {
  const byId: Record<string, any> = {}
  for (const local of existingList) {
    if (local.id)
      byId[String(local.id)] = local
  }

  let added = 0
  let overwritten = 0
  let skipped = 0
  for (const entry of entries) {
    const { item, dupAction, matchedLocalId } = entry
    if (dupAction === 'skip') {
      skipped++
      continue
    }
    if (dupAction === 'overwrite' && matchedLocalId && byId[matchedLocalId]) {
      // 保留原 id、createdAt、isFavorite 等用户态信息,覆盖业务字段
      byId[matchedLocalId] = {
        ...byId[matchedLocalId],
        categoryId: item.categoryId,
        name: item.name,
        account: item.account,
        password: item.password,
        relatedApps: item.relatedApps,
        rawData: item.rawData,
        updatedAt: Date.now(),
      }
      overwritten++
      continue
    }
    // keep-both 或 overwrite 但无匹配:作为新增
    byId[item.id] = { ...item }
    added++
  }

  const nextList = Object.values(byId)
  return {
    nextList,
    result: { added, overwritten, skipped, total: entries.length },
  }
}
