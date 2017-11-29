<template>
<superuser-protector>
    <div>Editor...</div>
</superuser-protector>
</template>

<script>
import SuperuserProtector from './misc/SuperuserProtector.vue';


export default {
    name: 'editor',

    components: {
        SuperuserProtector
    }
};
</script>
