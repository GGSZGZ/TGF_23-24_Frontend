<script setup lang="ts">
import { ref } from 'vue';
import CartItem from '@/components/CartItem.vue'
import TotalItem from '@/components/TotalItem.vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToHome = () => {
  router.push('/');
};

const finalPrice = ref(0);

const updatePrice = (price:any) => {
  finalPrice.value = price;
};
</script>

<template>
    <h1 class="title">Your Cart</h1>
    <hr class="bar">
    <div class="cart-content">
      <CartItem class="cart-item" @update-price="updatePrice" />
      <TotalItem class="total-item" :finalPrice="finalPrice" />
    </div>
    <button class="continue" @click="navigateToHome">Continue Buying</button>
</template>


<style scoped>

.title {
  font-family: var(--font-archivo-black);
  margin-top: 40px;
  margin-left: 20px;
  color: var(--neutral-colors-white)
}

.bar {
  top: 109px;
  width: 95%;
  border-color: #000;
  margin-left: 25px;
  margin-top: 5px;
}

.cart-content {
  display: flex;
  justify-content: space-between;
  width: 97%;
  margin-top: 20px;
}

.cart-item {
  flex: 3;
}

.total-item {
  flex: 1;
  margin-left: 20px;
}
.continue{
    background-color: var(--color-yellow);
    width:140px;
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    border-radius: 5px;
    font-family: var(--font-roboto);
}
.continue:hover{
  color: var(--color-blue);
}
@media (max-width: 750px){
  .cart-content{
    display: block;
  }
}
</style>
