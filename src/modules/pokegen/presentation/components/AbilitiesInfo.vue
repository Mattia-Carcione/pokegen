<script setup>
const { abilities } = defineProps(['abilities']);

const hiddenAbilities = abilities.filter((ability) => ability.isHidden);
const regularAbilities = abilities.filter((ability) => !ability.isHidden);
</script>

<template>
  <section class="pokemon-abilities w-full flex flex-wrap gap-1 items-center justify-center bg-[var(--bg-custom)]/75 rounded-xl py-1 mt-3" aria-label="Pokémon abilities information" role="region">
    <!-- Abilità normali -->
    <article v-if="regularAbilities.length">
      <h2 class="sr-only">Normal Pokémon Abilities</h2>
      <table class="w-full rounded-xl" aria-label="Normal Pokémon abilities">
        <caption class="sr-only">Normal Pokémon abilities of the selected Pokémon</caption>
        <thead>
          <tr>
            <th v-for="ability in regularAbilities" :key="ability.name" class="p-1" scope="col">
              {{ ability.slot }} Ability:
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="ability in regularAbilities" :key="ability.name" class="p-1 font-semibold italic capitalize">
              {{ ability.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </article>

    <!-- Abilità nascoste -->
    <article v-if="hiddenAbilities.length">
      <h2 class="sr-only">Hidden Pokémon Abilities</h2>
      <table class="w-full rounded-xl" aria-label="Hidden Pokémon abilities">
        <caption class="sr-only">Hidden Pokémon abilities of the selected Pokémon</caption>
        <thead>
          <tr>
            <th v-for="ability in hiddenAbilities" :key="ability.name" class="p-1" scope="col">
              {{ ability.slot }} Ability:
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="ability in hiddenAbilities" :key="ability.name" class="p-1 font-semibold italic capitalize">
              {{ ability.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>
