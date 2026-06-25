<template>
  <!-- Mocked storefront, front-only. Category DsTabs, a responsive DsCard
       product grid with DsBadge tags and "Add to cart" DsButton (toast + cart
       count), a cart DsDrawer with a DsTable + total, and a checkout DsDialog
       hosting a schema DsForm. Everything is component state; no backend. -->
  <div class="shop">
    <header class="shop__header">
      <div>
        <p class="shop__kicker">Storefront</p>
        <h1 class="shop__title">Loja</h1>
        <p class="shop__lead">
          Catálogo mockado: categorias, grade de produtos, carrinho e checkout
          &mdash; só componentes da biblioteca, estado em memória.
        </p>
      </div>
      <DsButton
        intent="primary"
        variant="outline"
        :label="cartButtonLabel"
        @click="cartOpen = true"
      />
    </header>

    <DsBanner
      v-if="lastOrder"
      intent="success"
      variant="soft"
      title="Pedido confirmado"
      :message="`Obrigado, ${lastOrder}! Seu pedido foi recebido.`"
      dismissible
      @dismiss="lastOrder = null"
    />

    <DsTabs
      v-model="category"
      :tabs="categoryTabs"
      aria-label="Categorias de produtos"
    />

    <section class="shop__grid" aria-label="Produtos">
      <DsCard
        v-for="product in visibleProducts"
        :key="product.id"
        class="shop__card"
        variant="outlined"
      >
        <template #header>
          <div class="shop__thumb" aria-hidden="true">
            <span class="shop__thumb-text">{{ product.initials }}</span>
          </div>
          <div class="shop__card-head">
            <h2 class="shop__card-title">{{ product.name }}</h2>
            <DsBadge
              v-if="product.tag"
              :label="product.tag === 'new' ? 'New' : 'Sale'"
              :intent="product.tag === 'new' ? 'info' : 'danger'"
              variant="soft"
              size="sm"
            />
          </div>
        </template>

        <p class="shop__price">{{ formatPrice(product.price) }}</p>

        <template #footer>
          <DsButton
            intent="primary"
            size="sm"
            :label="'Add to cart'"
            @click="addToCart(product)"
          />
        </template>
      </DsCard>
    </section>

    <!-- Cart drawer (right side). -->
    <DsDrawer
      id="shop-cart"
      v-model="cartOpen"
      side="right"
      size="lg"
      title="Carrinho"
      nav-label="Itens do carrinho"
    >
      <div class="shop__cart">
        <p v-if="cartItems.length === 0" class="shop__cart-empty">
          Seu carrinho está vazio.
        </p>

        <template v-else>
          <DsTable
            :columns="cartColumns"
            :rows="cartRows"
            density="compact"
            aria-label="Itens do carrinho"
          />
          <p class="shop__cart-total">
            Total: <strong>{{ formatPrice(cartTotal) }}</strong>
          </p>
          <DsButton
            intent="primary"
            label="Checkout"
            @click="openCheckout"
          />
        </template>
      </div>
    </DsDrawer>

    <!-- Checkout dialog with a schema-driven DsForm. -->
    <DsDialog
      id="shop-checkout"
      v-model="checkoutOpen"
      title="Checkout"
      description="Preencha os dados para finalizar o pedido."
    >
      <DsForm
        id-prefix="checkout-form"
        :schema="checkoutSchema"
        :model-value="checkoutValues"
        :show-reset="false"
        submit-label="Confirmar pedido"
        @update:model-value="checkoutValues = $event"
        @submit="onCheckoutSubmit"
      />
    </DsDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DsBadge,
  DsBanner,
  DsButton,
  DsCard,
  DsDialog,
  DsDrawer,
  DsForm,
  DsTable,
  DsTabs,
  defineForm,
  pushToast,
  type NtkTabItem,
  type NtkTableColumn,
  type NtkTableRow,
} from '../../index'

type Category = 'apparel' | 'electronics' | 'home'

interface Product {
  id: string
  name: string
  initials: string
  price: number
  category: Category
  tag?: 'new' | 'sale'
}

const products: Product[] = [
  { id: 'p1', name: 'Camiseta básica', initials: 'CB', price: 79.9, category: 'apparel', tag: 'new' },
  { id: 'p2', name: 'Moletom com capuz', initials: 'MC', price: 199.9, category: 'apparel' },
  { id: 'p3', name: 'Tênis runner', initials: 'TR', price: 349.9, category: 'apparel', tag: 'sale' },
  { id: 'p4', name: 'Fone bluetooth', initials: 'FB', price: 259.0, category: 'electronics', tag: 'new' },
  { id: 'p5', name: 'Teclado mecânico', initials: 'TM', price: 429.0, category: 'electronics' },
  { id: 'p6', name: 'Webcam HD', initials: 'WH', price: 189.0, category: 'electronics', tag: 'sale' },
  { id: 'p7', name: 'Luminária de mesa', initials: 'LM', price: 119.0, category: 'home' },
  { id: 'p8', name: 'Jogo de canecas', initials: 'JC', price: 89.0, category: 'home', tag: 'new' },
  { id: 'p9', name: 'Manta de sofá', initials: 'MS', price: 149.0, category: 'home' },
]

