import React, { useEffect, useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BiCheckCircle, BiListCheck, BiTargetLock, BiTime, BiRocket, BiRefresh, BiSearch, BiFilter, BiTask, BiBookAlt, BiCloud, BiCode, BiLockAlt } from 'react-icons/bi';
import AuthService from '../services/AuthService';
import adminApi from '../../api/admin';

const makeId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

ChartJS.register(ArcElement, Tooltip, Legend);
const StudyPlanAdmin = () => {
  const isAdmin = AuthService.isAdmin();

  const plan = useMemo(() => {
    return {
      rules: [
        '8 hours daily, 6 days/week',
        '2 DSA problems minimum daily',
        'Build 1 real project every 3 weeks',
        'Revise every Sunday',
        'No random YouTube scrolling'
      ],
      day1: [
        'Solve 3 array problems',
        'Revise Collections internals',
        'Implement custom HashMap',
        'Read JVM memory model',
        'Setup AWS free tier'
      ],
      month1: {
        title: 'Month 1: DSA + Core Java',
        dailyBlocks: ['DSA (2h)', 'Core Java (2h)', 'Advanced Java (2h)', 'Implementation + Revision (2h)'],
        weeks: [
          { title: 'Week 1', topics: ['Arrays', 'Strings', 'Sliding Window', 'Two Pointer'] },
          { title: 'Week 2', topics: ['LinkedList', 'Stack', 'Queue', 'Recursion'] },
          { title: 'Week 3', topics: ['Trees', 'DFS', 'BFS', 'BST'] },
          { title: 'Week 4', topics: ['Graphs', 'Heap', 'Priority Queue', 'Intro to DP'] }
        ],
        targets: ['Solve 120–150 problems in 30 days']
      },
      coreJava: [
        'OOP deeply',
        'Collections internals',
        'equals & hashCode',
        'Immutable objects',
        'Generics',
        'Exception handling',
        'Java 8 Streams',
        'Functional interfaces',
        'Multithreading',
        'ExecutorService',
        'CompletableFuture',
        'JVM memory model',
        'Garbage collection'
      ],
      month2: {
        title: 'Month 2: Backend + System Design + AWS',
        springBootWeeks: [
          'REST API',
          'CRUD',
          'JWT authentication',
          'Role-based access',
          'Pagination',
          'Global exception handling',
          'Logging',
          'Caching (Redis)',
          'Kafka basics'
        ],
        project1: 'User Management System',
        systemDesignWeek: [
          'Load balancer',
          'API Gateway',
          'Microservices',
          'CAP theorem',
          'Caching strategy',
          'Rate limiting',
          'Database indexing',
          'Sharding'
        ],
        systemDesignExercises: ['URL shortener', 'Payment gateway', 'WhatsApp', 'E-commerce system'],
        awsWeek: ['EC2', 'S3', 'RDS', 'IAM', 'Lambda', 'API Gateway', 'CloudWatch', 'Deploy Spring Boot to AWS'],
        project2: 'Cloud deployed microservice app'
      },
      month3: {
        title: 'Month 3: Advanced System Design + AI',
        advancedDesign: [
          'High availability',
          'Scalability',
          'Event-driven architecture',
          'Kafka architecture',
          'Circuit breaker',
          'SAGA pattern',
          'Distributed transactions'
        ],
        designs: ['Fraud detection wallet system', 'Ride sharing system', 'Streaming system'],
        ai: {
          learn: ['Python basics', 'Pandas', 'NumPy', 'ML basics', 'OpenAI API', 'Vector database', 'RAG architecture'],
          builds: ['AI Resume Analyzer', 'AI Chatbot with memory', 'AI fraud detection module']
        },
        project3: 'AI-powered backend app'
      },
      reality: [
        'No Netflix',
        'No wasting time',
        'No random scrolling',
        'Daily discipline',
        '4 sessions of 2h each',
        '10 min break between sessions',
        'Deep work only'
      ],
      dsaAdvanced: [
        'Backtracking',
        'Bit manipulation',
        'Math & number theory',
        'Greedy proofs',
        'Union-Find (Disjoint Set)',
        'Trie',
        'Segment Tree',
        'Fenwick Tree (BIT)',
        'Advanced DP (knapsack, LIS/LCS, digit DP)',
        'Matrix exponentiation'
      ],
      backendAdvanced: [
        'Transaction management',
        'Isolation levels',
        'Database indexing & query optimization',
        'Connection pooling',
        'N+1 query avoidance',
        'Caching layers & invalidation',
        'Idempotency & retries',
        'Bulk processing & batching'
      ],
      springCloud: [
        'Spring Cloud Config',
        'Spring Cloud Gateway',
        'Service discovery (Eureka/Consul)',
        'Resilience4j',
        'OpenFeign',
        'Distributed tracing (OpenTelemetry)'
      ],
      security: [
        'OWASP Top 10',
        'OAuth2/OIDC',
        'SSO',
        'CSRF & CORS',
        'Input validation & sanitization',
        'Secrets management'
      ],
      devops: [
        'Docker fundamentals',
        'Docker Compose',
        'Kubernetes basics',
        'Helm',
        'Terraform basics',
        'CI/CD (Jenkins/GitHub Actions)',
        'Artifact management'
      ],
      cloudAdvanced: [
        'AWS VPC & subnets',
        'Route53',
        'ALB/NLB',
        'ECS/EKS',
        'Secrets Manager',
        'Parameter Store',
        'Autoscaling',
        'Cost optimization'
      ],
      monitoring: [
        'Prometheus & Grafana',
        'ELK/Elastic Stack',
        'OpenTelemetry',
        'Alerting & SLOs',
        'Log correlation',
        'Blue/green & canary'
      ],
      testing: [
        'Unit testing',
        'Integration testing',
        'E2E testing',
        'Contract testing',
        'Testcontainers',
        'Load testing (JMeter/Gatling)'
      ],
      performance: [
        'JVM profiling',
        'GC tuning',
        'Thread dumps',
        'Async vs sync tradeoffs',
        'Database performance',
        'HTTP performance (keep-alive, compression)'
      ],
      dataEngineering: [
        'Basic ETL',
        'Pipelines',
        'Batch vs streaming',
        'Kafka consumers/producers',
        'Schema registry',
        'Data modeling'
      ],
      aiAdvanced: [
        'Transformers',
        'Fine-tuning',
        'Embeddings',
        'Prompt engineering',
        'Tools/RAG orchestration',
        'LLM evaluation'
      ],
      bestOfBest: [
        'Trees + Graphs + DP mastery',
        'Java Collections internals',
        'Concurrency & CompletableFuture',
        'Spring Boot production patterns',
        'Resilience & observability',
        'AWS deploy pipeline end-to-end',
        'System Design tradeoffs & capacity',
        'Security basics (OAuth2/OIDC)'
      ],
      fresherSchedule: [
        { slot: '08:00–10:00', focus: 'DSA', group: 'Schedule Fresher' },
        { slot: '10:15–12:15', focus: 'Core Java', group: 'Schedule Fresher' },
        { slot: '14:00–16:00', focus: 'Backend', group: 'Schedule Fresher' },
        { slot: '16:15–18:15', focus: 'System Design', group: 'Schedule Fresher' },
        { slot: '20:00–21:00', focus: 'Revision', group: 'Schedule Fresher' }
      ],
      experiencedSchedule: [
        { slot: '06:30–08:30', focus: 'Architecture/Design', group: 'Schedule Experienced' },
        { slot: '09:00–11:00', focus: 'Performance/Profiling', group: 'Schedule Experienced' },
        { slot: '13:30–15:30', focus: 'Cloud/DevOps', group: 'Schedule Experienced' },
        { slot: '16:00–18:00', focus: 'Security/Observability', group: 'Schedule Experienced' },
        { slot: '21:00–22:00', focus: 'Mentoring/Revision', group: 'Schedule Experienced' }
      ],
      personalSchedule: [
        { slot: '06:00–06:30', focus: 'Exercise', group: 'Personal Routine' },
        { slot: '06:30–07:00', focus: 'Walk', group: 'Personal Routine' },
        { slot: '07:00–07:30', focus: 'Breakfast', group: 'Personal Routine' },
        { slot: '12:30–13:00', focus: 'Lunch', group: 'Personal Routine' },
        { slot: '19:00–19:30', focus: 'Family Time', group: 'Personal Routine' },
        { slot: '19:30–20:00', focus: 'Dinner', group: 'Personal Routine' },
        { slot: '22:15–22:45', focus: 'My Time', group: 'Personal Routine' },
        { slot: '22:45–06:30', focus: 'Sleep', group: 'Personal Routine' }
      ]
    };
  }, []);

  const allItems = useMemo(() => {
    const items = [];
    plan.rules.forEach(t => items.push({ id: 'rule-' + makeId(t), group: 'Rules', title: t }));
    plan.day1.forEach(t => items.push({ id: 'day1-' + makeId(t), group: 'Day 1', title: t }));
    plan.month1.dailyBlocks.forEach(t => items.push({ id: 'm1-block-' + makeId(t), group: 'Month 1 Blocks', title: t }));
    plan.month1.weeks.forEach(w => w.topics.forEach(t => items.push({ id: 'm1-' + makeId(w.title) + '-' + makeId(t), group: w.title, title: t })));
    plan.month1.targets.forEach(t => items.push({ id: 'm1-target-' + makeId(t), group: 'Month 1 Target', title: t }));
    plan.coreJava.forEach(t => items.push({ id: 'core-' + makeId(t), group: 'Core Java', title: t }));
    plan.month2.springBootWeeks.forEach(t => items.push({ id: 'm2-sb-' + makeId(t), group: 'Spring Boot Week 5–6', title: t }));
    items.push({ id: 'm2-project1', group: 'Projects', title: plan.month2.project1 });
    plan.month2.systemDesignWeek.forEach(t => items.push({ id: 'm2-sd-' + makeId(t), group: 'System Design Week 7', title: t }));
    plan.month2.systemDesignExercises.forEach(t => items.push({ id: 'm2-sd-ex-' + makeId(t), group: 'Design Exercises', title: t }));
    plan.month2.awsWeek.forEach(t => items.push({ id: 'm2-aws-' + makeId(t), group: 'AWS Week 8', title: t }));
    items.push({ id: 'm2-project2', group: 'Projects', title: plan.month2.project2 });
    plan.month3.advancedDesign.forEach(t => items.push({ id: 'm3-adv-' + makeId(t), group: 'Advanced Design', title: t }));
    plan.month3.designs.forEach(t => items.push({ id: 'm3-design-' + makeId(t), group: 'System Designs', title: t }));
    plan.month3.ai.learn.forEach(t => items.push({ id: 'm3-ai-learn-' + makeId(t), group: 'AI Learn', title: t }));
    plan.month3.ai.builds.forEach(t => items.push({ id: 'm3-ai-build-' + makeId(t), group: 'AI Builds', title: t }));
    items.push({ id: 'm3-project3', group: 'Projects', title: plan.month3.project3 });
    plan.reality.forEach(t => items.push({ id: 'reality-' + makeId(t), group: 'Reality Check', title: t }));
    plan.dsaAdvanced.forEach(t => items.push({ id: 'dsa-adv-' + makeId(t), group: 'DSA Advanced', title: t }));
    plan.backendAdvanced.forEach(t => items.push({ id: 'backend-adv-' + makeId(t), group: 'Backend Advanced', title: t }));
    plan.springCloud.forEach(t => items.push({ id: 'spring-cloud-' + makeId(t), group: 'Spring Cloud', title: t }));
    plan.security.forEach(t => items.push({ id: 'security-' + makeId(t), group: 'Security', title: t }));
    plan.devops.forEach(t => items.push({ id: 'devops-' + makeId(t), group: 'DevOps', title: t }));
    plan.cloudAdvanced.forEach(t => items.push({ id: 'cloud-adv-' + makeId(t), group: 'AWS Advanced', title: t }));
    plan.monitoring.forEach(t => items.push({ id: 'monitoring-' + makeId(t), group: 'Monitoring', title: t }));
    plan.testing.forEach(t => items.push({ id: 'testing-' + makeId(t), group: 'Testing', title: t }));
    plan.performance.forEach(t => items.push({ id: 'performance-' + makeId(t), group: 'Performance', title: t }));
    plan.dataEngineering.forEach(t => items.push({ id: 'data-eng-' + makeId(t), group: 'Data Engineering', title: t }));
    plan.aiAdvanced.forEach(t => items.push({ id: 'ai-adv-' + makeId(t), group: 'AI Advanced', title: t }));
    plan.bestOfBest.forEach(t => items.push({ id: 'best-' + makeId(t), group: 'Top Priority', title: t }));
    plan.fresherSchedule.forEach(s => items.push({ id: 'sched-f-' + makeId(s.slot + '-' + s.focus), group: s.group, title: `${s.slot} ${s.focus}` }));
    plan.experiencedSchedule.forEach(s => items.push({ id: 'sched-e-' + makeId(s.slot + '-' + s.focus), group: s.group, title: `${s.slot} ${s.focus}` }));
    plan.personalSchedule.forEach(s => items.push({ id: 'sched-p-' + makeId(s.slot + '-' + s.focus), group: s.group, title: `${s.slot} ${s.focus}` }));
    return items;
  }, [plan]);

  const [status, setStatus] = useState(() => {
    try {
      const s = localStorage.getItem('studyPlanProgress');
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('studyPlanProgress', JSON.stringify(status));
  }, [status]);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [altSuggestions, setAltSuggestions] = useState([]);
  const [planStartDate, setPlanStartDate] = useState(() => {
    try {
      return localStorage.getItem('studyPlanStartDate') || '';
    } catch {
      return '';
    }
  });
  const [chartTrack, setChartTrack] = useState('fresher');

  const toggle = (id) => {
    setStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetGroup = (group, completed) => {
    const updates = {};
    allItems.filter(i => i.group === group).forEach(i => { updates[i.id] = !!completed; });
    setStatus(prev => ({ ...prev, ...updates }));
  };
  const suggestAlternate = (group) => {
    const evening = ['19:00–20:00', '20:15–21:15', '21:30–22:30'];
    const missed = allItems.filter(i => i.group === group && !status[i.id]);
    const out = [];
    for (let idx = 0; idx < missed.length && idx < evening.length; idx++) {
      out.push({ slot: evening[idx], focus: missed[idx].title.split(' ').slice(-1)[0], group });
    }
    setAltSuggestions(out);
  };

  const filtered = allItems.filter(i => {
    const matchesQuery = i.title.toLowerCase().includes(query.toLowerCase()) || i.group.toLowerCase().includes(query.toLowerCase());
    const s = !!status[i.id];
    if (filter === 'completed' && !s) return false;
    if (filter === 'pending' && s) return false;
    return matchesQuery;
  });

  const groups = Array.from(new Set(filtered.map(i => i.group)));

  const completedCount = Object.values(status).filter(Boolean).length;
  const totalCount = allItems.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    try {
      if (planStartDate) {
        localStorage.setItem('studyPlanStartDate', planStartDate);
      }
    } catch {}
  }, [planStartDate]);

  const dayNumber = useMemo(() => {
    if (!planStartDate) return null;
    const start = new Date(planStartDate);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    const diffDays = Math.floor((now.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }, [planStartDate]);

  const parseSlotHours = (slot) => {
    const [startStr, endStr] = slot.split('–');
    const [sh, sm] = startStr.split(':').map(Number);
    const [eh, em] = endStr.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    let durMin = endMin - startMin;
    if (durMin < 0) durMin += 24 * 60;
    return durMin / 60;
  };

  const timeChartData = useMemo(() => {
    const base = chartTrack === 'fresher' ? plan.fresherSchedule : plan.experiencedSchedule;
    const personal = plan.personalSchedule;
    const buckets = {};
    base.forEach(b => {
      buckets[b.focus] = (buckets[b.focus] || 0) + parseSlotHours(b.slot);
    });
    personal.forEach(p => {
      buckets[p.focus] = (buckets[p.focus] || 0) + parseSlotHours(p.slot);
    });
    const labels = Object.keys(buckets);
    const values = labels.map(l => Number(buckets[l].toFixed(2)));
    const colors = [
      '#0ea5e9','#22c55e','#f97316','#a78bfa','#f43f5e','#14b8a6','#ef4444',
      '#84cc16','#06b6d4','#eab308','#8b5cf6','#fb7185'
    ];
    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 0
      }]
    };
  }, [chartTrack, plan.fresherSchedule, plan.experiencedSchedule, plan.personalSchedule]);
  if (!isAdmin) {
    return (
      <div className="content-wrapper p-4">
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <BiLockAlt className="me-2" /> <span>Admin access required.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="mb-0 d-flex align-items-center"><BiTargetLock className="me-2" />90-Day War Plan</h5>
              <div className="d-flex gap-2">
                <span className="badge bg-primary d-flex align-items-center"><BiTask className="me-1" />{completedCount}/{totalCount}</span>
                <span className="badge bg-success">{pct}%</span>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><BiSearch /></span>
                    <input className="form-control" placeholder="Search tasks or groups" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><BiFilter /></span>
                    <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <div className="w-100">
                    <div className="progress" style={{ height: 10 }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${pct}%` }} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">{pct}%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="row g-3 mt-2">
      <div className="col-md-4">
        <label className="form-label small">Plan Start Date</label>
        <input type="date" className="form-control" value={planStartDate} onChange={(e) => setPlanStartDate(e.target.value)} />
        <small className="text-muted">Set when you start your 90 days</small>
      </div>
      <div className="col-md-4 d-flex align-items-center">
        <div>
          <div className="fw-semibold">Day {dayNumber ? Math.min(90, dayNumber) : '-' } of 90</div>
          <small className="text-muted">Includes sleep, meals, walk, family, personal time</small>
        </div>
      </div>
      <div className="col-md-4">
        <label className="form-label small">Track For Graph</label>
        <select className="form-select" value={chartTrack} onChange={(e) => setChartTrack(e.target.value)}>
          <option value="fresher">Fresher</option>
          <option value="experienced">Experienced</option>
        </select>
      </div>
    </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><BiListCheck className="me-2" />Rules</div>
            <div className="card-body">
              {plan.rules.map(t => {
                const id = 'rule-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><BiTime className="me-2" />Day 1 Checklist</div>
            <div className="card-body">
              {plan.day1.map(t => {
                const id = 'day1-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('Day 1', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('Day 1', true)}><BiCheckCircle className="me-1" />Mark All</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><BiRocket className="me-2" />Month 1 Blocks</div>
            <div className="card-body">
              {plan.month1.dailyBlocks.map(t => {
                const id = 'm1-block-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        {plan.month1.weeks.map(w => (
          <div className="col-lg-6" key={w.title}>
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <span>{w.title}</span>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup(w.title, false)}><BiRefresh className="me-1" />Reset</button>
                  <button className="btn btn-sm btn-success" onClick={() => resetGroup(w.title, true)}><BiCheckCircle className="me-1" />Mark All</button>
                  <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate(w.title)}>Suggest Alternate</button>
                </div>
              </div>
              <div className="card-body">
                {w.topics.map(t => {
                  const id = 'm1-' + makeId(w.title) + '-' + makeId(t);
                  const s = !!status[id];
                  return (
                    <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                        <label className="form-check-label" htmlFor={id}>{t}</label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header"><BiBookAlt className="me-2" />Core Java</div>
            <div className="card-body">
              {plan.coreJava.map(t => {
                const id = 'core-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header"><BiCode className="me-2" />Spring Boot Week 5–6</div>
            <div className="card-body">
              {plan.month2.springBootWeeks.map(t => {
                const id = 'm2-sb-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="m2-project1" checked={!!status['m2-project1']} onChange={() => toggle('m2-project1')} />
                  <label className="form-check-label" htmlFor="m2-project1">{plan.month2.project1}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">System Design Week 7</div>
            <div className="card-body">
              {plan.month2.systemDesignWeek.map(t => {
                const id = 'm2-sd-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                {plan.month2.systemDesignExercises.map(t => {
                  const id = 'm2-sd-ex-' + makeId(t);
                  const s = !!status[id];
                  return (
                    <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                        <label className="form-check-label" htmlFor={id}>{t}</label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('System Design Week 7', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('System Design Week 7', true)}><BiCheckCircle className="me-1" />Mark All</button>
                <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate('System Design Week 7')}>Suggest Alternate</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header"><BiCloud className="me-2" />AWS Week 8</div>
            <div className="card-body">
              {plan.month2.awsWeek.map(t => {
                const id = 'm2-aws-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="m2-project2" checked={!!status['m2-project2']} onChange={() => toggle('m2-project2')} />
                  <label className="form-check-label" htmlFor="m2-project2">{plan.month2.project2}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Advanced Design</div>
            <div className="card-body">
              {plan.month3.advancedDesign.map(t => {
                const id = 'm3-adv-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                {plan.month3.designs.map(t => {
                  const id = 'm3-design-' + makeId(t);
                  const s = !!status[id];
                  return (
                    <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                        <label className="form-check-label" htmlFor={id}>{t}</label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('Advanced Design', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('Advanced Design', true)}><BiCheckCircle className="me-1" />Mark All</button>
                <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate('Advanced Design')}>Suggest Alternate</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">AI Integration</div>
            <div className="card-body">
              <div className="mb-3 fw-semibold">Learn</div>
              {plan.month3.ai.learn.map(t => {
                const id = 'm3-ai-learn-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 fw-semibold">Build</div>
              {plan.month3.ai.builds.map(t => {
                const id = 'm3-ai-build-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="m3-project3" checked={!!status['m3-project3']} onChange={() => toggle('m3-project3')} />
                  <label className="form-check-label" htmlFor="m3-project3">{plan.month3.project3}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">Reality Check</div>
            <div className="card-body">
              {plan.reality.map(t => {
                const id = 'reality-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">DSA Advanced</div>
            <div className="card-body">
              {plan.dsaAdvanced.map(t => {
                const id = 'dsa-adv-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Backend Advanced</div>
            <div className="card-body">
              {plan.backendAdvanced.map(t => {
                const id = 'backend-adv-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Spring Cloud</div>
            <div className="card-body">
              {plan.springCloud.map(t => {
                const id = 'spring-cloud-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Security</div>
            <div className="card-body">
              {plan.security.map(t => {
                const id = 'security-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">DevOps</div>
            <div className="card-body">
              {plan.devops.map(t => {
                const id = 'devops-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">AWS Advanced</div>
            <div className="card-body">
              {plan.cloudAdvanced.map(t => {
                const id = 'cloud-adv-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Monitoring & Observability</div>
            <div className="card-body">
              {plan.monitoring.map(t => {
                const id = 'monitoring-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Testing Strategy</div>
            <div className="card-body">
              {plan.testing.map(t => {
                const id = 'testing-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Performance Engineering</div>
            <div className="card-body">
              {plan.performance.map(t => {
                const id = 'performance-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Data Engineering Basics</div>
            <div className="card-body">
              {plan.dataEngineering.map(t => {
                const id = 'data-eng-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">AI Advanced</div>
            <div className="card-body">
              {plan.aiAdvanced.map(t => {
                const id = 'ai-adv-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Top Priority (Best of Best)</div>
            <div className="card-body">
              {plan.bestOfBest.map(t => {
                const id = 'best-' + makeId(t);
                const s = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={s} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{t}</label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Fresher Daily Schedule</div>
            <div className="card-body">
              {plan.fresherSchedule.map(s => {
                const id = 'sched-f-' + makeId(s.slot + '-' + s.focus);
                const checked = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={checked} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{s.slot} {s.focus}</label>
                    </div>
                  </div>
                );
              })}
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('Schedule Fresher', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('Schedule Fresher', true)}><BiCheckCircle className="me-1" />Mark All</button>
                <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate('Schedule Fresher')}>Suggest Alternate</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Experienced Daily Schedule</div>
            <div className="card-body">
              {plan.experiencedSchedule.map(s => {
                const id = 'sched-e-' + makeId(s.slot + '-' + s.focus);
                const checked = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={checked} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{s.slot} {s.focus}</label>
                    </div>
                  </div>
                );
              })}
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('Schedule Experienced', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('Schedule Experienced', true)}><BiCheckCircle className="me-1" />Mark All</button>
                <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate('Schedule Experienced')}>Suggest Alternate</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Personal Routine</div>
            <div className="card-body">
              {plan.personalSchedule.map(s => {
                const id = 'sched-p-' + makeId(s.slot + '-' + s.focus);
                const checked = !!status[id];
                return (
                  <div key={id} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" checked={checked} onChange={() => toggle(id)} id={id} />
                      <label className="form-check-label" htmlFor={id}>{s.slot} {s.focus}</label>
                    </div>
                  </div>
                );
              })}
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => resetGroup('Personal Routine', false)}><BiRefresh className="me-1" />Reset</button>
                <button className="btn btn-sm btn-success" onClick={() => resetGroup('Personal Routine', true)}><BiCheckCircle className="me-1" />Mark All</button>
                <button className="btn btn-sm btn-primary" onClick={() => suggestAlternate('Personal Routine')}>Suggest Alternate</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">Time Allocation</div>
            <div className="card-body">
              <div className="mb-3">
                <small className="text-muted">Graph includes selected track plus personal routine</small>
              </div>
              <div style={{ height: 300 }}>
                <Pie data={timeChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {altSuggestions.length > 0 && (
        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="card">
              <div className="card-header">Alternate Timings (Missed Items)</div>
              <div className="card-body">
                {altSuggestions.map((s, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between mb-2">
                    <span>{s.slot} → {s.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanAdmin;
