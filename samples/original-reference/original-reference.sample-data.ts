/* ------------------------------------------------------------------ */
/*  Greeting helpers — dynamic, matching the reference runtime         */
/* ------------------------------------------------------------------ */

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getGreetingIcon(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙'
  if (hour < 12) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌙'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export const originalReferenceDashboardSample = {
  greetingIcon: getGreetingIcon(),
  title: `${getGreetingText()}, Admin`,
  subtitle: getFormattedDate(),
  chips: [
    { id: 'chip-clients', text: '247 clients', icon: 'people' },
    { id: 'chip-orders', text: '18 orders today', icon: 'shopping_cart' },
  ],
  metrics: [
    { id: 'metric-total-orders', label: 'Total Orders', value: 1847, icon: 'shopping_cart', tone: 'neutral' as const },
    { id: 'metric-pending-orders', label: 'Pending', value: 34, icon: 'inbox', tone: 'info' as const },
    { id: 'metric-progress-orders', label: 'In Progress', value: 52, icon: 'pending_actions', tone: 'warning' as const },
    { id: 'metric-completed-orders', label: 'Completed', value: 1680, icon: 'task_alt', tone: 'success' as const },
    { id: 'metric-cancelled-orders', label: 'Cancelled', value: 81, icon: 'cancel', tone: 'danger' as const },
  ],
  statusSegments: [
    { id: 'status-pending', label: 'Pending', value: 34, color: 'var(--ntk-info)' },
    { id: 'status-progress', label: 'In Progress', value: 52, color: 'var(--ntk-warning)' },
    { id: 'status-completed', label: 'Completed', value: 1680, color: 'var(--ntk-success)' },
    { id: 'status-cancelled', label: 'Cancelled', value: 81, color: 'var(--ntk-text-muted)' },
  ],
  categorySeries: [
    { id: 'category-electronics', label: 'Electronics', value: 523, color: 'var(--ntk-info)' },
    { id: 'category-food', label: 'Food', value: 412, color: 'var(--ntk-accent)' },
    { id: 'category-fashion', label: 'Fashion', value: 287, color: 'var(--ntk-warning)' },
    { id: 'category-hygiene', label: 'Hygiene', value: 198, color: 'var(--ntk-success)' },
  ],
  activities: [
    { id: 'activity-today', label: 'Orders today', value: 18, icon: 'today', iconTone: 'blue' as const },
    { id: 'activity-week', label: 'Orders this week', value: 87, icon: 'date_range', iconTone: 'indigo' as const },
    { id: 'activity-month', label: 'Orders this month', value: 342, icon: 'calendar_month', iconTone: 'violet' as const },
    { id: 'activity-revenue', label: 'Monthly revenue', value: '$156,780', icon: 'attach_money', iconTone: 'green' as const },
    { id: 'activity-clients', label: 'New clients this month', value: 23, icon: 'person_add', iconTone: 'amber' as const },
  ],
  topItems: [
    {
      id: 'top-client-1',
      name: 'Distribuidora Alfa Ltda',
      avatar: 'DA',
      value: 45,
      valueCaption: 'orders',
      secondaryValue: '$32,500',
      secondaryCaption: 'revenue',
      barPercent: 100,
    },
    {
      id: 'top-client-2',
      name: 'Comércio Beta SA',
      avatar: 'CB',
      value: 38,
      valueCaption: 'orders',
      secondaryValue: '$28,900',
      secondaryCaption: 'revenue',
      barPercent: 84,
    },
    {
      id: 'top-client-3',
      name: 'Indústria Gamma ME',
      avatar: 'IG',
      value: 32,
      valueCaption: 'orders',
      secondaryValue: '$24,100',
      secondaryCaption: 'revenue',
      barPercent: 71,
    },
    {
      id: 'top-client-4',
      name: 'Atacado Delta Eireli',
      avatar: 'AD',
      value: 27,
      valueCaption: 'orders',
      secondaryValue: '$19,800',
      secondaryCaption: 'revenue',
      barPercent: 60,
    },
    {
      id: 'top-client-5',
      name: 'Varejo Epsilon Ltda',
      avatar: 'VE',
      value: 21,
      valueCaption: 'orders',
      secondaryValue: '$15,600',
      secondaryCaption: 'revenue',
      barPercent: 47,
    },
  ],
}
