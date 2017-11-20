<template>
<div>
    <p>
        Неподдерживаемый тип файла {{ contentType }}! Содержимое файла:
    </p>
    <pre>{{ content }}</pre>
</div>
</template>
<script>
export default {
    name: 'unknown-content-type',
    props: {
        'content': String,
        'contentType': String
    }
};
</script>
