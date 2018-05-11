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
    name: 'UnknownContentType',
    props: {
        'content': String,
        'contentType': String
    }
};
</script>
