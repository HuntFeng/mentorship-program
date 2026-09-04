<template>
  <UApp>
    <div class="page-shell">
      <NuxtRouteAnnouncer />
      <header class="site-header">
        <NuxtLink to="/" class="wordmark">IASE</NuxtLink>
        <a class="text-link" href="mailto:hunt.feng@usask.ca">Contact</a>
      </header>

      <main>
        <section class="hero" aria-labelledby="page-title">
          <p class="eyebrow">Institute of Advanced Science Education</p>
          <h1 id="page-title">
            Start your research journey with a graduate-student mentor.
          </h1>
          <p class="intro">
            We help motivated high school students explore research through
            thoughtful guidance, practical goals, and projects shaped around
            their interests.
          </p>

          <form class="intake-form" @submit.prevent="bookSession">
            <div class="form-heading">
              <h2>
                Meet one of our mentors online in a project exploration session
              </h2>
              <p>Complete these details to request your session.</p>
            </div>
            <div class="form-grid">
            <UFormField label="Email" name="email" required :error="formErrors.email"
              ><UInput
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                size="lg"
            /></UFormField>
            <UFormField label="Name" name="name" required :error="formErrors.name"
              ><UInput v-model="form.name" placeholder="Your name" size="lg"
            /></UFormField>
            <UFormField label="Grade" name="grade" required :error="formErrors.grade"
              ><UInput
                v-model="form.grade"
                placeholder="e.g. Grade 11"
                size="lg"
            /></UFormField>
            <UFormField label="Research area" name="researchArea" required
              ><USelect
                v-model="form.researchArea"
                :items="researchAreas"
                placeholder="Select an area"
                size="lg"
            /></UFormField>
            <UFormField
              label="Why do you want to do research (optional)"
              name="intro"
              :error="formErrors.intro"
              ><UTextarea class="w-full" v-model="form.intro" placeholder="Tell us about yourself!" size="lg"
            /></UFormField>
            </div>
            <UButton
              type="submit"
              size="xl"
              class="book-session-button disabled:bg-gray-500 mt-3"
              :disabled="!isFormComplete || !isFormValid"
              :loading="isBooking"
              >Sign Up</UButton
            >
            <p v-if="bookingMessage" class="booking-message" role="status">
              {{ bookingMessage }}
            </p>
          </form>
        </section>

        <section class="product" aria-labelledby="session-title">
          <p class="eyebrow">Our first step</p>
          <h2 id="session-title">Research Exploration Session</h2>
          <p>
            In a one-on-one online session, a mentor gets to know your academic
            background, interests, and current skills, then helps identify
            promising research directions and next steps.
          </p>
        </section>

        <section class="next-step" aria-labelledby="next-title">
          <h2 id="next-title">What happens next?</h2>
          <UTimeline :items="timelineItems" class="timeline" />
        </section>
      </main>

      <footer>
        <span>Institute of Advanced Science Education</span>
        <a href="mailto:hunt.feng@usask.ca">hunt.feng@usask.ca</a>
      </footer>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const form = reactive({
  email: "",
  name: "",
  grade: "",
  researchArea: "",
  intro: "",
});
const formErrors = reactive({
  email: "",
  name: "",
  grade: "",
  intro: "",
});
const researchAreas = ["AI", "Physics"];
const isBooking = ref(false);
const bookingMessage = ref("");

const isFormComplete = computed(
  () =>
    form.email.trim() !== "" &&
    form.name.trim() !== "" &&
    form.grade.trim() !== "" &&
    form.researchArea !== "",
);

const isFormValid = computed(
  () => !Object.values(getValidationErrors()).some(Boolean),
);

const timelineItems = [
  {
    title: "Step 1 — Submit Your Application",
    description:
      "Complete the short application form with your background and research interests.",
    icon: "i-lucide-file-text",
  },
  {
    title: "Step 2 — Application Review",
    description:
      "We review your application to ensure we have a suitable mentor available for your interests.",
    icon: "i-lucide-search-check",
  },
  {
    title: "Step 3 — Research Exploration Session ($99 CAD)",
    description:
      "If accepted, you will receive an invoice and be matched with a mentor for a 30–60 minute online session. During the session, we will discuss your interests and goals, academic background, coding and technical skills, and potential research directions.",
    icon: "i-lucide-video",
  },
  {
    title: "Step 4 — Personalized Research Roadmap",
    description:
      "After the session, you will receive recommendations on suitable research projects and next steps.",
    icon: "i-lucide-map",
  },
  {
    title: "Step 5 — Optional Mentorship Program",
    description:
      "Students who are a good fit may be invited to continue into a longer-term research mentorship program.",
    icon: "i-lucide-sparkles",
  },
];

