Vue.component('search', {
    data() {
        return {
            userSearch: '',
        }
    },
    props: ['filter'],
    template: `
        <form action="#" class="search-form" @submit.prevent="$emit('filter')">
            <input type="text" class="search-field" v-model="userSearch">
            <button class="btn-search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>`
})