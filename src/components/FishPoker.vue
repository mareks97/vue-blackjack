<template>
  <div class="fish"  :class="[fishClass, disabledClass]">
    {{ value }}
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      fishClass: "",
      disabledClass: ""
    };
  },
  computed: {
    totalBank() {
      return this.$store.getters.totalBank;
    },
  },
  watch: {
    //apply disabled class when totalBank - bet is < 0
    totalBank(newValue) {
      if (newValue - this.value < 0) {
        this.disabledClass = 'fish-disables'
      } else{
        this.disabledClass = ''
      } 
    },
  },
  methods: {
    getClass() {
      switch (this.value) {
        case 1:
          this.fishClass = "one";
          break;
        case 5:
          this.fishClass = "five";
          break;
        case 25:
          this.fishClass = "twofive";
          break;
        case 100:
          this.fishClass = "hundred";
          break;
      }
    },
  },
  mounted() {
    this.getClass();
  },
};
</script>

<style scoped>
.fish {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 20px;
  width: 4rem;
  height: 4rem;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 3px 0px #888888, 0px 2px 6px rgba(0, 0, 0, 0.9);
}

.fish.one {
  background-color: rgb(236, 236, 236);
  border: 5px dashed rgb(15, 15, 15);
}
.fish.five {
  background-color: rgb(158, 11, 11);
  border: 5px dashed white;
  color: white;
}
.fish.twofive {
  background-color: rgb(28, 4, 165);
  border: 5px dashed white;
  color: white;
}
.fish.hundred {
  background-color: rgb(25, 61, 18);
  border: 5px dashed white;
  color: rgb(230, 230, 230);
}

.fish-disables {
  pointer-events: none;
  cursor: default;
  filter: grayscale();
}
</style>
