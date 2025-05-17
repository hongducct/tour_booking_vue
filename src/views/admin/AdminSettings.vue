<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Settings" icon="mdiCogOutline" main />
      <CardBox is-form @submit.prevent="submit">
        <FormField label="Tên website">
          <FormControl v-model="settings.name" required />
        </FormField>
        <FormField label="Email admin">
          <FormControl v-model="settings.email" type="email" required />
        </FormField>
        <template #footer>
          <BaseButtons>
            <BaseButton color="success" type="submit" label="Lưu thay đổi" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { reactive } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/admin/SectionTitleLineWithButton.vue'
import CardBox from '@/components/admin/CardBox.vue'
import FormField from '@/components/admin/FormField.vue'
import FormControl from '@/components/admin/FormControl.vue'
import BaseButton from '@/components/admin/BaseButton.vue'
import BaseButtons from '@/components/admin/BaseButtons.vue'

const settings = reactive({
  name: 'Booking Tour Pro',
  email: 'admin@tour.com',
})

const submit = () => {
  alert('Đã lưu cài đặt!')
}
</script>
