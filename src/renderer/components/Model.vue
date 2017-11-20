<template>
<login-protector>
    <v-layout row wrap justify-center>
        Wow, model!
    </v-layout>
</login-protector>
</template>

<script>
import LoginProtector from './misc/LoginProtector.vue';

export default {
    name: 'model-view',

    components: {
        LoginProtector
    }
};
</script>
