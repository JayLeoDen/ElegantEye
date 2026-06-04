<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="ee-page" style="padding-top:0;padding-bottom:0">
        <q-toolbar-title class="text-weight-bold">Elegant Eye</q-toolbar-title>
        <q-btn flat label="Početna" to="/" />
        <q-btn flat label="Usluge" to="/usluge" />
        <q-btn flat label="Pomoć" icon="help_outline" to="/pomoc" />
        <q-btn outline color="primary" label="Prijava" to="/auth" class="q-ml-sm" />
      </q-toolbar>
    </q-header>
    <q-page-container><router-view /></q-page-container>
  </q-layout>
</template>
