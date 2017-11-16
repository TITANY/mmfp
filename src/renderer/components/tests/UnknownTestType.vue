<template>
    <p>(неподдерживаемый тип вопроса: {{ type }})</p>
</template>

<script>
export default {
    name: 'unknown-test-type',
    props: {
        'type': String
    }
};
</script>