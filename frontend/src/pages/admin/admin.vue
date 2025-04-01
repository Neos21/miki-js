<script setup lang="ts">
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyString } from '../../common/helpers/is-empty-string';
import { useAdminStore } from '../../shared/stores/use-admin-store';

const router = useRouter();

const adminStore = useAdminStore();

onMounted(() => {
  if(isEmptyString(adminStore.getJwt())) {
    router.push('/admin/login');
  }
  else {
    router.push('/admin/home');
  }
});
</script>
