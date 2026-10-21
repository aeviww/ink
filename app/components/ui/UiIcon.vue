<script setup lang="ts">
import { ICONS, type IconName } from '~/utils/icons'

defineProps<{ name: IconName }>()
</script>

<template>
  <Icon :name="ICONS[name]" aria-hidden="true" />
</template>
