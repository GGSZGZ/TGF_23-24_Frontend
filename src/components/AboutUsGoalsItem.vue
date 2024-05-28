<script setup lang="ts">
import { ref, onMounted } from 'vue';

const aboutUs = ref({
  title: '',
  sections: []
});

async function loadAboutUs() {
  try {
    const response = await fetch('/src/assets/aboutUsGoals.json');
    if (!response.ok) {
      throw new Error('Error al cargar las categorías: ' + response.statusText);
    }
    const data = await response.json();
    aboutUs.value = data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  loadAboutUs();
});
</script>

<template>
  <v-container class="pa-4" fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-left custom-title">{{ aboutUs.title }}</h1>
        <v-divider class="custom-divider"></v-divider>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card class="pa-4 custom-card">
          <v-card-text>
            <p class="custom-text">
              {{ aboutUs.sections.length > 0 ? aboutUs.sections[0].content : '' }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex align-center justify-center black white--text custom-card" height="100%">
          <span>{{ aboutUs.sections.length > 1 ? aboutUs.sections[1].content : '' }}</span>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex align-center justify-center black white--text custom-card" height="100%">
          <span>{{ aboutUs.sections.length > 2 ? aboutUs.sections[2].content : '' }}</span>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-4 custom-card">
          <v-card-text>
            <p class="custom-text">
              {{ aboutUs.sections.length > 3 ? aboutUs.sections[3].content : '' }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
 span{
    color: var(--neutral-colors-white);
    font-family: var(--font-archivo-black);
    font-size: var(--font-size-25xl);
  }
.pa-4 {
  background-color: var(--color-dark-blue);
  margin-top: 50px;
  margin-bottom: 50px;
  width: 80%;
}

h1.custom-title {
  font-size: var(--font-size-25xl);
  font-family: var(--font-archivo-black);
  color: var(--neutral-colors-white);
}

p.custom-text {
  font-size: var(--font-size-xl);
  font-family: var(--font-roboto);
  color: var(--neutral-colors-white);
}

.custom-card {
  background-color: var(--color-dark-blue);
  border: 2px solid var(--color-black);
}

.custom-divider {
  background-color: var(--neutral-colors-white);
  opacity: inherit;
}
</style>