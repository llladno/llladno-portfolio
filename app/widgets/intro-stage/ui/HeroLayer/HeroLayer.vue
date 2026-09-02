<script setup lang="ts">
/*
 * The bottom layer of the intro: the portrait photo the camera pushes into.
 *
 * `public/hero.jpg` sits on top of an always-rendered CSS "studio" scene
 * (black room + orange spotlight + a stand-in laptop) so a missing or slow
 * photo still reads as the same shot. Purely decorative — the real H1 lives
 * in `IntroCopy` and the sections.
 */
import { HERO_IMAGE_SRC } from '~/widgets/intro-stage/ui/HeroLayer/constants'

const hasPhoto = ref(true)
</script>

<template>
  <div class="studio" aria-hidden="true">
    <img
      v-show="hasPhoto"
      :src="HERO_IMAGE_SRC"
      alt=""
      class="photo"
      decoding="async"
      fetchpriority="high"
      @error="hasPhoto = false"
    />

    <div v-if="!hasPhoto" class="stand-in">
      <div class="stand-in-screen" />
      <div class="stand-in-base" />
    </div>
  </div>
</template>

<style scoped>
.studio {
  position: absolute;
  inset: 0;
  overflow: hidden;
  /* Fallback scene, visible until/unless the photo covers it. */
  background:
    radial-gradient(
      42% 46% at 50% 42%,
      color-mix(in oklab, var(--color-wall-a) 70%, transparent),
      color-mix(in oklab, var(--color-wall-c) 45%, transparent) 45%,
      var(--color-glow-edge) 80%
    ),
    var(--color-glow-edge);
}

.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.stand-in {
  position: absolute;
  left: 50%;
  top: 56%;
  width: 30vmin;
  transform: translate(-50%, -50%);
}
.stand-in-screen {
  height: 19vmin;
  border: 0.5vmin solid oklch(0.22 0.01 40);
  border-radius: 1vmin 1vmin 0 0;
  background: radial-gradient(
    80% 80% at 50% 45%,
    var(--color-glow-core),
    color-mix(in oklab, var(--color-wall-c) 60%, black)
  );
  box-shadow: 0 0 14vmin 3vmin
    color-mix(in oklab, var(--color-glow-core) 35%, transparent);
}
.stand-in-base {
  height: 1.4vmin;
  border-radius: 0 0 1vmin 1vmin;
  background: linear-gradient(oklch(0.3 0.01 40), oklch(0.16 0.01 40));
}
</style>
