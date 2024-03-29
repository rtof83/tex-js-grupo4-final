<template>
  <HeaderComponent />

  <main>
    <section class="container">
      <article>
        <div>
          <h2 class="container__subtitle">Faça sua Reserva!</h2>
          <span class="container__detalhe"></span>
          <p>Forneça a data de entrada, saída e quantidade de pessoas:</p>
        </div>

        <form class="container__form">
          <div>
            <label for="checkin">Check-in:</label>
            <input v-model="reservation.checkin" id="checkin" type="date" />
          </div>
          <div>
            <label for="checkout">Check-out:</label>
            <input
              v-model="reservation.checkout"
              @change="checkDate"
              id="checkout"
              type="date"
            />
          </div>
          <div>
            <label for="qtd_adultos">Número de hóspedes:</label>
            <input
              v-model="reservation.qty"
              id="qtd_adultos"
              type="number"
              min="1"
              max="4"
              placeholder="limite de 4 pessoas"
            />
          </div>
        </form>
      </article>

      <CreateAccommodations :id="id" />
      <Booking />
    </section>
  </main>

  <FooterComponent />
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import CreateAccommodations from "@/components/CreateAccommodations.vue";
import Booking from "@/components/Booking.vue";
import { addDays } from "@/store/getDate.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ReservationsView",

  props: ["id"],

  components: {
    HeaderComponent,
    FooterComponent,
    CreateAccommodations,
    Booking,
  },

  computed: {
    reservation() {
      return this.$store.state.reservation;
    },

    applyCoupon() {
      return this.$store.state.applyCoupon;
    },

    accommodations() {
      return this.$store.state.accommodationsModule.accommodations;
    },

    services() {
      return this.$store.state.servicesModule.services;
    },
  },

  watch: {
    reservation: {
      handler() {
        // validate date
        if (this.reservation.checkout <= this.reservation.checkin) {
          this.notify();
          this.reservation.checkout = addDays(
            new Date(this.reservation.checkout),
            1,
            true
          );
        }

        const accommodation = this.accommodations.find(
          (item) => item.id === this.reservation.accommodationId
        );
        this.reservation.accommodation = accommodation.name;
        this.reservation.accommodationDesc = accommodation.description;
        this.reservation.accommodationTotal = this.reservation.rates * this.reservation.qty * accommodation.price;
        this.reservation.accommodationImage = accommodation.image;

        let sumServices = 0;
        this.reservation.services.map((service) => (sumServices += parseFloat(service.price)));

        const report = JSON.parse(localStorage.getItem("report"));
        if (report) this.reservation.itemsBar = report.totalItems;

        this.reservation.rates =
          (new Date(this.reservation.checkout) - new Date(this.reservation.checkin)) / 86400000;

        this.reservation.total =
          this.reservation.itemsBar + sumServices +
          this.reservation.rates * this.reservation.qty * accommodation.price;

        this.reservation.total -= this.reservation.total * this.reservation.discount;

        // set to localStorage
        localStorage.setItem("booking", JSON.stringify(this.reservation));
      },

      deep: true,
    },
  },

  methods: {
    init() {
      this.$store.commit("initReservation");
    },

    notify() {
      toast(
        "Atenção! A data de Check-out não pode ser menor ou igual à data de Check-in.",
        {
          autoClose: 3000,
        }
      );
    },
  },

  async mounted() {
    await this.$store.dispatch('accommodationsModule/getAccommodations');
    const booking = JSON.parse(localStorage.getItem('booking'));
    
    if (booking) {
      this.reservation.accommodation = booking.accommodation;
      this.reservation.accommodationId = booking.accommodationId;
      this.reservation.checkin = booking.checkin;
      this.reservation.checkout = booking.checkout;
      this.reservation.qty = booking.qty;
      this.reservation.rates = booking.rates;
      this.reservation.services = booking.services;
      this.reservation.accommodationDesc = booking.accommodationDesc;
      this.reservation.accommodationTotal = booking.accommodationTotal;
      this.reservation.accommodationImage = booking.accommodationImage;

      const accommodation = this.accommodations.find(
        (item) => item.id === this.reservation.accommodationId
      );

      let sumServices = 0;
      this.reservation.services.map((service) => (sumServices += parseFloat(service.price)));
      
      this.reservation.total = sumServices +
          this.reservation.rates * this.reservation.qty * accommodation.price;
    } else {
      this.$store.commit("initReservation");
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/reservas.scss";
@import "@/assets/scss/header.scss";
@import "@/assets/scss/footer.scss";
</style>
