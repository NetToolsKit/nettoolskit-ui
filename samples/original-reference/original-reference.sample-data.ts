/* ------------------------------------------------------------------ */
/*  Greeting helpers — dynamic, matching the reference runtime         */
/* ------------------------------------------------------------------ */

function getGreetingText(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getGreetingIcon(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '🌙'
  if (hour < 12) return '☀️'
  if (hour < 18) return '🌤️'
  return '🌙'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
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
    { id: 'chip-clients', text: '247 clientes', icon: 'people' },
    { id: 'chip-orders', text: '18 pedidos hoje', icon: 'shopping_cart' },
  ],
  metrics: [
    { id: 'metric-total-orders', label: 'Total Pedidos', value: 1847, icon: 'shopping_cart', tone: 'neutral' as const },
    { id: 'metric-pending-orders', label: 'Pendentes', value: 34, icon: 'inbox', tone: 'info' as const },
    { id: 'metric-progress-orders', label: 'Em Progresso', value: 52, icon: 'pending_actions', tone: 'warning' as const },
    { id: 'metric-completed-orders', label: 'Concluídos', value: 1680, icon: 'task_alt', tone: 'success' as const },
    { id: 'metric-cancelled-orders', label: 'Cancelados', value: 81, icon: 'cancel', tone: 'danger' as const },
  ],
  statusSegments: [
    { id: 'status-pending', label: 'Pendentes', value: 34, color: '#3b82f6' },
    { id: 'status-progress', label: 'Em Progresso', value: 52, color: '#f59e0b' },
    { id: 'status-completed', label: 'Concluídos', value: 1680, color: '#10b981' },
    { id: 'status-cancelled', label: 'Cancelados', value: 81, color: '#64748b' },
  ],
  categorySeries: [
    { id: 'category-electronics', label: 'Eletrônicos', value: 523, color: '#3b82f6' },
    { id: 'category-food', label: 'Alimentos', value: 412, color: '#f97316' },
    { id: 'category-fashion', label: 'Vestuário', value: 287, color: '#eab308' },
    { id: 'category-hygiene', label: 'Higiene', value: 198, color: '#22c55e' },
  ],
  activities: [
    { id: 'activity-today', label: 'Pedidos hoje', value: 18, icon: 'today', iconTone: 'blue' as const },
    { id: 'activity-week', label: 'Pedidos na semana', value: 87, icon: 'date_range', iconTone: 'indigo' as const },
    { id: 'activity-month', label: 'Pedidos no mês', value: 342, icon: 'calendar_month', iconTone: 'violet' as const },
    { id: 'activity-revenue', label: 'Faturamento do mês', value: 'R$ 156.780', icon: 'attach_money', iconTone: 'green' as const },
    { id: 'activity-clients', label: 'Novos clientes no mês', value: 23, icon: 'person_add', iconTone: 'amber' as const },
  ],
  topItems: [
    {
      id: 'top-client-1',
      name: 'Distribuidora Alfa Ltda',
      avatar: 'DA',
      value: 45,
      valueCaption: 'pedidos',
      secondaryValue: 'R$ 32.500',
      secondaryCaption: 'fatur.',
      barPercent: 100,
    },
    {
      id: 'top-client-2',
      name: 'Comércio Beta SA',
      avatar: 'CB',
      value: 38,
      valueCaption: 'pedidos',
      secondaryValue: 'R$ 28.900',
      secondaryCaption: 'fatur.',
      barPercent: 84,
    },
    {
      id: 'top-client-3',
      name: 'Indústria Gamma ME',
      avatar: 'IG',
      value: 32,
      valueCaption: 'pedidos',
      secondaryValue: 'R$ 24.100',
      secondaryCaption: 'fatur.',
      barPercent: 71,
    },
    {
      id: 'top-client-4',
      name: 'Atacado Delta Eireli',
      avatar: 'AD',
      value: 27,
      valueCaption: 'pedidos',
      secondaryValue: 'R$ 19.800',
      secondaryCaption: 'fatur.',
      barPercent: 60,
    },
    {
      id: 'top-client-5',
      name: 'Varejo Epsilon Ltda',
      avatar: 'VE',
      value: 21,
      valueCaption: 'pedidos',
      secondaryValue: 'R$ 15.600',
      secondaryCaption: 'fatur.',
      barPercent: 47,
    },
  ],
}