const categoryTabs: NtkTabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'home', label: 'Home' },
]
const category = ref('all')

const visibleProducts = computed(() =>
  category.value === 'all'
    ? products
    : products.filter((product) => product.category === category.value))

const formatPrice = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Cart state.
interface CartLine {
  product: Product
  qty: number
}
const cart = ref<CartLine[]>([])
const cartItems = computed(() => cart.value)
const cartCount = computed(() => cart.value.reduce((sum, line) => sum + line.qty, 0))
const cartTotal = computed(() =>
  cart.value.reduce((sum, line) => sum + line.product.price * line.qty, 0))
const cartButtonLabel = computed(() => `Carrinho (${cartCount.value})`)

const cartOpen = ref(false)

function addToCart(product: Product): void {
  const existing = cart.value.find((line) => line.product.id === product.id)
  if (existing) {
    existing.qty += 1
  } else {
    cart.value = [...cart.value, { product, qty: 1 }]
  }
  pushToast({ message: `${product.name} adicionado ao carrinho`, intent: 'success', timeout: 2500 })
}

const cartColumns: NtkTableColumn[] = [
  { id: 'name', label: 'Produto' },
  { id: 'qty', label: 'Qtd', align: 'center' },
  { id: 'subtotal', label: 'Subtotal', align: 'right' },
]
const cartRows = computed<NtkTableRow[]>(() =>
  cart.value.map((line) => ({
    id: line.product.id,
    cells: {
      name: line.product.name,
      qty: line.qty,
      subtotal: formatPrice(line.product.price * line.qty),
    },
  })))

// Checkout.
const checkoutOpen = ref(false)
const lastOrder = ref<string | null>(null)
const checkoutSchema = defineForm({
  columns: 2,
  fields: [
    { field: 'name', type: 'text', label: 'Nome', required: true, minLength: 2 },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
    { field: 'address', type: 'text', label: 'Endereço', required: true, colSpan: 2 },
    {
      field: 'payment',
      type: 'select',
      label: 'Pagamento',
      required: true,
      colSpan: 2,
      options: [
        { label: 'Cartão de crédito', value: 'credit' },
        { label: 'Pix', value: 'pix' },
        { label: 'Boleto', value: 'boleto' },
      ],
    },
  ],
})
const checkoutValues = ref<Record<string, unknown>>({})

function openCheckout(): void {
  if (cart.value.length === 0) {
    return
  }
  checkoutOpen.value = true
}

function onCheckoutSubmit(values: Record<string, unknown>): void {
  const buyer = String(values.name ?? 'cliente')
  lastOrder.value = buyer
  checkoutOpen.value = false
  cartOpen.value = false
  cart.value = []
  checkoutValues.value = {}
  pushToast({ message: 'Pedido confirmado com sucesso!', intent: 'success' })
}
</script>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-lg);
}

.shop__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ntk-spacing-md);
  flex-wrap: wrap;
}

.shop__kicker {
  margin: 0 0 var(--ntk-spacing-xs);
  color: var(--ntk-primary);
  font-size: var(--ntk-font-size-sm);
  font-weight: var(--ntk-font-weight-bold);
  text-transform: uppercase;
}

.shop__title {
  margin: 0 0 var(--ntk-spacing-xs);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
}

.shop__lead {
  margin: 0;
  max-inline-size: 44rem;
  color: var(--ntk-text-secondary);
}

.shop__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: var(--ntk-spacing-md);
}

.shop__card {
  block-size: 100%;
}

.shop__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 7rem;
  border-radius: var(--ntk-radius-md);
  background: var(--ntk-bg-secondary);
  border: 1px solid var(--ntk-border-light);
}

.shop__thumb-text {
  font-family: var(--ntk-font-family-display);
  font-size: var(--ntk-font-size-2xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-secondary);
}

.shop__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ntk-spacing-sm);
  margin-block-start: var(--ntk-spacing-sm);
}

.shop__card-title {
  margin: 0;
  font-size: var(--ntk-font-size-base);
  font-weight: var(--ntk-font-weight-semibold);
  color: var(--ntk-text-primary);
}

.shop__price {
  margin: 0;
  font-size: var(--ntk-font-size-lg);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-text-primary);
}

.shop__cart {
  display: flex;
  flex-direction: column;
  gap: var(--ntk-spacing-md);
}

.shop__cart-empty {
  margin: 0;
  color: var(--ntk-text-secondary);
}

.shop__cart-total {
  margin: 0;
  text-align: end;
  color: var(--ntk-text-primary);
}
</style>