<template>
  <section class="dashboard-preview">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('dashboard.title') }}</h2>
        <p>{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="dashboard-simple">
        <div class="metrics-grid-simple">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card-simple">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-info">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value">{{ metric.value }}</div>
            </div>
            <div class="metric-trend" :class="metric.trendDirection">{{ metric.trend }}</div>
          </div>
        </div>
        <div class="chart-simple">
          <div class="chart-header">
            <span class="chart-title">{{ t('dashboard.monthlyRevenue') }}</span>
            <span class="chart-period">{{ t('dashboard.lastTwelveMonths') }}</span>
          </div>
          <div class="chart-bars-simple">
            <div v-for="bar in monthlyBars" :key="bar.month" class="chart-bar-simple" :style="{ height: bar.height }">
              <span>{{ bar.month }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Dashboard Section module.
 */
import { computed } from 'vue'
import { useLandingI18n } from '../composables/useLandingI18n'

const { t } = useLandingI18n()

const metrics = computed(() => [
  { icon: '👥', label: t('dashboard.totalUsers'), value: '12,847', trend: '↑ 12.5%', trendDirection: 'positive' },
  { icon: '💰', label: t('dashboard.revenue'), value: '$48,290', trend: '↑ 8.2%', trendDirection: 'positive' },
  { icon: '📦', label: t('dashboard.orders'), value: '1,429', trend: '↓ 3.1%', trendDirection: 'negative' },
  { icon: '📈', label: t('dashboard.conversion'), value: '3.24%', trend: '↑ 1.8%', trendDirection: 'positive' },
])

const monthlyBars = [
  { month: 'Jan', height: '60%' },
  { month: 'Feb', height: '80%' },
  { month: 'Mar', height: '45%' },
  { month: 'Apr', height: '90%' },
  { month: 'May', height: '70%' },
  { month: 'Jun', height: '85%' },
  { month: 'Jul', height: '55%' },
  { month: 'Aug', height: '75%' },
  { month: 'Sep', height: '65%' },
  { month: 'Oct', height: '95%' },
  { month: 'Nov', height: '50%' },
  { month: 'Dec', height: '88%' },
]
</script>