function getValidationErrors() {
  const email = form.email.trim();
  const name = form.name.trim();
  const grade = form.grade.trim();
  const intro = form.intro.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return {
    email: email && !emailPattern.test(email) ? "Enter a valid email address." : "",
    name:
      name && name.length >= 100 ? "Name must be fewer than 100 characters." : "",
    grade:
      grade && grade.length >= 50 ? "Grade must be fewer than 50 characters." : "",
    intro:
      intro && (intro.match(/\S+/g)?.length ?? 0) >= 1000
        ? "Introduction must be fewer than 1,000 words."
        : "",
  };
}

function validateForm() {
  Object.assign(formErrors, getValidationErrors());
  return !Object.values(formErrors).some(Boolean);
}

async function bookSession() {
  bookingMessage.value = "";
  if (!isFormComplete.value || !validateForm()) return;

  isBooking.value = true;
  try {
    const { error } = await supabase.from("signups").insert({
      email: form.email.trim(),
      name: form.name.trim(),
      grade: form.grade.trim(),
      research_area: form.researchArea,
      intro: form.intro.trim(),
    });

    if (error) throw error;

    bookingMessage.value = "Thanks you! Your sign up has been received. We do our best to match you a mentor. This will take a few business days.";
    Object.assign(form, {
      email: "",
      name: "",
      grade: "",
      researchArea: "",
      intro: "",
    });
  } catch (error) {
    console.error("Unable to save signup:", error);
    bookingMessage.value =
      "We couldn't submit your signup. Please try again shortly.";
  } finally {
    isBooking.value = false;
  }
}
</script>

<style>
:root {
  color: #edf4ee;
  background: #101512;
  color-scheme: dark;
  font-family: Georgia, "Times New Roman", serif;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #101512;
}
a {
  color: inherit;
}
.page-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 28px;
}
.site-header,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 0;
}
.site-header {
  border-bottom: 1px solid #39443c;
}
.wordmark {
  font-family: Arial, sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
}
.text-link {
  text-underline-offset: 4px;
}
.hero {
  max-width: 800px;
  padding: 112px 0 96px;
}
.eyebrow {
  margin: 0 0 17px;
  color: #aab9ad;
  font-family: Arial, sans-serif;
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h1,
h2,
p {
  margin-top: 0;
}
h1 {
  margin-bottom: 25px;
  font-size: clamp(2.65rem, 7vw, 5.25rem);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.98;
}
h2 {
  margin-bottom: 18px;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 1.06;
}
.intro {
  max-width: 620px;
  font-size: 1.22rem;
  line-height: 1.6;
}
.intake-form {
  margin-top: 38px;
  padding: 28px;
  border: 1px solid #39443c;
  background: #1a221d;
}
.form-heading h2 {
  margin-bottom: 7px;
  font-size: 1.55rem;
  letter-spacing: -0.025em;
}
.form-heading p {
  margin-bottom: 24px;
  color: #aab9ad;
  font-family: Arial, sans-serif;
  font-size: 0.92rem;
}
.form-grid {
  display: grid;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}
.intake-form .ui-form-field {
  min-width: 0;
}
.intake-form .ui-input,
.intake-form .ui-select {
  width: 100%;
}
.book-session-button {
  width: 100%;
  min-height: 68px;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.booking-message {
  margin: 14px 0 0;
  color: #88d4a0;
  font-family: Arial, sans-serif;
  font-size: 0.88rem;
}
.detail {
  margin: 16px 0 0;
  color: #aab9ad;
  font-family: Arial, sans-serif;
  font-size: 0.83rem;
}
.product,
.next-step {
  border-top: 1px solid #39443c;
  padding: 65px 0;
}
.product {
  max-width: 720px;
}
.product p:not(.eyebrow) {
  max-width: 650px;
  font-size: 1.13rem;
  line-height: 1.65;
}
.next-step {
  max-width: 800px;
  padding-bottom: 92px;
}
.timeline {
  margin-top: 34px;
}
.timeline [data-slot="title"] {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.18rem;
  font-weight: 400;
}
.timeline [data-slot="description"] {
  max-width: 640px;
  font-family: Arial, sans-serif;
  line-height: 1.55;
}
footer {
  border-top: 1px solid #39443c;
  color: #aab9ad;
  font-family: Arial, sans-serif;
  font-size: 0.8rem;
}
@media (max-width: 560px) {
  .page-shell {
    padding: 0 20px;
  }
  .hero {
    padding: 75px 0 65px;
  }
  .site-header,
  footer {
    gap: 16px;
  }
  footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .intake-form {
    margin-inline: -4px;
    padding: 22px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
