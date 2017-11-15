<template>
    <div v-html="content">
    </div>
</template>

<script>
export default {
    name: 'html-part-viewer',
    props: {
        'content': {
            type: String,
            default: 'Ошибка загрузки теории!'
        }
    }
};
</script>
