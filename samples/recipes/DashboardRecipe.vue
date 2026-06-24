<template>
  <DsMetricGrid :metrics="metrics" :columns="3" aria-label="Indicadores" />
</template>

<script setup lang="ts">
import { DsMetricGrid } from '../../index'

const metrics = [
  { id: 'revenue', label: 'Receita', value: 'R$ 128k', delta: '+12%', deltaDirection: 'up' as const },
  { id: 'active', label: 'Clientes ativos', value: '1.204', delta: '+3%', deltaDirection: 'up' as const },
  { id: 'churn', label: 'Churn', value: '1,8%', delta: '-0,4%', deltaDirection: 'down' as const },
]
</script>