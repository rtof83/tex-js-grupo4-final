<template>
  <div class="content">
    <div class="panel">
      <h1>Contatos</h1>

      <hr>

      <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Telefone</th>
              <th scope="col">Assunto</th>
              <th scope="col">Mensagem</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>

          <tr v-for="item in contacts" :key="item._id">

            <template v-if="!item.page">

            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.subject }}</td>
            <td>{{ item.message }}</td>
            
            <td>
              <div class="actions">
                <div class="actions__item bi bi-trash3-fill"
                     @mouseover="(e) => hovering(e, 'bi-trash3')"
                     @mouseout="(e) => hovering(e, 'bi-trash3-fill')"
                     @click="deleteRecord(item._id)">
                </div>
              </div>
            </td>

            </template>

          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AdminContacts',

    data() {
      return {
      }
    },

    computed: {
      contacts() {
        return this.$store.state.contactsModule.contacts;
      }
    },

    methods: {
      hovering(e, action) {
        e.target.classList.remove(e.target.classList[2]);
        e.target.classList.add(action);
      },

      deleteRecord(id) {
        if (window.confirm('Tem certeza que deseja excluir este registro?'))
          this.$store.dispatch("contactsModule/deleteContact", id);
      }
    },

    mounted() {
      this.$store.dispatch('contactsModule/getContacts');
    }
  }
</script>

<style scoped lang="scss">
  @import "@/assets/scss/admin-component.scss";
</style>
