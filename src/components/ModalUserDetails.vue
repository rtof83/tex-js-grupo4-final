<template>
  <div id="modalUserDetails" class="escolha__modal">
    <!-- Modal content -->
    <div class="escolha__modal__modal-content">
      <img
        src="../../src/assets/images/close.png"
        @click="closeModal"
        id="closeModalUserDetails"
        class="escolha__modal__modal-content__close"
      />
      <div>
        <h2>Atualizar dados cadastrais</h2>
      </div>

      <div>
        <form>
          <label for="name">Nome: </label>
          <input
            v-model="validate.name"
            type="text"
            placeholder="Digite seu nome"
            id="name"
            name="name"
          />

          <label for="email">Email:</label>
          <input
            v-model="validate.email"
            type="text"
            placeholder="Digite seu email"
            id="email"
            name="email"
            disabled
          />

          <label for="password">Senha:</label>
          <input
            v-model="validate.password"
            type="password"
            placeholder="Digite sua senha..."
            id="password"
            name="password"
          />
        </form>
        <div class="escolha__modal__modal-content__div">
          <button
            class="escolha__modal__modal-content__div__btn"
            @click="updateUser(validate)"
          >
            Salvar mudanças
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ModalUserDetails",

  data() {
    return {};
  },

  computed: {
    modal() {
      return this.$store.state.modal;
    },

    allUsers() {
      return this.$store.state.usersModule.users;
    },

    validate() {
      return this.$store.state.loginModule.validate;
    },
  },

  mounted() {
    document.addEventListener("click", this.onClick);
    this.$store.dispatch("usersModule/getUsers");
  },

  beforeDestroy() {
    document.removeEventListener("click", this.onClick);
  },

  methods: {
    closeModal() {
      this.modal.showUserDetails = "none";
    },

    removeQuotesSpaces(str) {
      return str.replaceAll("'", "").replaceAll('"', "").trim();
    },

    notify() {
      toast("Dados alterados com sucesso!", {
        autoClose: 3000,
      });
    },

    wrongPasswordRegex() {
      toast(
        "A senha deve ter entre 8 a 15 caracteres, com letras maiúsculas, minúsculas, números e caracteres especiais.",
        {
          autoClose: 3000,
        }
      );
    },

    onClick(e) {
      const modal = document.getElementById("modalUserDetails");
      if (e.target === modal) this.closeModal();
    },

    updateUser(data) {
      // validação do input password
      if (
        !this.validate.password ||
        !this.validate.password.match(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,15}$/
        )
      ) {
        return this.wrongPasswordRegex();
      }

      // atualização do usuário
      this.$store.dispatch("usersModule/updateUser", data);
      this.validate.password = "";
      this.closeModal();
      this.notify();
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/modal.scss";

.escolha__modal {
  display: v-bind("modal.showUserDetails");

  &__modal-content {
    & h1 {
      text-align: center;
    }

    & form {
      font-size: 1.2rem;
      display: grid;
      place-items: center;

      & label {
        width: 50%;
        text-align: left;
        font-weight: bold;
      }

      & input {
        font-weight: bold;
        font-size: 1.2rem;
        width: 50%;
        padding: 0.5rem;
        border-radius: 0.3rem;
        border: 1px solid black;
        margin-bottom: 1rem;

        &::placeholder {
          font-style: italic;
        }
      }
    }

    &__div {
      text-align: center;

      &__btn {
        font-size: 1rem;
      }
    }
  }
}

/* --------------  RESPONSIVIDADE ----------------  */
/* MOBILE PORTRAIT */
@media (max-width: 414px) and (orientation: portrait) {
  .escolha__modal {
    &__modal-content {
      width: 90%;

      & form {
        & label {
          width: 80%;
        }

        & input {
          width: 80%;
        }
      }
    }
  }
}
</style>
