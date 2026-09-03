<template>
  <div class="page-shell">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <NuxtLink to="/" class="wordmark">IASE</NuxtLink>
      <a class="text-link" href="mailto:hunt.feng@usask.ca">Contact</a>
    </header>

    <main>
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">Institute of Advanced Science Education</p>
        <h1 id="page-title">Start your research journey with a graduate-student mentor.</h1>
        <p class="intro">
          We help motivated high school students explore research through thoughtful
          guidance, practical goals, and projects shaped around their interests.
        </p>
        <button class="button" type="button" :disabled="isCheckingOut" @click="startCheckout">
          {{ isCheckingOut ? 'Opening secure checkout…' : 'Book a research readiness assessment' }}
        </button>
        <p v-if="checkoutError" class="checkout-error" role="alert">{{ checkoutError }}</p>
        <p class="detail">Online · 30–60 minutes · Meet one of our mentors</p>
      </section>

      <section class="product" aria-labelledby="assessment-title">
        <p class="eyebrow">Our first step</p>
        <h2 id="assessment-title">Research Readiness Assessment</h2>
        <p>
          In a one-on-one online interview, a mentor gets to know your academic
          background, interests, and current skills. Afterwards, they will outline
          personalised project directions and skills that could help you prepare.
        </p>
        <a class="text-link" :href="assessmentEmail">Request an assessment →</a>
      </section>

      <section class="next-step" aria-labelledby="next-title">
        <h2 id="next-title">What happens next?</h2>
        <p>
          If the plan feels right, your graduate-student mentor will work with you
          for two to four months, depending on the project length, meeting weekly for 1–2 hours to give guidance, feedback,
          and achievable goals.
        </p>
      </section>
    </main>

    <footer>
      <span>Institute of Advanced Science Education</span>
      <a href="mailto:hello@advancedscienceeducation.com">hello@advancedscienceeducation.com</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const stripeProductId = computed(() => config.public.stripeProductId || 'Available on request')
const assessmentEmail = computed(() =>
  `mailto:hello@advancedscienceeducation.com?subject=${encodeURIComponent('Research Readiness Assessment')}`
)
const isCheckingOut = ref(false)
const checkoutError = ref('')

// Nuxt Scripts keeps Stripe.js available for future embedded checkout work.
useScriptStripe({ trigger: 'manual' })

async function startCheckout() {
  isCheckingOut.value = true
  checkoutError.value = ''

  try {
    const { url } = await $fetch<{ url: string }>('/api/create-checkout-session', { method: 'POST' })
    await navigateTo(url, { external: true })
  } catch {
    checkoutError.value = 'We couldn’t open checkout. Please try again or contact us for help.'
    isCheckingOut.value = false
  }
}
</script>

<style>
:root { color: #16261f; background: #f8f7f2; font-family: Georgia, 'Times New Roman', serif; }
* { box-sizing: border-box; }
body { margin: 0; }
a { color: inherit; }
.page-shell { max-width: 980px; margin: 0 auto; padding: 0 28px; }
.site-header, footer { display: flex; align-items: center; justify-content: space-between; padding: 25px 0; }
.site-header { border-bottom: 1px solid #d7dbd3; }
.wordmark { font-family: Arial, sans-serif; font-size: 1.05rem; font-weight: 800; letter-spacing: .08em; text-decoration: none; }
.text-link { text-underline-offset: 4px; }
.hero { max-width: 720px; padding: 112px 0 96px; }
.eyebrow { margin: 0 0 17px; color: #52665b; font-family: Arial, sans-serif; font-size: .73rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, p { margin-top: 0; }
h1 { margin-bottom: 25px; font-size: clamp(2.65rem, 7vw, 5.25rem); font-weight: 400; letter-spacing: -.055em; line-height: .98; }
h2 { margin-bottom: 18px; font-size: clamp(2rem, 4vw, 3rem); font-weight: 400; letter-spacing: -.035em; line-height: 1.06; }
.intro { max-width: 620px; font-size: 1.22rem; line-height: 1.6; }
.button { display: inline-block; margin-top: 15px; border: 0; padding: 15px 20px; background: #183d2b; color: #fff; cursor: pointer; font-family: Arial, sans-serif; font-size: .9rem; font-weight: 700; text-decoration: none; }
.button:hover { background: #28583f; }
.button:disabled { cursor: wait; opacity: .75; }
.checkout-error { margin: 14px 0 0; color: #8a2424; font-family: Arial, sans-serif; font-size: .88rem; }
.detail, .stripe-reference { color: #52665b; font-family: Arial, sans-serif; font-size: .83rem; }
.detail { margin-top: 16px; }
.product, .next-step { border-top: 1px solid #d7dbd3; padding: 65px 0; }
.product { max-width: 720px; }
.product p:not(.eyebrow):not(.stripe-reference), .next-step p { max-width: 650px; font-size: 1.13rem; line-height: 1.65; }
.stripe-reference { margin: 30px 0 0; }
.next-step { padding-bottom: 92px; }
footer { border-top: 1px solid #d7dbd3; color: #52665b; font-family: Arial, sans-serif; font-size: .8rem; }
@media (max-width: 560px) { .page-shell { padding: 0 20px; } .hero { padding: 75px 0 65px; } .site-header, footer { gap: 16px; } footer { align-items: flex-start; flex-direction: column; } }
</style>
