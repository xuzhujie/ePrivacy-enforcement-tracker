import type { EnforcementTopic } from '../data/cases.ts'
import { TOPIC_META } from '../data/cases.ts'
import type { Language } from '../lib/i18n.ts'
import { copy } from '../lib/copy.ts'

interface TopicTabsProps {
  topic: EnforcementTopic | 'all'
  counts: Record<EnforcementTopic, number>
  allCount: number
  onTopicChange: (topic: EnforcementTopic | 'all') => void
  language: Language
}

const TOPICS: EnforcementTopic[] = ['cookies', 'app_sdk', 'device_identifiers', 'e_marketing']

export function TopicTabs({ topic, counts, allCount, onTopicChange, language }: TopicTabsProps) {
  return (
    <div className="topic-tabs-shell">
      <span className="topic-tabs-scope">{copy(language, 'topicCountsScope')}</span>
      <div className="topic-tabs" role="tablist" aria-label={`${copy(language, 'topics')} · ${copy(language, 'topicCountsScope')}`}>
      <button type="button" className={`topic-tab ${topic === 'all' ? 'is-active' : ''}`} onClick={() => onTopicChange('all')} role="tab" aria-selected={topic === 'all'}>
        <span>{copy(language, 'allCases')}</span><b>{allCount}</b>
      </button>
      {TOPICS.map((item) => (
        <button type="button" className={`topic-tab ${topic === item ? 'is-active' : ''}`} onClick={() => onTopicChange(item)} key={item} role="tab" aria-selected={topic === item}>
          <span>{TOPIC_META[item].label[language]}</span><b>{counts[item]}</b>
        </button>
      ))}
      </div>
    </div>
  )
}
