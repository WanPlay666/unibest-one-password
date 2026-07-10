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
      { key: 'username', label: '账号' },
      { key: 'password', label: '密码' },
    ],
    nameFallback: ['username'],
    accountField: 'username',
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

// ─── 归一化 ─────────────────────────────────────────────

export interface NormalizedItem {
  id: string
  type: TypeName
  categoryId: string
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
  // 优先使用导入数据自带的 rawData(已经是详情页结构)
  if (Array.isArray(src.rawData) && src.rawData.length) {
    return src.rawData
      .filter((f: any) => f && (f.value !== undefined && f.value !== ''))
      .map((f: any) => ({
        key: String(f.key || ''),
        label: String(f.label || f.key || ''),
        value: String(f.value ?? ''),
      }))
  }
  // 否则由 schema 字段定义重建
  return schema.fields
    .filter(f => src[f.key] !== undefined && src[f.key] !== '')
    .map(f => ({ key: f.key, label: f.label, value: String(src[f.key]) }))
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
 * 生成一份覆盖 9 种 type 的导入模版,每条仅保留该 type 必填/最常见的字段,
 * 方便用户参考字段命名与结构,然后填入真实数据。
 */
export function buildImportTemplate(): string {
  const payload = {
    version: '1.0',
    exportedAt: Date.now(),
    items: [
      {
        type: 'login',
        name: 'GitHub',
        account: 'user@example.com',
        password: 'your-password',
        relatedApps: ['github.com'],
      },
      {
        type: 'identity',
        name: '我的身份证',
        account: '110101199001011234',
        idType: '身份证',
        realName: '张三',
        idNumber: '110101199001011234',
        validFrom: '2020-01-01',
        validTo: '2030-01-01',
        authority: '北京市公安局',
      },
      {
        type: 'bank',
        name: '招商银行 (6666)',
        account: '6225880137666666',
        bankName: '招商银行',
        cardType: '储蓄卡',
        cardNumber: '6225880137666666',
        holderName: '张三',
        phone: '13800138000',
      },
      {
        type: 'social',
        name: '个人微信',
        account: 'wxid_abc123',
        platform: '微信',
        payPassword: 'pay-pass-123',
      },
      {
        type: 'vehicle',
        name: '粤B·XXXXX',
        account: '粤B·XXXXX',
        plateNumber: '粤B·XXXXX',
        vin: 'LSGPC52U8AF123456',
        engineNumber: 'ENG123456',
        registerDate: '2022-03-15',
        insurance: '平安保险 PA-2024-001',
        insuranceExpiry: '2025-03-15',
      },
      {
        type: 'business',
        name: '我的公司',
        account: '91110000123456789X',
        companyName: '某某科技有限公司',
        taxId: '91110000123456789X',
        addressPhone: '北京市朝阳区xxx路 010-12345678',
        bankAccount: '招商银行 6225880137666666',
        email: 'billing@example.com',
      },
      {
        type: 'medical',
        name: '个人社保',
        account: '1234567890',
        cardNumber: '1234567890',
        password: 'query-pass',
        fundAccount: 'G123456',
        hospital: '北京协和医院',
      },
      {
        type: 'wifi',
        name: '家里 WiFi',
        account: 'Home-WiFi-5G',
        ssid: 'Home-WiFi-5G',
        wifiPassword: 'wifi-pass-123',
        adminAccount: 'admin',
        adminPassword: 'admin-pass',
      },
      {
        type: 'software',
        name: 'JetBrains IDEA',
        account: 'ABCD-1234-EFGH-5678',
        softwareName: 'JetBrains IntelliJ IDEA',
        licenseKey: 'ABCD-1234-EFGH-5678',
        limitation: '1年个人订阅',
      },
    ],
  }
  return JSON.stringify(payload, null, 2)
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
