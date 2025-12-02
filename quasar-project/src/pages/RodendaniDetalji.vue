<template>
  <q-page padding class="q-pa-md">

    <div class="text-h4 q-mb-md">
      Fotografiranje rođendana
    </div>

    <q-img
      src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D"
      style="height: auto"
      class="rounded-borders q-mb-xl bg-grey-3"
    />

    <!-- tu cu stavit opis -->
    <div class="text-body1 q-mb-xl">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Cras id pretium urna. Fusce vel pretium sapien. Vestibulum
      ante ipsum primis in faucibus orci luctus et ultrices posuere
      cubilia curae; Praesent scelerisque eros vitae lacus pharetra,
      non feugiat massa laoreet.
    </div>

    <div class="text-h5 q-mb-sm">
      Što uključuje usluga?
    </div>

    <ul class="q-mb-xl">
      <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
      <li>Donec pulvinar, ligula non sagittis tincidunt.</li>
      <li>Etiam vehicula metus ac risus finibus tincidunt.</li>
      <li>Aliquam fringilla mauris eget feugiat placerat.</li>
    </ul>

    <q-card flat bordered class="q-pa-md q-mb-xl">
      <div class="text-h6 q-mb-sm">Cijena usluge</div>
      <div class="text-subtitle1">
        €X
      </div>
    </q-card>

    <!-- primjeri rada, za sad su placeholderi -->
    <div class="text-h5 q-mb-md">Primjeri rada</div>

    <q-img
      src="https://placehold.co/600x400"
      style="height: auto"
      class="rounded-borders q-mb-md"
    />

    <q-img
      src="https://placehold.co/600x400"
      style="height: auto"
      class="rounded-borders q-mb-xl"
    />

  </q-page>
</template>

<script setup>
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>