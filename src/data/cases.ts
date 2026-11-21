export const DATA_AS_OF = '2026-11-21'

export type Language = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export type EnforcementTopic = 'cookies' | 'app_sdk' | 'device_identifiers' | 'e_marketing'
export type CaseOutcome = 'fine' | 'injunction' | 'closed' | 'proceeding' | 'prosecution'
export type GdprTreatment = 'included' | 'excluded' | 'mixed_needs_review' | 'unknown'
export type TrackerTreatment = 'included' | 'needs_review' | 'excluded'
export type EvidenceStatus = 'verified' | 'needs_review' | 'excluded'
export type EvidenceLevel = 'primary_decision' | 'authority_announcement' | 'authority_register' | 'annual_report'
export type SourceType = 'authority' | 'decision' | 'follow_up'
export type SourceVerificationStatus = 'verified' | 'needs_review'
export type EnforcementRoute = 'administrative_fine' | 'criminal_prosecution' | 'injunction' | 'proceeding' | 'closure'
export type EnforcementSurface = 'web' | 'mobile_app' | 'email' | 'sms' | 'mixed'
export type AmountAllocation = 'exact' | 'combined' | 'unresolved' | 'not_applicable'

export interface LegalBasis {
  id: string
  label: LocalizedText
  family: 'eprivacy' | 'gdpr' | 'other'
  jurisdiction: LocalizedText
  sourceUrl: string
}

export interface CaseSource {
  label: LocalizedText
  url: string
  sourceType: SourceType
  evidenceLevel: EvidenceLevel
  verificationStatus: SourceVerificationStatus
  /** Date the source evidence was last manually checked; automated reachability is tracked separately. */
  lastCheckedAt: string
}

export interface CaseEvent {
  date: string
  label: LocalizedText
  description: LocalizedText
  sourceUrl?: string
}

export interface EnforcementCase {
  id: string
  title: LocalizedText
  authority: LocalizedText
  country: LocalizedText
  entity: LocalizedText
  topics: EnforcementTopic[]
  surface: EnforcementSurface
  legalBases: LegalBasis[]
  outcome: CaseOutcome
  enforcementRoute: EnforcementRoute
  status: LocalizedText
  /** The amount attributable to the explicitly included ePrivacy basis. */
  fineEur: number | null
  /** The full monetary amount stated in the official decision, when available. */
  totalDecisionAmountEur: number | null
  /** How the counted amount maps to the official decision amount and legal bases. */
  amountAllocation: AmountAllocation
  fineScopeNote: LocalizedText
  monetaryOutcome?: LocalizedText
  decisionReference?: string
  decisionDate: string
  latestDate: string
  summary: LocalizedText
  evidenceNote: LocalizedText
  evidenceStatus: EvidenceStatus
  evidenceLevel: EvidenceLevel
  trackerTreatment: TrackerTreatment
  reviewReason?: LocalizedText
  gdprTreatment: GdprTreatment
  gdprExclusionReason?: LocalizedText
  sources: CaseSource[]
  events: CaseEvent[]
  lastVerifiedAt: string
}

export const TOPIC_META: Record<EnforcementTopic, { label: LocalizedText; shortLabel: LocalizedText }> = {
  cookies: {
    label: { zh: 'Cookie 与同意', en: 'Cookies & consent' },
    shortLabel: { zh: 'Cookie', en: 'Cookies' },
  },
  app_sdk: {
    label: { zh: 'App SDK', en: 'App SDK' },
    shortLabel: { zh: 'App SDK', en: 'App SDK' },
  },
  device_identifiers: {
    label: { zh: '设备信息与终端标识符', en: 'Device info & identifiers' },
    shortLabel: { zh: '终端标识符', en: 'Identifiers' },
  },
  e_marketing: {
    label: { zh: '电子营销', en: 'E-marketing' },
    shortLabel: { zh: '电子营销', en: 'E-marketing' },
  },
}

export const OUTCOME_META: Record<CaseOutcome, LocalizedText> = {
  fine: { zh: '罚款决定', en: 'Fine decision' },
  injunction: { zh: '禁令 / 整改', en: 'Injunction / remedy' },
  closed: { zh: '已结案', en: 'Closed' },
  proceeding: { zh: '在办程序', en: 'Proceeding' },
  prosecution: { zh: '刑事 / 法院追诉', en: 'Prosecution / court' },
}

export const EVIDENCE_STATUS_META: Record<EvidenceStatus, LocalizedText> = {
  verified: { zh: '证据已核验', en: 'Evidence verified' },
  needs_review: { zh: '证据待复核', en: 'Evidence needs review' },
  excluded: { zh: '证据已排除', en: 'Evidence excluded' },
}

export const EVIDENCE_LEVEL_META: Record<EvidenceLevel, LocalizedText> = {
  primary_decision: { zh: '官方决定 / 判决原文', en: 'Official decision / judgment' },
  authority_announcement: { zh: '监管机构官方公告', en: 'Authority announcement' },
  authority_register: { zh: '监管机构处罚登记', en: 'Authority enforcement register' },
  annual_report: { zh: '监管机构年度报告', en: 'Authority annual report' },
}

export const SURFACE_META: Record<EnforcementSurface, LocalizedText> = {
  web: { zh: '网站 / Web', en: 'Website / web' },
  mobile_app: { zh: '移动 App', en: 'Mobile app' },
  email: { zh: '电子邮件', en: 'Email' },
  sms: { zh: '短信', en: 'SMS' },
  mixed: { zh: '多种终端 / 渠道', en: 'Mixed surfaces / channels' },
}

const GOOGLE_SOURCE = 'https://www.cnil.fr/en/cookies-and-advertisements-inserted-between-emails-google-fined-325-million-euros-cnil'
const SHEIN_SOURCE = 'https://www.cnil.fr/en/cookies-placed-without-consent-shein-fined-150-million-euros-cnil'
const ACTION_PLAN_SOURCE = 'https://www.cnil.fr/en/cookie-regulation-cnil-continuing-action-plan-initiated-2019-and-has-imposed-two-fines-shein-and'
const GOOGLE_CLOSURE_SOURCE = 'https://www.cnil.fr/en/closure-injunction-google'
const CNIL_LAW_SOURCE = 'https://www.cnil.fr/en/french-data-protection-act'
const CPCE_SOURCE = 'https://www.cnil.fr/fr/communication-electronique-quelles-regles'
const GDPR_SOURCE = 'https://eur-lex.europa.eu/eli/reg/2016/679/oj'
const GOOGLE_2020_SOURCE = 'https://www.conseil-etat.fr/site/Pages-internationales/english/news/advertising-cookies-google-fined-100-million'
const GOOGLE_2020_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000042635706'
const AMAZON_2020_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000042635729'
const GOOGLE_2021_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000044840062'
const FACEBOOK_2021_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000044840532'
const ORANGE_SOURCE = 'https://www.cnil.fr/en/advertisements-inserted-among-emails-orange-fined-eu50-million'
const ORANGE_CLOSURE_SOURCE = 'https://cnil.fr/en/closure-injunction-issued-against-orange'
const FNAC_SOURCE = 'https://www.cnil.fr/en/sanction-app-cookies-fnac'
const AMERICAN_EXPRESS_SOURCE = 'https://www.cnil.fr/en/cookies-american-express-fined-eu15-million-cnil'
const CONDE_NAST_SOURCE = 'https://www.cnil.fr/en/cookies-placed-without-consent-company-publishes-website-vanityfairfr-fined-750000-euros'
const SOLOCAL_SOURCE = 'https://www.cnil.fr/en/data-brokers-solocal-marketing-services-fined-eu900000'
const CALOGA_SOURCE = 'https://cnil.fr/en/data-brokers-caloga-fined-eu80000'
const COSMOSPACE_SOURCE = 'https://www.cnil.fr/en/online-clairvoyance-cosmospace-and-telemaque-fined-eu250000-and-eu150000'
const COSMOSPACE_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000050324625'
const TELEMAQUE_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000050324681'
const SOLOCAL_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000051630617'
const CALOGA_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000051660380'
const SOLOCAL_CLOSURE_SOURCE = 'https://www.cnil.fr/fr/cloture-injonction-solocal-marketing-services'
const SOLOCAL_CLOSURE_DECISION = 'https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000054886539'
const DPC_COOKIES_SOURCE = 'https://www.dataprotection.ie/en/dpc-guidance/guidance-cookies-and-other-tracking-technologies'
const DPC_MARKETING_SOURCE = 'https://www.dataprotection.ie/en/faqs/direct-marketing/what-rules-apply-electronic-direct-marketing'
const DPC_ANNUAL_2023_SOURCE = 'https://www.dataprotection.ie/sites/default/files/uploads/2024-08/DPC-EN-AR-2023-Final-AC.pdf'
const DPC_VODAFONE_SOURCE = DPC_ANNUAL_2023_SOURCE
const DPC_SUPERMACS_SOURCE = 'https://www.dataprotection.ie/en/dpc-guidance/case-studies/electronic-direct-marketing/prosecution-supermacs-ireland-limited'
const DPC_THERAPIE_SOURCE = 'https://www.dataprotection.ie/en/dpc-guidance/case-studies/electronic-direct-marketing/prosecution-therapie-clinic-trading-valterous-limited'
const DPC_BROWN_THOMAS_SOURCE = 'https://dataprotection.ie/en/news-media/latest-news/data-protection-commission-welcomes-outcome-prosecution-marketing-offences-1'
const AEPD_ANNUAL_2023_SOURCE = 'https://www.aepd.es/memorias/memoria-aepd-2023.pdf'
const AEPD_MASSIMO_DUTTI_DECISION = 'https://www.aepd.es/documento/ps-00051-2023.pdf'
const AEPD_COOKIES_GUIDANCE = 'https://www.aepd.es/guias/guia-cookies.pdf'
const GARANTE_META_SOURCE = 'https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10321080'
const GARANTE_META_DECISION = 'https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10321455'
const GARANTE_FOODINHO_DECISION = 'https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/print/10074601'
const GARANTE_FOODINHO_FOLLOW_UP = 'https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10105535'

