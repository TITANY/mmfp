<template>
    <v-dialog
        :value="dialog"
        lazy
        absolute
        @input="onDialogInput"
        persistent
        max-width="750px"
    >
        <v-card>
            <v-card-title v-if="title">
                <slot name="title"></slot>
            </v-card-title>
            <v-card-text>
                <slot></slot>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(action, i) in nActions"
                    :flat="action.style.flat"
                    :class="action.style.class"
                    :key="i"
                    @click.native="onAction(action)"
                >{{ action.label }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'MmfpDialog',
    props: {
        'value': Boolean,
        'actions': {
            type: Array,
            default: () => [{ action: 'close', label: 'Закрыть', closes: true, style: { flat: true } }]
        },
        'persistent': {
            type: Boolean,
            default: true
        },
        'title': {
            default: false
        },
        'width': {
            type: String,
            default: '25%'
        }
    },
    data() {
        return {
            dialog: this.value
        };
    },
    computed: {
        nActions: function () {
            return this.actions.map(a => {
                let {
                    action,
                    label = action,
                    closes = false,
                    style = {}
                } = a;
                let { flat = true } = style;
                let theClass = style['class'] || '';

                return {
                    action, label, closes, style: { flat, class: theClass }
                };
            });
        }
    },
    methods: {
        onDialogInput: function (input) {
            this.$emit('input', input);
            this.$emit('result', false);
        },
        onAction: function (action) {
            this.$emit('result', action.action);
            if (action.closes) {
                this.$emit('input', false);
            }
        }
    },
    watch: {
        value: function (nval) {
            this.dialog = nval;
        }
    }
};
</script>
