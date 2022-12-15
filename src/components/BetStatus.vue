<template>
  <div class="status-card">
    <p class="current">${{totalBank}}</p>
    <p class="bet">Current bet: ${{currentBet}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
	computed: {
		totalBank(){
			return this.$store.getters.totalBank
		},
		currentBet(){
			return this.$store.getters.currentBet
		}
	}
};
</script>

<style scoped>
.status-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  background-color: rgb(169, 236, 245);
  position: fixed;
  top: 25px;
  right: 25px;
  border-radius: 20px;
  box-shadow: 0px 5px 0px #709096;
}

.current {
  font-weight: 700;
  color: black;
	font-size: 1.5rem;
}
</style>
