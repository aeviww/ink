<script setup lang="ts">
import { CONTENT_MAX_LENGTH } from "#shared/constants";

const props = defineProps<{
  length: number;
  savedAt: Date | null;
  busy: boolean;
  canPublish: boolean;
  publishLabel: string;
}>();

const draftEnabled = defineModel<boolean>("draftEnabled", { required: true });
const emit = defineEmits<{ publish: [] }>();

const numberFormat = new Intl.NumberFormat("ru-RU");
const isOverLimit = computed(() => props.length > CONTENT_MAX_LENGTH);
const counter = computed(
  () =>
    `${numberFormat.format(props.length)} / ${numberFormat.format(CONTENT_MAX_LENGTH)}`,
);
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
    <div class="flex items-center gap-4">
      <UiToggleSwitch v-model="draftEnabled" label="автосохранение" />
      <span
        v-if="draftEnabled && savedAt"
        class="hidden text-xs text-subtle sm:inline"
        >сохранено локально</span
      >
    </div>

    <div class="flex items-center gap-4">
      <span
        class="text-xs tabular-nums"
        :class="isOverLimit ? 'text-danger' : 'text-subtle'"
        >{{ counter }}</span
      >
      <UiButton
        variant="primary"
        :loading="busy"
        :disabled="!canPublish"
        @click="emit('publish')"
      >
        {{ publishLabel }}
      </UiButton>
    </div>
  </div>
</template>