export const legalBases: LegalBasis[] = [
  {
    id: 'fr-article-82',
    label: { zh: '法国《数据保护法》Article 82（Cookie 与追踪器）', en: 'Article 82 of the French Data Protection Act (cookies and trackers)' },
    family: 'eprivacy',
    jurisdiction: { zh: '法国', en: 'France' },
    sourceUrl: CNIL_LAW_SOURCE,
  },
  {
    id: 'fr-cpce-l34-5',
    label: { zh: '法国《邮政与电子通信法》Article L.34-5（电子营销）', en: 'Article L.34-5 of the French Postal and Electronic Communications Code (electronic marketing)' },
    family: 'eprivacy',
    jurisdiction: { zh: '法国', en: 'France' },
    sourceUrl: CPCE_SOURCE,
  },
  {
    id: 'fr-gdpr-article-5-1-c',
    label: { zh: 'GDPR Article 5(1)(c)（数据最小化）', en: 'GDPR Article 5(1)(c) (data minimisation)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'fr-gdpr-article-6',
    label: { zh: 'GDPR Article 6（合法性）', en: 'GDPR Article 6 (lawfulness)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'fr-gdpr-article-5-1-e',
    label: { zh: 'GDPR Article 5(1)(e)（存储期限限制）', en: 'GDPR Article 5(1)(e) (storage limitation)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'fr-gdpr-article-7',
    label: { zh: 'GDPR Article 7（同意条件）', en: 'GDPR Article 7 (conditions for consent)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'fr-gdpr-article-9',
    label: { zh: 'GDPR Article 9（特殊类别数据）', en: 'GDPR Article 9 (special categories of data)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'fr-gdpr-article-13',
    label: { zh: 'GDPR Article 13（透明度）', en: 'GDPR Article 13 (transparency)' },
    family: 'gdpr',
    jurisdiction: { zh: '法国 / 欧盟', en: 'France / EU' },
    sourceUrl: GDPR_SOURCE,
  },
  {
    id: 'ie-si-336-reg-13',
    label: { zh: '爱尔兰 S.I. 336/2011 Regulation 13（电子直销）', en: 'Ireland S.I. 336/2011 Regulation 13 (electronic direct marketing)' },
    family: 'eprivacy',
    jurisdiction: { zh: '爱尔兰', en: 'Ireland' },
    sourceUrl: DPC_MARKETING_SOURCE,
  },
  {
    id: 'ie-si-336-reg-5-3',
    label: { zh: '爱尔兰 S.I. 336/2011 Regulation 5(3)（Cookie）', en: 'Ireland S.I. 336/2011 Regulation 5(3) (cookies)' },
    family: 'eprivacy',
    jurisdiction: { zh: '爱尔兰', en: 'Ireland' },
    sourceUrl: DPC_COOKIES_SOURCE,
  },
  {
    id: 'es-lssi-article-22-2',
    label: { zh: '西班牙 LSSI Article 22(2)（Cookie 与终端存取）', en: 'Spain LSSI Article 22(2) (cookies and terminal access)' },
    family: 'eprivacy',
    jurisdiction: { zh: '西班牙', en: 'Spain' },
    sourceUrl: AEPD_COOKIES_GUIDANCE,
  },
  {
    id: 'it-article-122',
    label: { zh: '意大利《隐私法典》Article 122（终端信息访问）', en: 'Article 122 of the Italian Privacy Code (access to terminal information)' },
    family: 'eprivacy',
    jurisdiction: { zh: '意大利', en: 'Italy' },
    sourceUrl: GARANTE_META_DECISION,
  },
  {
    id: 'it-gdpr-articles-5-6-9-12-13-22-25-28-32-88',
    label: { zh: 'GDPR Articles 5、6、9、12、13、22、25、28、32、88（Foodinho）', en: 'GDPR Articles 5, 6, 9, 12, 13, 22, 25, 28, 32 and 88 (Foodinho)' },
    family: 'gdpr',
    jurisdiction: { zh: '意大利 / 欧盟', en: 'Italy / EU' },
    sourceUrl: GARANTE_FOODINHO_DECISION,
  },
]

const basis = (id: string) => {
  const match = legalBases.find((item) => item.id === id)
  if (!match) throw new Error(`Unknown legal basis: ${id}`)
  return match
}

const officialSource = (
  label: LocalizedText,
  url: string,
  sourceType: SourceType,
  evidenceLevel: EvidenceLevel = 'authority_announcement',
  verificationStatus: SourceVerificationStatus = 'verified',
): CaseSource => ({ label, url, sourceType, evidenceLevel, verificationStatus, lastCheckedAt: DATA_AS_OF })

const caseEvent = (date: string, label: LocalizedText, description: LocalizedText, sourceUrl?: string): CaseEvent => ({ date, label, description, sourceUrl })

const officialDecision = (label: string, url: string, evidenceLevel: EvidenceLevel = 'primary_decision', verificationStatus: SourceVerificationStatus = 'verified') => officialSource({ zh: label, en: label }, url, evidenceLevel === 'primary_decision' ? 'decision' : 'authority', evidenceLevel, verificationStatus)

const includedReason: LocalizedText = {
  zh: '官方来源明确将相关违法行为置于 ePrivacy 转化规则下；GDPR 不作为本记录的计入依据。',
  en: 'The official source places the relevant infringement under the ePrivacy transposition; GDPR is not the counting basis for this record.',
}

export const cases: EnforcementCase[] = [
  {
    id: 'EP-2025-001',
    title: { zh: 'Google｜Cookie 与 Gmail 广告邮件', en: 'Google | cookies and Gmail advertising emails' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Google LLC 与 Google Ireland Limited', en: 'Google LLC and Google Ireland Limited' },
    topics: ['cookies', 'e_marketing'],
    surface: 'mixed',
    legalBases: [basis('fr-article-82'), basis('fr-cpce-l34-5')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 后续禁令已关闭', en: 'Fine recorded · follow-up injunction closed' },
    fineEur: 325_000_000,
    totalDecisionAmountEur: 325_000_000,
    amountAllocation: 'combined',
    fineScopeNote: { zh: '€325m 是官方披露的合计罚款，不按两项违法行为拆分。', en: 'The official amount is a combined €325m fine; it is not split between the two breaches.' },
    decisionReference: 'SAN-2025-004',
    decisionDate: '2025-09-01',
    latestDate: '2026-09-23',
    summary: { zh: 'CNIL 认定 Google 在 Gmail 私人邮件之间插入广告且未取得事先同意，并在创建 Google 账号时以不充分的方式取得广告 Cookie 同意。', en: 'The CNIL found that Google displayed advertising between private Gmail messages without prior consent and obtained invalid consent for advertising cookies during account creation.' },
    evidenceNote: { zh: '案件同时涉及终端上的广告 Cookie 与 Gmail 中的电子营销。官方决定将两项违法行为的罚款披露为 €325m 合计金额。', en: 'The action covers advertising cookies on users’ terminals and electronic marketing in Gmail. The official decision reports one combined €325m amount for the two breaches.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialDecision('CNIL Google 处罚公告', GOOGLE_SOURCE, 'authority_announcement'),
      officialSource({ zh: 'CNIL Google 后续禁令关闭', en: 'CNIL Google injunction closure' }, GOOGLE_CLOSURE_SOURCE, 'follow_up'),
      officialSource({ zh: 'CNIL Cookie 行动计划公告', en: 'CNIL cookie action-plan announcement' }, ACTION_PLAN_SOURCE, 'authority'),
    ],
    events: [
      caseEvent('2025-09-01', { zh: '作出 €325m 罚款决定', en: '€325m fine decision issued' }, { zh: 'CNIL 对 Google LLC 与 Google Ireland Limited 作出两项罚款，合计 €325m，并要求停止相关 Cookie 与电子营销做法。', en: 'The CNIL imposed two fines on Google LLC and Google Ireland Limited, totalling €325m, and ordered changes to the cookie and electronic-marketing practices.' }, GOOGLE_SOURCE),
      caseEvent('2026-09-23', { zh: '后续禁令关闭', en: 'Follow-up injunction closed' }, { zh: 'CNIL 认定 Google 已完成 2025 年禁令所要求的整改范围，并关闭该禁令程序；不代表对整个账号创建流程作出全面合规结论。', en: 'The CNIL closed the injunction after finding compliance with its scope; the closure does not resolve the entire account-creation path under every applicable rule.' }, GOOGLE_CLOSURE_SOURCE),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2025-002',
    title: { zh: 'SHEIN｜未取得同意即放置 Cookie', en: 'SHEIN | cookies placed without consent' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'INFINITE STYLES SERVICES CO. LIMITED（SHEIN）', en: 'INFINITE STYLES SERVICES CO. LIMITED (SHEIN)' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款', en: 'Fine recorded' },
    fineEur: 150_000_000,
    totalDecisionAmountEur: 150_000_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€150m 罚款针对 shein.com 上 Cookie 的放置、拒绝与撤回机制等问题。', en: 'The €150m fine covers cookie placement, refusal, and withdrawal practices on shein.com.' },
    decisionReference: 'SAN-2025-005',
    decisionDate: '2025-09-01',
    latestDate: '2025-09-01',
    summary: { zh: 'CNIL 认定 shein.com 在用户表达选择前放置部分 Cookie、未尊重拒绝或撤回选择，并提供不完整的 Cookie 信息。', en: 'The CNIL found that shein.com placed some cookies before users expressed a choice, failed to respect refusal or withdrawal choices, and provided incomplete cookie information.' },
    evidenceNote: { zh: 'CNIL 依据法国《数据保护法》Article 82 对终端上放置的 Cookie 与追踪器开展执法。', en: 'The CNIL enforced Article 82 of the French Data Protection Act for cookies and trackers placed on users’ terminals.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialDecision('CNIL SHEIN 处罚公告', SHEIN_SOURCE, 'authority_announcement'),
      officialSource({ zh: 'CNIL Cookie 行动计划公告', en: 'CNIL cookie action-plan announcement' }, ACTION_PLAN_SOURCE, 'authority'),
    ],
    events: [caseEvent('2025-09-01', { zh: '作出 €150m 罚款决定', en: '€150m fine decision issued' }, { zh: 'CNIL 对 INFINITE STYLES SERVICES CO. LIMITED 作出 €150m 罚款，涉及 shein.com 的 Cookie 合规问题。', en: 'The CNIL imposed a €150m fine on INFINITE STYLES SERVICES CO. LIMITED for cookie compliance failures on shein.com.' }, SHEIN_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2020-003',
    title: { zh: 'Google｜google.fr 广告 Cookie', en: 'Google | advertising cookies on google.fr' },
    authority: { zh: 'CNIL / Conseil d’État', en: 'CNIL / Conseil d’État' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Google LLC 与 Google Ireland Limited', en: 'Google LLC and Google Ireland Limited' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 2022 年经 Conseil d’État 确认', en: 'Fine recorded · upheld by Conseil d’État in 2022' },
    fineEur: 100_000_000,
    totalDecisionAmountEur: 100_000_000,
    amountAllocation: 'combined',
    fineScopeNote: { zh: 'CNIL 对 Google LLC 与 Google Ireland Limited 作出的两项罚款合计 €100m。', en: 'The two CNIL fines against Google LLC and Google Ireland Limited totalled €100m.' },
    decisionReference: 'SAN-2020-012; Conseil d’État 2022-01-31',
    decisionDate: '2020-12-07',
    latestDate: '2022-01-31',
    summary: { zh: 'Google 在用户访问 google.fr 时自动放置广告 Cookie，信息与拒绝机制不符合 Article 82。', en: 'Google placed advertising cookies automatically when users visited google.fr, with inadequate information and refusal mechanisms under Article 82.' },
    evidenceNote: { zh: 'Conseil d’État 官方公告明确将该案描述为 Article 82 对 ePrivacy 指令的法国转化规则执法。', en: 'The Conseil d’État official notice expressly describes the case as Article 82 enforcement transposing the ePrivacy Directive in France.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialDecision('Conseil d’État Google €100m 公告', GOOGLE_2020_SOURCE, 'authority_announcement'),
      officialDecision('CNIL SAN-2020-012 决定', GOOGLE_2020_DECISION),
    ],
    events: [
      caseEvent('2020-12-07', { zh: 'CNIL 作出 €100m 合计罚款', en: 'CNIL issued the combined €100m fine' }, { zh: 'CNIL 认定 google.fr 的广告 Cookie 未满足事先同意、充分告知和有效拒绝的要求。', en: 'The CNIL found that google.fr advertising cookies failed the requirements for prior consent, clear information and an effective refusal mechanism.' }, GOOGLE_2020_DECISION),
      caseEvent('2022-01-31', { zh: 'Conseil d’État 驳回撤销请求', en: 'Conseil d’État upheld the sanction' }, { zh: '法国 Conseil d’État 确认 CNIL 的权限、违法认定与 €100m 罚款。', en: 'The French Conseil d’État confirmed the CNIL’s jurisdiction, findings and €100m sanction.' }, GOOGLE_2020_SOURCE),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2020-004',
    title: { zh: 'Amazon｜amazon.fr 广告 Cookie', en: 'Amazon | advertising cookies on amazon.fr' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Amazon Europe Core', en: 'Amazon Europe Core' },
    topics: ['cookies', 'device_identifiers'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款', en: 'Fine recorded' },
    fineEur: 35_000_000,
    totalDecisionAmountEur: 35_000_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€35m 是 Amazon Europe Core 的 Article 82 罚款。', en: 'The €35m fine was imposed on Amazon Europe Core for the Article 82 breaches.' },
    decisionReference: 'SAN-2020-013',
    decisionDate: '2020-12-07',
    latestDate: '2020-12-07',
    summary: { zh: 'Amazon 在 amazon.fr 页面抵达时，在用户作出选择前放置广告 Cookie，并未提供充分信息。', en: 'Amazon placed advertising cookies when users arrived on amazon.fr before a choice and without sufficient information.' },
    evidenceNote: { zh: '官方决定提及大量 Amazon 标识符与跨网站行为追踪，但本记录按 Article 82 终端存取规则计入。', en: 'The official decision refers to extensive Amazon identifiers and cross-site tracking; this record counts the Article 82 terminal-access breach.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL SAN-2020-013 决定', AMAZON_2020_DECISION)],
    events: [caseEvent('2020-12-07', { zh: '作出 €35m 罚款决定', en: '€35m fine decision issued' }, { zh: 'CNIL 认定 amazon.fr 在用户作出选择前写入广告 Cookie，并处罚 €35m。', en: 'The CNIL found that amazon.fr wrote advertising cookies before users made a choice and imposed a €35m fine.' }, AMAZON_2020_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2021-001',
    title: { zh: 'Google｜拒绝 Cookie 机制', en: 'Google | cookie refusal mechanism' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Google LLC 与 Google Ireland Limited', en: 'Google LLC and Google Ireland Limited' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 含整改禁令', en: 'Fine recorded · injunction included' },
    fineEur: 150_000_000,
    totalDecisionAmountEur: 150_000_000,
    amountAllocation: 'combined',
    fineScopeNote: { zh: '€90m 针对 Google LLC，€60m 针对 Google Ireland Limited；均基于 Article 82。', en: '€90m was imposed on Google LLC and €60m on Google Ireland Limited, both under Article 82.' },
    decisionReference: 'SAN-2021-023',
    decisionDate: '2021-12-31',
    latestDate: '2021-12-31',
    summary: { zh: 'CNIL 认定 google.fr 与 youtube.com 的 Cookie 拒绝机制不如接受机制简便，影响同意自由。', en: 'The CNIL found that the refusal mechanism on google.fr and youtube.com was not as simple as acceptance, affecting the freedom of consent.' },
    evidenceNote: { zh: '官方决定明确写明两家公司均因 Article 82 受到罚款与禁令。', en: 'The official decision expressly states that both companies were fined and enjoined for breaching Article 82.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL SAN-2021-023 决定', GOOGLE_2021_DECISION)],
    events: [caseEvent('2021-12-31', { zh: '作出 €150m 罚款与禁令', en: '€150m fine and injunction issued' }, { zh: 'CNIL 对 Google LLC 与 Google Ireland Limited 分别作出 €90m 与 €60m 罚款，并要求提供同等简便的拒绝机制。', en: 'The CNIL fined Google LLC €90m and Google Ireland Limited €60m, and required an equally simple refusal mechanism.' }, GOOGLE_2021_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2021-002',
    title: { zh: 'Facebook｜拒绝 Cookie 机制', en: 'Facebook | cookie refusal mechanism' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Facebook Ireland Limited', en: 'Facebook Ireland Limited' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 含整改禁令', en: 'Fine recorded · injunction included' },
    fineEur: 60_000_000,
    totalDecisionAmountEur: 60_000_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€60m 罚款与禁令均基于 Facebook.com 用户终端的 Article 82 Cookie 机制。', en: 'The €60m fine and injunction concern the Article 82 cookie mechanism for users’ terminals on facebook.com.' },
    decisionReference: 'SAN-2021-024',
    decisionDate: '2021-12-31',
    latestDate: '2021-12-31',
    summary: { zh: 'CNIL 认定 Facebook.com 的 Cookie 接受与拒绝机制不具有同等简便性，并处罚 €60m。', en: 'The CNIL found that facebook.com did not provide a refusal mechanism as simple as acceptance and imposed a €60m fine.' },
    evidenceNote: { zh: '官方决定明确依据法国《数据保护法》Article 82，而非 GDPR 一站式机制。', en: 'The official decision expressly relies on Article 82 of the French Data Protection Act, not the GDPR one-stop-shop mechanism.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL SAN-2021-024 决定', FACEBOOK_2021_DECISION)],
    events: [caseEvent('2021-12-31', { zh: '作出 €60m 罚款与禁令', en: '€60m fine and injunction issued' }, { zh: 'CNIL 对 Facebook Ireland Limited 作出 €60m 罚款，并要求提供与接受机制同等简便的拒绝方式。', en: 'The CNIL imposed a €60m fine on Facebook Ireland Limited and required a refusal method as simple as acceptance.' }, FACEBOOK_2021_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2023-001',
    title: { zh: 'Massimo Dutti｜Cookie 信息与同意', en: 'Massimo Dutti | cookie information and consent' },
    authority: { zh: 'AEPD', en: 'AEPD' },
    country: { zh: '西班牙', en: 'Spain' },
    entity: { zh: 'GRUPO MASSIMO DUTTI, S.A.', en: 'GRUPO MASSIMO DUTTI, S.A.' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('es-lssi-article-22-2')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已核验 · 已挂接直接决定', en: 'Verified · direct decision linked' },
    fineEur: 5_000,
    totalDecisionAmountEur: 5_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: 'AEPD PS/00051/2023 直接决定确认 €5,000 罚款，依据为 LSSI Article 22(2)。', en: 'The AEPD PS/00051/2023 decision confirms a €5,000 fine under Article 22(2) of the LSSI.' },
    decisionReference: 'PS/00051/2023',
    decisionDate: '2023-12-31',
    latestDate: '2023-12-31',
    summary: { zh: 'AEPD 年度报告将该案列为 LSSI Article 22(2) Cookie 案件，涉及第一层信息不足与同意取得。', en: 'The AEPD annual report lists this as an LSSI Article 22(2) cookie case involving insufficient first-layer information and consent.' },
    evidenceNote: { zh: 'AEPD 直接决定确认：Massimo Dutti 因 Cookie 同意撤回后仍无法拒绝非必要第三方 Cookie，违反 LSSI Article 22(2)，处以 €5,000 罚款。', en: 'The direct AEPD decision confirms that Massimo Dutti could not reject non-essential third-party cookies after consent withdrawal, breaching LSSI Article 22(2) and resulting in a €5,000 fine.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialSource({ zh: 'AEPD 2023 年度报告', en: 'AEPD Annual Report 2023' }, AEPD_ANNUAL_2023_SOURCE, 'authority', 'annual_report'),
      officialDecision('AEPD PS/00051/2023 决定', AEPD_MASSIMO_DUTTI_DECISION),
    ],
    events: [caseEvent('2023-12-31', { zh: 'AEPD 直接决定确认 €5,000 罚款', en: 'AEPD direct decision confirmed €5,000 fine' }, { zh: 'AEPD PS/00051/2023 直接决定确认 Massimo Dutti 违反 LSSI Article 22(2)，并处以 €5,000 罚款。', en: 'The AEPD PS/00051/2023 decision confirmed a breach of LSSI Article 22(2) and imposed a €5,000 fine on Massimo Dutti.' }, AEPD_MASSIMO_DUTTI_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2023-002',
    title: { zh: 'Vodafone Ireland｜未同意发送营销邮件', en: 'Vodafone Ireland | marketing email without consent' },
    authority: { zh: 'DPC', en: 'DPC' },
    country: { zh: '爱尔兰', en: 'Ireland' },
    entity: { zh: 'Vodafone Ireland Limited', en: 'Vodafone Ireland Limited' },
    topics: ['e_marketing'],
    surface: 'email',
    legalBases: [basis('ie-si-336-reg-13')],
    outcome: 'fine',
    enforcementRoute: 'criminal_prosecution',
    status: { zh: '法院定罪 · €500 罚款', en: 'Court conviction · €500 fine' },
    fineEur: 500,
    totalDecisionAmountEur: 500,
    amountAllocation: 'exact',
    fineScopeNote: { zh: 'DPC 年度报告披露法院对一项 Regulation 13(1) 指控处以 €500 罚款。', en: 'The DPC annual report records a €500 fine for one Regulation 13(1) charge.' },
    decisionReference: 'Dublin Metropolitan District Court · 2023-09-11',
    decisionDate: '2023-09-11',
    latestDate: '2023-09-11',
    summary: { zh: 'Vodafone Ireland 向已退出营销的客户发送营销邮件；DPC 说明有 20,790 名客户受到错误营销活动影响。', en: 'Vodafone Ireland sent a marketing email to a customer who had opted out; the DPC reported that 20,790 customers were affected by the faulty campaigns.' },
    evidenceNote: { zh: '官方年度报告明确写明 Regulation 13(1) ePrivacy 指控、法院定罪和 €500 罚款。', en: 'The official annual report clearly identifies the Regulation 13(1) ePrivacy charge, conviction and €500 fine.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'annual_report',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialSource({ zh: 'DPC Annual Report 2023 · Case Study 18', en: 'DPC Annual Report 2023 · Case Study 18' }, DPC_VODAFONE_SOURCE, 'authority', 'annual_report')],
    events: [caseEvent('2023-09-11', { zh: '法院定罪并处 €500 罚款', en: 'Court conviction and €500 fine' }, { zh: 'Vodafone Ireland 对 Regulation 13(1) 指控认罪，Dublin Metropolitan District Court 判处 €500 罚款。', en: 'Vodafone Ireland pleaded guilty to a Regulation 13(1) charge and the Dublin Metropolitan District Court imposed a €500 fine.' }, DPC_VODAFONE_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-001',
    title: { zh: 'Orange｜邮箱广告与 Cookie 撤回', en: 'Orange | inbox advertising and cookie withdrawal' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'Orange', en: 'Orange' },
    topics: ['cookies', 'e_marketing'],
    surface: 'mixed',
    legalBases: [basis('fr-article-82'), basis('fr-cpce-l34-5')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 禁令已关闭', en: 'Fine recorded · injunction closed' },
    fineEur: 50_000_000,
    totalDecisionAmountEur: 50_000_000,
    amountAllocation: 'combined',
    fineScopeNote: { zh: '官方公告将 Cookie 与邮箱广告两项 ePrivacy 违法行为合并披露为 €50m。', en: 'The official notice reports one combined €50m amount for the cookie and inbox-advertising ePrivacy breaches.' },
    decisionReference: 'CNIL public notice · 2024-11-14',
    decisionDate: '2024-11-14',
    latestDate: '2025-09-11',
    summary: { zh: 'CNIL 认定 Orange 未经同意在邮箱中插入广告，并在用户撤回 Cookie 同意后继续读取原有 Cookie。', en: 'The CNIL found that Orange inserted advertising in inboxes without consent and continued reading cookies after users withdrew consent.' },
    evidenceNote: { zh: '两项违法行为均在 CNIL 公告中对应法国 Article L.34-5 与 Article 82；后续禁令已于 2025 年关闭。', en: 'The CNIL notice ties the two breaches to Article L.34-5 and Article 82; the follow-up injunction closed in 2025.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'authority_announcement',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialDecision('CNIL Orange €50m 处罚公告', ORANGE_SOURCE, 'authority_announcement'),
      officialSource({ zh: 'CNIL Orange 后续禁令关闭', en: 'CNIL Orange injunction closure' }, ORANGE_CLOSURE_SOURCE, 'follow_up'),
    ],
    events: [
      caseEvent('2024-11-14', { zh: '作出 €50m 罚款与禁令', en: '€50m fine and injunction issued' }, { zh: 'CNIL 对 Orange 作出 €50m 罚款，并要求停止在撤回同意后读取 Cookie。', en: 'The CNIL imposed a €50m fine on Orange and ordered it to stop reading cookies after consent withdrawal.' }, ORANGE_SOURCE),
      caseEvent('2025-09-11', { zh: '后续禁令关闭', en: 'Follow-up injunction closed' }, { zh: 'CNIL 认定 Orange 已完成该禁令范围内的整改。', en: 'The CNIL closed the injunction after finding compliance with its scope.' }, ORANGE_CLOSURE_SOURCE),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-002',
    title: { zh: 'Supermac’s｜退出后仍发送营销短信', en: 'Supermac’s | marketing SMS after opt-out' },
    authority: { zh: 'DPC', en: 'DPC' },
    country: { zh: '爱尔兰', en: 'Ireland' },
    entity: { zh: 'Supermac’s Ireland Limited', en: 'Supermac’s Ireland Limited' },
    topics: ['e_marketing'],
    surface: 'sms',
    legalBases: [basis('ie-si-336-reg-13')],
    outcome: 'prosecution',
    enforcementRoute: 'criminal_prosecution',
    status: { zh: '认罪 · 以慈善捐款代替定罪与罚款', en: 'Guilty plea · contribution in lieu of conviction and fine' },
    fineEur: null,
    totalDecisionAmountEur: null,
    amountAllocation: 'not_applicable',
    fineScopeNote: { zh: '法院要求向慈善机构捐款 €3,500，官方明确说明该款项代替定罪与罚款，因此不计入罚款总额。', en: 'The court ordered a €3,500 charitable contribution in lieu of conviction and fine; it is not counted in the fine total.' },
    monetaryOutcome: { zh: '€3,500 慈善捐款 + DPC 法律费用', en: '€3,500 charitable contribution + DPC legal costs' },
    decisionReference: 'Galway District Court · 2024-09-03',
    decisionDate: '2024-09-03',
    latestDate: '2024-09-03',
    summary: { zh: 'Supermac’s 在用户退出营销后仍发送 SMS；DPC 追诉五项未经同意发送营销短信的指控。', en: 'Supermac’s sent SMS marketing after an opt-out; the DPC prosecuted five charges involving unsolicited marketing messages.' },
    evidenceNote: { zh: 'DPC 官方案例页明确引用 Regulation 13 及 S.I. 336/2011，并区分慈善捐款与罚款。', en: 'The DPC case study expressly cites Regulation 13 and S.I. 336/2011, and distinguishes the charitable contribution from a fine.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'authority_announcement',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('DPC Supermac’s 官方案例', DPC_SUPERMACS_SOURCE, 'authority_announcement')],
    events: [caseEvent('2024-09-03', { zh: '法院处理五项营销短信指控', en: 'Court handled five marketing-SMS charges' }, { zh: 'Supermac’s 对五项未经同意发送营销短信的指控认罪，并支付 €3,500 慈善捐款及法律费用。', en: 'Supermac’s pleaded guilty to five unsolicited marketing-SMS charges and paid a €3,500 charitable contribution plus legal costs.' }, DPC_SUPERMACS_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-003',
    title: { zh: 'Thérapie Clinic｜退出后发送营销邮件', en: 'Thérapie Clinic | marketing email after opt-out' },
    authority: { zh: 'DPC', en: 'DPC' },
    country: { zh: '爱尔兰', en: 'Ireland' },
    entity: { zh: 'Valterous Limited T/A Thérapie Clinic', en: 'Valterous Limited T/A Thérapie Clinic' },
    topics: ['e_marketing'],
    surface: 'email',
    legalBases: [basis('ie-si-336-reg-13')],
    outcome: 'prosecution',
    enforcementRoute: 'criminal_prosecution',
    status: { zh: '追诉结案 · 以捐款代替罚款', en: 'Prosecution closed · donation in lieu of fine' },
    fineEur: null,
    totalDecisionAmountEur: null,
    amountAllocation: 'not_applicable',
    fineScopeNote: { zh: '法院要求 €325 慈善捐款与 €675 法律费用；官方明确为代替定罪与罚款，不计入罚款总额。', en: 'The court ordered a €325 charitable donation and €675 legal costs; the official source says this was in lieu of conviction and fine.' },
    monetaryOutcome: { zh: '€325 慈善捐款 + €675 DPC 法律费用', en: '€325 charitable donation + €675 DPC legal costs' },
    decisionReference: 'Dublin Metropolitan District Court · 2024-10-25',
    decisionDate: '2024-10-25',
    latestDate: '2024-10-25',
    summary: { zh: 'Thérapie Clinic 向已退出营销的客户发送未经同意的营销邮件，违反退出地址与电子营销规则。', en: 'Thérapie Clinic sent unsolicited marketing email to a customer who had opted out, breaching the opt-out and electronic-marketing rules.' },
    evidenceNote: { zh: 'DPC 官方案例页明确引用 Regulation 13(12)(c) 与 13(13)(a)(i)。', en: 'The DPC case study expressly cites Regulations 13(12)(c) and 13(13)(a)(i).' },
    evidenceStatus: 'verified',
    evidenceLevel: 'authority_announcement',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('DPC Thérapie Clinic 官方案例', DPC_THERAPIE_SOURCE, 'authority_announcement')],
    events: [caseEvent('2024-10-25', { zh: '追诉结案并作出捐款安排', en: 'Prosecution closed with donation order' }, { zh: '法院处理一项退出后营销邮件指控，以 €325 慈善捐款与法律费用结束程序。', en: 'The court handled one post-opt-out marketing-email charge and closed the matter with a €325 donation and legal costs.' }, DPC_THERAPIE_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-004',
    title: { zh: 'COSMOSPACE｜电子营销与敏感数据', en: 'COSMOSPACE | electronic marketing and sensitive data' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'COSMOSPACE', en: 'COSMOSPACE' },
    topics: ['e_marketing'],
    surface: 'mixed',
    legalBases: [basis('fr-cpce-l34-5'), basis('fr-gdpr-article-5-1-c'), basis('fr-gdpr-article-5-1-e'), basis('fr-gdpr-article-9')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '混合依据 · ePrivacy €50,000 份额已核验', en: 'Mixed legal bases · €50,000 ePrivacy allocation verified' },
    fineEur: 50_000,
    totalDecisionAmountEur: 250_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: 'SAN-2024-014 将 €250,000 拆为 GDPR €200,000 与 CPCE Article L.34-5 €50,000；本登记只计入后者。', en: 'SAN-2024-014 allocates €250,000 as €200,000 for GDPR and €50,000 for CPCE Article L.34-5; only the latter is counted here.' },
    decisionReference: 'SAN-2024-014',
    decisionDate: '2024-09-26',
    latestDate: '2024-09-26',
    summary: { zh: 'COSMOSPACE 涉及未经同意的商业推销、敏感数据收集与过度保存等多项问题。', en: 'COSMOSPACE involved commercial prospecting without consent, sensitive-data collection and excessive retention among other issues.' },
    evidenceNote: { zh: 'Légifrance 决定原文明确将 €50,000 归属于 CPCE Article L.34-5，将 €200,000 归属于 GDPR；本登记只计入 ePrivacy 份额。', en: 'The Légifrance decision explicitly assigns €50,000 to CPCE Article L.34-5 and €200,000 to GDPR; only the ePrivacy slice is counted here.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'mixed_needs_review',
    gdprExclusionReason: { zh: '决定明确将 €200,000 归属于 GDPR，将 €50,000 归属于 CPCE Article L.34-5；本 ePrivacy 总额只计入 €50,000。', en: 'The decision allocates €200,000 to GDPR and €50,000 to CPCE Article L.34-5; only €50,000 enters this ePrivacy total.' },
    sources: [
      officialDecision('CNIL COSMOSPACE / TELEMAQUE 处罚公告', COSMOSPACE_SOURCE, 'authority_announcement'),
      officialDecision('CNIL SAN-2024-014 决定', COSMOSPACE_DECISION),
    ],
    events: [caseEvent('2024-09-26', { zh: '作出 €250,000 混合罚款决定', en: '€250,000 mixed-basis fine decision issued' }, { zh: 'SAN-2024-014 对 COSMOSPACE 作出 €250,000 罚款，并明确其中 €50,000 对应 CPCE Article L.34-5。', en: 'SAN-2024-014 imposed a €250,000 fine on COSMOSPACE and expressly allocated €50,000 to CPCE Article L.34-5.' }, COSMOSPACE_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-005',
    title: { zh: 'TELEMAQUE｜电子营销与敏感数据', en: 'TELEMAQUE | electronic marketing and sensitive data' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'TELEMAQUE', en: 'TELEMAQUE' },
    topics: ['e_marketing'],
    surface: 'mixed',
    legalBases: [basis('fr-cpce-l34-5'), basis('fr-gdpr-article-5-1-e'), basis('fr-gdpr-article-9')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '混合依据 · ePrivacy €50,000 份额已核验', en: 'Mixed legal bases · €50,000 ePrivacy allocation verified' },
    fineEur: 50_000,
    totalDecisionAmountEur: 150_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: 'SAN-2024-015 将 €150,000 拆为 GDPR €100,000 与 CPCE Article L.34-5 €50,000；本登记只计入后者。', en: 'SAN-2024-015 allocates €150,000 as €100,000 for GDPR and €50,000 for CPCE Article L.34-5; only the latter is counted here.' },
    decisionReference: 'SAN-2024-015',
    decisionDate: '2024-09-26',
    latestDate: '2024-09-26',
    summary: { zh: 'TELEMAQUE 涉及未经同意的商业推销、敏感数据收集与过度保存等问题。', en: 'TELEMAQUE involved commercial prospecting without consent, sensitive-data collection and excessive retention.' },
    evidenceNote: { zh: 'Légifrance 决定原文明确将 €50,000 归属于 CPCE Article L.34-5，将 €100,000 归属于 GDPR；本登记只计入 ePrivacy 份额。', en: 'The Légifrance decision explicitly assigns €50,000 to CPCE Article L.34-5 and €100,000 to GDPR; only the ePrivacy slice is counted here.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'mixed_needs_review',
    gdprExclusionReason: { zh: '决定明确将 €100,000 归属于 GDPR，将 €50,000 归属于 CPCE Article L.34-5；本 ePrivacy 总额只计入 €50,000。', en: 'The decision allocates €100,000 to GDPR and €50,000 to CPCE Article L.34-5; only €50,000 enters this ePrivacy total.' },
    sources: [
      officialDecision('CNIL COSMOSPACE / TELEMAQUE 处罚公告', COSMOSPACE_SOURCE, 'authority_announcement'),
      officialDecision('CNIL SAN-2024-015 决定', TELEMAQUE_DECISION),
    ],
    events: [caseEvent('2024-09-26', { zh: '作出 €150,000 混合罚款决定', en: '€150,000 mixed-basis fine decision issued' }, { zh: 'SAN-2024-015 对 TELEMAQUE 作出 €150,000 罚款，并明确其中 €50,000 对应 CPCE Article L.34-5。', en: 'SAN-2024-015 imposed a €150,000 fine on TELEMAQUE and expressly allocated €50,000 to CPCE Article L.34-5.' }, TELEMAQUE_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2025-003',
    title: { zh: 'SOLOCAL MARKETING SERVICES｜数据经纪与电子营销', en: 'SOLOCAL MARKETING SERVICES | data brokerage and electronic marketing' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'SOLOCAL MARKETING SERVICES', en: 'SOLOCAL MARKETING SERVICES' },
    topics: ['e_marketing'],
    surface: 'mixed',
    legalBases: [basis('fr-cpce-l34-5'), basis('fr-gdpr-article-7')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '混合依据 · €900,000 未拆分', en: 'Mixed legal bases · €900,000 allocation unresolved' },
    fineEur: null,
    totalDecisionAmountEur: 900_000,
    amountAllocation: 'unresolved',
    fineScopeNote: { zh: 'SAN-2025-001 披露 €900,000 总罚款，依据为 CPCE Article L.34-5 与 GDPR Article 7，但决定未分配金额，暂不计入。', en: 'SAN-2025-001 discloses a €900,000 total fine under CPCE Article L.34-5 and GDPR Article 7, but does not allocate the amount, so it is not counted yet.' },
    decisionReference: 'SAN-2025-001',
    decisionDate: '2025-05-15',
    latestDate: '2026-09-17',
    summary: { zh: 'SOLOCAL 使用数据经纪商和游戏/试用表单获取的潜客数据，为广告主开展 SMS 或邮件商业推销。', en: 'SOLOCAL used prospect data obtained through data brokers and contest/testing forms to run SMS or email prospecting for advertisers.' },
    evidenceNote: { zh: 'Légifrance 决定原文确认 CPCE Article L.34-5 与 GDPR Article 7，但只披露 €900,000 合计，未提供可核验的法律依据金额分配。', en: 'The Légifrance decision confirms CPCE Article L.34-5 and GDPR Article 7, but discloses only a combined €900,000 and no verifiable allocation by legal basis.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'needs_review',
    reviewReason: { zh: '决定原文仍只给出 €900,000 合计，未拆分 CPCE 与 GDPR 金额；在有官方分配前继续复核。', en: 'The decision still gives only a combined €900,000 and does not split CPCE from GDPR; keep the case in review until an official allocation is available.' },
    gdprTreatment: 'mixed_needs_review',
    gdprExclusionReason: { zh: '决定同时涉及 CPCE 与 GDPR；不能因为主题是电子营销就把整笔罚款归入 ePrivacy。', en: 'The decision covers both CPCE and GDPR; the full fine cannot be attributed to ePrivacy merely because the topic is electronic marketing.' },
    sources: [
      officialDecision('CNIL SOLOCAL 官方公告', SOLOCAL_SOURCE, 'authority_announcement'),
      officialDecision('CNIL SAN-2025-001 决定', SOLOCAL_DECISION),
      officialSource({ zh: 'CNIL SOLOCAL 结案公告', en: 'CNIL SOLOCAL injunction closure notice' }, SOLOCAL_CLOSURE_SOURCE, 'follow_up', 'authority_announcement'),
      officialSource({ zh: 'CNIL SAN-2026-012 SOLOCAL 结案决定', en: 'CNIL SAN-2026-012 SOLOCAL closure decision' }, SOLOCAL_CLOSURE_DECISION, 'follow_up', 'primary_decision'),
    ],
    events: [
      caseEvent('2025-05-15', { zh: 'CNIL 作出 €900,000 混合罚款', en: 'CNIL imposed a €900,000 mixed-basis fine' }, { zh: 'SAN-2025-001 对 SOLOCAL MARKETING SERVICES 作出 €900,000 罚款；CPCE 与 GDPR 金额未拆分。', en: 'SAN-2025-001 imposed a €900,000 fine on SOLOCAL MARKETING SERVICES; the CPCE and GDPR portions are not allocated.' }, SOLOCAL_DECISION),
      caseEvent('2026-09-17', { zh: '结案 SOLOCAL 整改禁令', en: 'SOLOCAL injunction closed' }, { zh: 'CNIL SAN-2026-012 结案此前针对 SOLOCAL 的整改禁令；这项后续动作不改变原 €900,000 混合依据罚款的分配状态。', en: 'CNIL SAN-2026-012 closed the earlier SOLOCAL injunction; this follow-up does not change the allocation status of the original €900,000 mixed-basis fine.' }, SOLOCAL_CLOSURE_DECISION),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2025-004',
    title: { zh: 'CALOGA｜数据经纪与电子营销', en: 'CALOGA | data brokerage and electronic marketing' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'CALOGA', en: 'CALOGA' },
    topics: ['e_marketing'],
    surface: 'email',
    legalBases: [basis('fr-cpce-l34-5'), basis('fr-gdpr-article-5-1-e'), basis('fr-gdpr-article-6')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '混合依据 · €80,000 未拆分', en: 'Mixed legal bases · €80,000 allocation unresolved' },
    fineEur: null,
    totalDecisionAmountEur: 80_000,
    amountAllocation: 'unresolved',
    fineScopeNote: { zh: 'SAN-2025-002 披露 €80,000 总罚款，依据为 CPCE Article L.34-5 与 GDPR Articles 5(1)(e)、6，但决定未分配金额，暂不计入。', en: 'SAN-2025-002 discloses a €80,000 total fine under CPCE Article L.34-5 and GDPR Articles 5(1)(e) and 6, but does not allocate the amount, so it is not counted yet.' },
    decisionReference: 'SAN-2025-002',
    decisionDate: '2025-05-15',
    latestDate: '2025-05-15',
    summary: { zh: 'CALOGA 使用数据经纪商收集的潜客数据，为广告主开展未经有效同意的邮件推销。', en: 'CALOGA used prospect data from data brokers for email prospecting without valid consent on behalf of advertisers.' },
    evidenceNote: { zh: 'Légifrance 决定原文确认 CPCE Article L.34-5 与 GDPR Articles 5(1)(e)、6，但只披露 €80,000 合计，未提供可核验的法律依据金额分配。', en: 'The Légifrance decision confirms CPCE Article L.34-5 and GDPR Articles 5(1)(e) and 6, but discloses only a combined €80,000 and no verifiable allocation by legal basis.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'needs_review',
    reviewReason: { zh: '决定原文仍只给出 €80,000 合计，未拆分 CPCE 与 GDPR 金额；在有官方分配前继续复核。', en: 'The decision still gives only a combined €80,000 and does not split CPCE from GDPR; keep the case in review until an official allocation is available.' },
    gdprTreatment: 'mixed_needs_review',
    gdprExclusionReason: { zh: '决定同时涉及 CPCE 与 GDPR；整笔 €80,000 暂不计入 ePrivacy 总额。', en: 'The decision covers both CPCE and GDPR; the full €80,000 is not yet included in the ePrivacy total.' },
    sources: [
      officialDecision('CNIL CALOGA 官方公告', CALOGA_SOURCE, 'authority_announcement'),
      officialDecision('CNIL SAN-2025-002 决定', CALOGA_DECISION),
    ],
    events: [caseEvent('2025-05-15', { zh: 'CNIL 作出 €80,000 混合罚款', en: 'CNIL imposed a €80,000 mixed-basis fine' }, { zh: 'SAN-2025-002 对 CALOGA 作出 €80,000 罚款；CPCE 与 GDPR 金额未拆分。', en: 'SAN-2025-002 imposed an €80,000 fine on CALOGA; the CPCE and GDPR portions are not allocated.' }, CALOGA_DECISION)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2025-005',
    title: { zh: 'LES PUBLICATIONS CONDE NAST｜Vanity Fair Cookie', en: 'LES PUBLICATIONS CONDE NAST | Vanity Fair cookies' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'LES PUBLICATIONS CONDE NAST', en: 'LES PUBLICATIONS CONDE NAST' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款', en: 'Fine recorded' },
    fineEur: 750_000,
    totalDecisionAmountEur: 750_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€750,000 罚款针对 vanityfair.fr 在拒绝或撤回后仍放置/读取 Cookie 等问题。', en: 'The €750,000 fine covers cookie placement and continued reading after refusal or withdrawal on vanityfair.fr.' },
    decisionReference: 'SAN-2025-010',
    decisionDate: '2025-11-20',
    latestDate: '2025-11-20',
    summary: { zh: 'CNIL 发现 vanityfair.fr 在用户与横幅互动前放置需同意的 Cookie，并在拒绝或撤回后仍继续读取。', en: 'The CNIL found that vanityfair.fr placed consent-based cookies before banner interaction and continued reading them after refusal or withdrawal.' },
    evidenceNote: { zh: '官方公告明确依据法国《数据保护法》Article 82；此前已有整改令，后续检查仍发现问题。', en: 'The official notice expressly relies on Article 82; the company had previously received a compliance order, yet later checks found continued issues.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL Conde Nast / Vanity Fair 官方公告', CONDE_NAST_SOURCE, 'authority_announcement')],
    events: [caseEvent('2025-11-20', { zh: '作出 €750,000 罚款决定', en: '€750,000 fine decision issued' }, { zh: 'CNIL 对 LES PUBLICATIONS CONDE NAST 作出 €750,000 罚款。', en: 'The CNIL imposed a €750,000 fine on LES PUBLICATIONS CONDE NAST.' }, CONDE_NAST_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2025-006',
    title: { zh: 'American Express｜Cookie 撤回与拒绝', en: 'American Express | cookie withdrawal and refusal' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'AMERICAN EXPRESS CARTE FRANCE', en: 'AMERICAN EXPRESS CARTE FRANCE' },
    topics: ['cookies'],
    surface: 'web',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款', en: 'Fine recorded' },
    fineEur: 1_500_000,
    totalDecisionAmountEur: 1_500_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€1.5m 罚款按官方公告归入 Article 82 Cookie 违法；页面列出的 GDPR Article 5(1)(c) 为参考文本，不作为本记录计入依据。', en: 'The official notice attributes the €1.5m fine to Article 82 cookie breaches; GDPR Article 5(1)(c) appears as a reference text, not the counting basis here.' },
    decisionReference: 'SAN-2025-011',
    decisionDate: '2025-11-27',
    latestDate: '2025-11-27',
    summary: { zh: 'CNIL 发现 American Express 在用户作出选择前放置 Cookie、无视拒绝，并在撤回同意后继续读取。', en: 'The CNIL found that American Express placed cookies before a choice, ignored refusal, and continued reading cookies after withdrawal.' },
    evidenceNote: { zh: '这是一个有意保留实际法律依据边界的记录：官方页面的违法部分明确写为 Article 82，不能因为参考文本含 GDPR 就改算为 GDPR 案件。', en: 'This record preserves the actual legal-basis boundary: the official breach section is expressly Article 82, so a GDPR reference text does not reclassify it.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'authority_announcement',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL American Express 官方公告', AMERICAN_EXPRESS_SOURCE, 'authority_announcement')],
    events: [caseEvent('2025-11-27', { zh: '作出 €1.5m 罚款决定', en: '€1.5m fine decision issued' }, { zh: 'CNIL 对 AMERICAN EXPRESS CARTE FRANCE 作出 €1.5m 罚款。', en: 'The CNIL imposed a €1.5m fine on AMERICAN EXPRESS CARTE FRANCE.' }, AMERICAN_EXPRESS_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2026-001',
    title: { zh: 'FNAC Darty｜移动 App 终端标识符追踪', en: 'FNAC Darty | mobile-app terminal-identifier tracking' },
    authority: { zh: 'CNIL', en: 'CNIL' },
    country: { zh: '法国', en: 'France' },
    entity: { zh: 'FNAC DARTY PARTICIPATIONS ET SERVICES 与 FNAC DIRECT', en: 'FNAC DARTY PARTICIPATIONS ET SERVICES and FNAC DIRECT' },
    topics: ['device_identifiers'],
    surface: 'mobile_app',
    legalBases: [basis('fr-article-82')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 含日罚金整改令', en: 'Fine recorded · injunction with daily penalty' },
    fineEur: 7_000_000,
    totalDecisionAmountEur: 7_000_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '总额 €7m：FNAC DARTY PARTICIPATIONS ET SERVICES €6m，FNAC DIRECT €1m。', en: 'Total €7m: €6m against FNAC DARTY PARTICIPATIONS ET SERVICES and €1m against FNAC DIRECT.' },
    decisionReference: 'SAN-2026-015',
    decisionDate: '2026-10-22',
    latestDate: '2026-10-22',
    summary: { zh: 'CNIL 发现移动 App 通过 API 向第三方域名发送 FNAC 分配的用户标识符与浏览活动，用于个性化推荐和训练推荐算法，且未取得同意。', en: 'The CNIL found that the mobile app sent an FNAC-assigned identifier and browsing activity to a third-party domain for personalisation and recommendation-model training without consent.' },
    evidenceNote: { zh: '这是当前 Tracker 中最接近 App SDK / 终端标识符主题的已核验案件：官方公告明确写明移动 App、API、用户标识符与终端追踪。公告未称其为具体第三方 SDK，因此不额外声称 SDK。', en: 'This is the current verified record closest to the App SDK / terminal-identifier theme: the official notice names a mobile app, API, user identifier and tracking. It does not call the component a specific third-party SDK, so the record does not overclaim SDK use.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('CNIL FNAC Darty 移动 App 官方公告', FNAC_SOURCE, 'authority_announcement')],
    events: [caseEvent('2026-10-22', { zh: '作出 €7m 罚款与整改令', en: '€7m fine and injunction issued' }, { zh: 'CNIL 对两家 FNAC Darty 公司作出合计 €7m 罚款，并要求证明新的工具能在需要时取得同意。', en: 'The CNIL imposed a combined €7m fine and required the two FNAC Darty companies to demonstrate that their new tool obtains consent where necessary.' }, FNAC_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2026-002',
    title: { zh: 'Brown Thomas｜退出机制与营销邮件', en: 'Brown Thomas | opt-out mechanism and marketing email' },
    authority: { zh: 'DPC', en: 'DPC' },
    country: { zh: '爱尔兰', en: 'Ireland' },
    entity: { zh: 'Brown Thomas Arnotts Limited', en: 'Brown Thomas Arnotts Limited' },
    topics: ['e_marketing'],
    surface: 'email',
    legalBases: [basis('ie-si-336-reg-13')],
    outcome: 'prosecution',
    enforcementRoute: 'criminal_prosecution',
    status: { zh: '认罪结案 · 捐款与法律费用', en: 'Guilty plea closed · donation and legal costs' },
    fineEur: null,
    totalDecisionAmountEur: null,
    amountAllocation: 'not_applicable',
    fineScopeNote: { zh: '法院适用 Probation of Offenders Act，要求 €1,000 慈善捐款与 €1,000 DPC 法律费用，不计入罚款总额。', en: 'The court applied the Probation of Offenders Act and ordered a €1,000 charitable donation plus €1,000 DPC legal costs; neither is counted as a fine.' },
    monetaryOutcome: { zh: '€1,000 慈善捐款 + €1,000 DPC 法律费用', en: '€1,000 charitable donation + €1,000 DPC legal costs' },
    decisionReference: 'Dublin Metropolitan District Court · 2026-09-07',
    decisionDate: '2026-09-07',
    latestDate: '2026-09-07',
    summary: { zh: 'Brown Thomas 对 21 项样本指控中的 5 项认罪，涉及未提供有效退订地址及在撤回同意后继续发送营销材料。', en: 'Brown Thomas pleaded guilty to five sample charges out of 21, involving missing opt-out addresses and continued marketing after consent withdrawal.' },
    evidenceNote: { zh: 'DPC 官方公告明确引用 S.I. 336/2011 Regulation 13(1) 与 13(12)，并记录法院处置方式。', en: 'The DPC official announcement cites S.I. 336/2011 Regulation 13(1) and 13(12) and records the court outcome.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'authority_announcement',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [officialDecision('DPC Brown Thomas 官方公告', DPC_BROWN_THOMAS_SOURCE, 'authority_announcement')],
    events: [caseEvent('2026-09-07', { zh: '法院处理 5 项样本指控', en: 'Court handled five sample charges' }, { zh: 'Brown Thomas 认罪，法院要求慈善捐款 €1,000 与 DPC 法律费用 €1,000。', en: 'Brown Thomas pleaded guilty; the court ordered a €1,000 charitable donation and €1,000 in DPC legal costs.' }, DPC_BROWN_THOMAS_SOURCE)],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2026-003',
    title: { zh: 'Meta / Facebook｜App 读取终端相册', en: 'Meta / Facebook | app access to terminal photo gallery' },
    authority: { zh: 'Garante Privacy', en: 'Garante Privacy' },
    country: { zh: '意大利', en: 'Italy' },
    entity: { zh: 'Meta Platforms Ireland Limited', en: 'Meta Platforms Ireland Limited' },
    topics: ['device_identifiers'],
    surface: 'mobile_app',
    legalBases: [basis('it-article-122')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: '已罚款 · 终端访问整改令', en: 'Fine recorded · terminal-access remediation order' },
    fineEur: 805_000_000,
    totalDecisionAmountEur: 805_000_000,
    amountAllocation: 'exact',
    fineScopeNote: { zh: '€805m 罚款全部基于意大利《隐私法典》Article 122(1) 与 (2)，属于 ePrivacy 转化规则的终端信息访问执法。', en: 'The €805m fine is entirely based on Articles 122(1) and 122(2) of the Italian Privacy Code, an ePrivacy-transposition rule governing access to terminal information.' },
    decisionReference: 'Provvedimento 10321455',
    decisionDate: '2026-11-13',
    latestDate: '2026-11-14',
    summary: { zh: 'Garante Privacy 认定 Facebook Android App 在用户未作出针对该功能的具体、知情同意前，读取用户手机相册中的照片、视频及元数据，用于“浏览时相册建议”功能。', en: 'The Garante found that the Facebook Android app accessed users’ photos, videos and metadata for gallery suggestions without specific, informed consent for that function.' },
    evidenceNote: { zh: '官方决定明确认定这是 App 读取已存储在终端的信息，并依据 Article 122 作出 €805m 罚款与整改令；官方文本没有称其为 SDK，因此本记录不添加 App SDK 标签。', en: 'The official decision expressly treats this as an app accessing information stored in the terminal and imposes the €805m sanction under Article 122; it does not identify an SDK, so this record is not labelled App SDK.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'included',
    gdprTreatment: 'excluded',
    gdprExclusionReason: includedReason,
    sources: [
      officialDecision('Garante Meta €805m 官方公告', GARANTE_META_SOURCE, 'authority_announcement'),
      officialDecision('Garante Provvedimento 10321455 决定', GARANTE_META_DECISION),
    ],
    events: [
      caseEvent('2026-11-13', { zh: '作出 €805m 罚款决定', en: '€805m fine decision issued' }, { zh: 'Garante Privacy 依据 Article 122 对 Meta Platforms Ireland Limited 作出 €805m 罚款，并要求针对相册读取功能取得独立、具体同意。', en: 'The Garante imposed an €805m fine on Meta Platforms Ireland Limited under Article 122 and required separate, specific consent for the gallery-access feature.' }, GARANTE_META_DECISION),
      caseEvent('2026-11-14', { zh: '官方公告发布', en: 'Official announcement published' }, { zh: 'Garante 公告说明 Facebook Android App 读取照片、视频与元数据，且该功能在默认状态下启用。', en: 'The Garante announcement describes the Facebook Android app’s access to photos, videos and metadata, with the feature enabled by default.' }, GARANTE_META_SOURCE),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
  {
    id: 'EP-2024-006',
    title: { zh: 'Foodinho / Glovo｜App SDK 设备与定位数据（GDPR-only）', en: 'Foodinho / Glovo | app SDK device and location data (GDPR-only)' },
    authority: { zh: 'Garante Privacy', en: 'Garante Privacy' },
    country: { zh: '意大利', en: 'Italy' },
    entity: { zh: 'Foodinho s.r.l.（Glovo）', en: 'Foodinho s.r.l. (Glovo)' },
    topics: ['app_sdk', 'device_identifiers'],
    surface: 'mobile_app',
    legalBases: [basis('it-gdpr-articles-5-6-9-12-13-22-25-28-32-88')],
    outcome: 'fine',
    enforcementRoute: 'administrative_fine',
    status: { zh: 'GDPR 罚款 · SDK/API 整改要求', en: 'GDPR fine · SDK/API remediation requirements' },
    fineEur: null,
    totalDecisionAmountEur: 5_000_000,
    amountAllocation: 'not_applicable',
    fineScopeNote: { zh: '官方 €5m 罚款依据 GDPR 与意大利数据保护规则，不是 ePrivacy 转化规则，因此不计入本 Tracker 的 ePrivacy 总额。', en: 'The official €5m fine relies on GDPR and Italian data-protection provisions, not an ePrivacy-transposition rule, so it is excluded from this tracker’s ePrivacy total.' },
    decisionReference: 'Provvedimento 675 · 13 November 2024',
    decisionDate: '2024-11-13',
    latestDate: '2024-12-19',
    summary: { zh: 'Garante 记录了 App 通过 SDK/API 向第三方传输骑手 ID、设备信息、操作系统和定位数据，并作出 GDPR 罚款与整改要求。', en: 'The Garante recorded the app’s transfer of rider IDs, device information, operating-system data and location through SDKs/APIs, and imposed a GDPR fine with remediation requirements.' },
    evidenceNote: { zh: '这是明确提及 SDK 读取设备与定位信息的官方决定，但法律依据是 GDPR，不应被当作 ePrivacy 处罚金额。它作为 App SDK 参考案件显示在登记库中，但明确排除出 ePrivacy 总额。', en: 'This official decision explicitly mentions SDK access to device and location information, but its legal basis is GDPR rather than ePrivacy. It is shown as an App SDK reference record and explicitly excluded from the ePrivacy total.' },
    evidenceStatus: 'verified',
    evidenceLevel: 'primary_decision',
    trackerTreatment: 'excluded',
    gdprTreatment: 'included',
    sources: [
      officialDecision('Garante Foodinho / Glovo Provvedimento 675', GARANTE_FOODINHO_DECISION),
      officialSource({ zh: 'Garante Foodinho 后续整改期限决定', en: 'Garante Foodinho remediation-deadline decision' }, GARANTE_FOODINHO_FOLLOW_UP, 'follow_up', 'authority_announcement'),
    ],
    events: [
      caseEvent('2024-11-13', { zh: '作出 €5m GDPR 罚款决定', en: '€5m GDPR fine decision issued' }, { zh: 'Garante 对 Foodinho s.r.l. 作出 €5m 行政罚款，并要求整改 SDK/API 传输、定位与数据治理。', en: 'The Garante imposed a €5m administrative fine on Foodinho s.r.l. and required remediation of SDK/API transfers, location handling and data governance.' }, GARANTE_FOODINHO_DECISION),
      caseEvent('2024-12-19', { zh: '延长整改期限', en: 'Remediation deadline extended' }, { zh: 'Garante 对部分整改要求的期限作出延期处理。', en: 'The Garante granted an extension for selected remediation requirements.' }, GARANTE_FOODINHO_FOLLOW_UP),
    ],
    lastVerifiedAt: DATA_AS_OF,
  },
]
