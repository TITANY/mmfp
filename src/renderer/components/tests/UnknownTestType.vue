<template>
    <p>(неподдерживаемый тип вопроса: {{ type }})</p>
</template>

<script>
export default {
    name: 'UnknownTestType',
    props: {
        'type': String
    }
};
</script>
